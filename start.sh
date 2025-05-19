#!/bin/sh

# Start the backend
node /app/server.js &

# Start NGINX
nginx -g 'daemon off;'