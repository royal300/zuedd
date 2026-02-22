import paramiko
import os
import sys

# Project root (where deploy_admin.py lives)
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
LOCAL_DIST = os.path.join(PROJECT_ROOT, 'dist')
LOCAL_API = os.path.join(PROJECT_ROOT, 'api')

VPS_HOST = os.environ.get('VPS_HOST', '93.127.206.52')
VPS_USER = os.environ.get('VPS_USER', 'root')
# Prefer env var for password: export VPS_PASS='yourpassword'
VPS_PASS = os.environ.get('VPS_PASS', 'Royal300@2026')

def main():
    if not os.path.isdir(LOCAL_DIST):
        print('ERROR: dist/ not found. Run "npm run build" first.')
        sys.exit(1)
    if not os.path.isdir(LOCAL_API):
        print('ERROR: api/ not found.')
        sys.exit(1)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS)
    sftp = client.open_sftp()

    # 1. Upload frontend
    print('\n=== Uploading frontend ===')
    upload_dir(sftp, LOCAL_DIST, '/var/www/zued')

    # 2. Upload backend files
    print('\n=== Uploading API files ===')
    for f in ['server.js', 'package.json']:
        src = os.path.join(LOCAL_API, f)
        if os.path.isfile(src):
            sftp.put(src, f'/var/www/zued-api/{f}')
            print(f'  Uploaded: {f}')
    if os.path.isfile(os.path.join(LOCAL_API, '.env')):
        sftp.put(os.path.join(LOCAL_API, '.env'), '/var/www/zued-api/.env')
        print('  Uploaded: .env')

    sftp.close()

    # 3. Install deps and restart API
    print('\n=== Installing dependencies and restarting PM2 ===')
    run_ssh(client, 'cd /var/www/zued-api && npm install --omit=dev 2>&1 | tail -5')
    run_ssh(client, 'mkdir -p /var/www/zued/uploads && chmod 755 /var/www/zued/uploads')
    run_ssh(client, 'pm2 restart zued-api 2>&1 || pm2 start /var/www/zued-api/ecosystem.config.js 2>&1')
    run_ssh(client, 'pm2 save 2>&1')
    run_ssh(client, 'sleep 2 && pm2 list 2>&1')

    # 4. Verify API health
    out, _ = run_ssh(client, 'curl -s http://127.0.0.1:3001/api/health')
    print('Health check:', out)

    client.close()
    print('\n=== Deploy complete ===')

def upload_dir(sftp, local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except Exception:
        pass
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = remote_dir + '/' + item
        if os.path.isfile(local_path):
            sftp.put(local_path, remote_path)
            print(f'  Uploaded: {item}')
        elif os.path.isdir(local_path):
            upload_dir(sftp, local_path, remote_path)

def run_ssh(client, cmd):
    print(f'SSH: {cmd[:80]}...' if len(cmd) > 80 else f'SSH: {cmd}')
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out: print('OUT:', out[:400])
    if err: print('ERR:', err[:400])
    return out, err


if __name__ == '__main__':
    main()
