#!/bin/sh

# Start the backend and forward its logs to stdout/stderr
node /app/server.js 2>&1 | sed 's/^/[EXPRESS] /' > /proc/1/fd/1 &

# Start NGINX (required so ECS doesn't think the container exited)
nginx -g 'daemon off;'
