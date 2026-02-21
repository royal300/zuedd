import paramiko
import os
import sys

VPS_HOST = '93.127.206.52'
VPS_USER = 'root'
VPS_PASS = 'Royal300@2026'
LOCAL_DIST = r'E:\ROYAL300\ZUED\dist'
LOCAL_API = r'E:\ROYAL300\ZUED\api'

def upload_dir(sftp, local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except:
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
    sftp.put(os.path.join(LOCAL_API, f), f'/var/www/zued-api/{f}')
    print(f'  Uploaded: {f}')

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
