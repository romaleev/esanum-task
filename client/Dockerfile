# Use official Node.js image
FROM node:18-alpine AS client

# Set working directory
WORKDIR /app

# ✅ Copy the root package files first (to optimize Docker layer caching)
COPY ../package.json ../package-lock.json ./

# ✅ Copy the client package.json correctly inside the right workspace folder
COPY ./client/package.json ./client/

# ✅ Ensure dependencies are installed correctly, including workspace dependencies
RUN npm install --workspace client --ignore-scripts

# Copy all Angular code
COPY . .

# Build
RUN npm run build -w client

# 🚀 Nginx Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY ../scripts/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=client /app/client/dist/mp4-to-gif-client/ /usr/share/nginx/html

# Expose Angular port
EXPOSE 80