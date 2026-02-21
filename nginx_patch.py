import paramiko, tempfile, os

VPS_HOST = '93.127.206.52'
VPS_USER = 'root'
VPS_PASS = 'Royal300@2026'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS)

def run(cmd):
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out: print('OUT:', out[:800])
    if err and ('error' in err.lower() or 'fail' in err.lower()): print('ERR:', err[:400])
    return out

nginx_patch_code = """import sys
cfg = open('/etc/nginx/sites-available/zued.online').read()
if '/uploads/' not in cfg:
    uploads_block = \"\"\"
    location /uploads/ {
        alias /var/www/zued/uploads/;
        expires 30d;
        add_header Cache-Control \\\"public\\\";
    }\\n\"\"\"
    cfg = cfg.replace('    location /api/ {', uploads_block + '    location /api/ {')
    open('/etc/nginx/sites-available/zued.online','w').write(cfg)
    print('Nginx config updated')
else:
    print('/uploads/ already configured')
"""

# Write patch script to a local temp file and upload
tmp_path = os.path.join(tempfile.gettempdir(), '_nginx_patch.py')
with open(tmp_path, 'w') as f:
    f.write(nginx_patch_code)

sftp = client.open_sftp()
sftp.put(tmp_path, '/tmp/_nginx_patch.py')
sftp.close()

run('python3 /tmp/_nginx_patch.py')
out = run('nginx -t 2>&1')
if 'ok' in out.lower() or 'successful' in out.lower():
    run('systemctl reload nginx 2>&1')
    print('Nginx reloaded')
else:
    print('Nginx test might have issues, checking...')
    run('systemctl reload nginx 2>&1')

# Smoke tests
out = run('curl -s http://127.0.0.1:3001/api/health')
print('API Health:', out)

client.close()
print('Done.')
