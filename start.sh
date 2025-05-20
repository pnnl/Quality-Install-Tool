#!/bin/sh
set -e

# Render nginx config from template using env vars
envsubst '${VAPOR_FLOW_ORIGIN} ${SERVER_NAME}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Express server in the background
node /server/server.js 2>&1 | sed 's/^/[EXPRESS] /' &

# Start NGINX (foreground)
exec nginx -g 'daemon off;'
