#!/bin/sh

# Start Express server in the background
node /app/server.js 2>&1 | sed 's/^/[EXPRESS] /' &

# Start NGINX as PID 1
exec nginx -g 'daemon off;'
