# Use official Node.js image
FROM node:18-alpine AS server

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# ✅ Copy the root package files first (to optimize Docker layer caching)
COPY ../package.json ../package-lock.json ./

# Copy client code
COPY ./server/ ./server/

# ✅ Ensure dependencies are installed correctly, including workspace dependencies
RUN npm install --workspace server --ignore-scripts

# Build
RUN npm run build -w server

# Expose API port
EXPOSE 3000