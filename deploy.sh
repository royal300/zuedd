#!/bin/bash
# =============================================================
# deploy.sh - Deploy zuedd to VPS (zued.online)
# Usage: bash deploy.sh
# Run from the project root using Git Bash or WSL.
# =============================================================

set -e

VPS_USER="root"
VPS_HOST="93.127.206.52"
VPS_WEB="/var/www/zued"
VPS_API="/var/www/zued-api"
DOMAIN="zued.online"

echo "========================================"
echo "  Deploying zuedd -> $DOMAIN"
echo "========================================"

# Step 1: Pull latest code
echo ""
echo "[1/5] Pulling latest code from GitHub..."
git pull origin main

# Step 2: Install deps
echo ""
echo "[2/5] Installing dependencies..."
npm install

# Step 3: Build production
echo ""
echo "[3/5] Building for production..."
npm run build

# Step 4: Upload frontend
echo ""
echo "[4/5] Uploading frontend to VPS..."
scp -o StrictHostKeyChecking=no -r dist/* ${VPS_USER}@${VPS_HOST}:${VPS_WEB}/

# Step 5: Upload + restart backend
echo ""
echo "[5/5] Uploading backend API and restarting PM2..."
scp -o StrictHostKeyChecking=no api/server.js api/package.json ${VPS_USER}@${VPS_HOST}:${VPS_API}/
[ -f api/.env ] && scp -o StrictHostKeyChecking=no api/.env ${VPS_USER}@${VPS_HOST}:${VPS_API}/ || true
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "cd ${VPS_API} && npm install --production && pm2 restart zued-api"

echo ""
echo "========================================"
echo "  DONE! Site live at https://$DOMAIN"
echo "========================================"
