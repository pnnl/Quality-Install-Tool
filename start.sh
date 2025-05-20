#!/bin/sh

# Start Express server in the background
node /server/server.js 2>&1 | sed 's/^/[EXPRESS] /' &

# Start NGINX (foreground)
exec nginx -g 'daemon off;'
