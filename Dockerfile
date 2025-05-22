# Stage 1: Build
FROM node:20-alpine AS builder

# Install dependencies required by node-gyp
RUN apk add --no-cache \
  python3 \
  py3-pip \
  make \
  g++ \
  libc-dev \
  cairo-dev \
  pango-dev \
  jpeg-dev \
  giflib-dev \
  pixman-dev \
  libpng-dev \
  pkgconfig

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the React app
RUN yarn run build

# Final Stage: Node + NGINX
FROM node:20-alpine

# Install NGINX
RUN apk add --no-cache nginx gettext

# Set up backend
WORKDIR /server
COPY server/package.json ./
RUN npm install
COPY server/server.js .

# Copy frontend assets
WORKDIR /usr/share/nginx/html

# Remove default NGINX content
RUN rm -rf ./*

# Copy build output from Stage 1
COPY --from=builder /app/build .

# Copy nginx.conf.template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 80 3001

# Start backend and NGINX
CMD ["/start.sh"]
