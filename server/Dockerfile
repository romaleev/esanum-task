# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# ✅ Copy the root package files first (to optimize Docker layer caching)
COPY ../package.json ../package-lock.json ./

# ✅ Copy the server package.json correctly inside the right workspace folder
COPY ./server/package.json ./server/

# ✅ Ensure dependencies are installed correctly, including workspace dependencies
RUN npm install --workspace server --ignore-scripts

# Copy all source code
COPY . .

# Build
RUN npm run build -w server

# Expose API port
EXPOSE 3000