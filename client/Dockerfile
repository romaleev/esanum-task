# Use official Node.js image
FROM node:18-alpine

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

# Expose Angular port
EXPOSE 4200