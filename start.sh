#!/bin/sh
set -e

# Render nginx config from template using env vars
envsubst '${VAPOR_FLOW_ORIGIN} ${SERVER_NAME} ${VAPOR_CORE_ORIGIN}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Express
echo "Starting Express server..."
node /server/server.js 2>&1 | tee /dev/stdout | sed 's/^/[EXPRESS] /' &

# Wait a second to make sure it didn't crash
sleep 1

# Check if node is running
if ! pgrep -f "node /server/server.js" > /dev/null; then
  echo "[ERROR] Express server failed to start. Exiting..."
  exit 1
fi

# Start NGINX
echo "Starting NGINX..."
exec nginx -g 'daemon off;'
