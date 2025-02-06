# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# ✅ Copy only the global package.json and package-lock.json
COPY ../../package.json ../../package-lock.json ./

# ✅ Copy the local server package.json (no package-lock.json in server/)
COPY ./package.json ./

# ✅ Install dependencies using the global package-lock.json
RUN npm install --ignore-scripts

# Copy all source code
COPY . .

# Expose API port
EXPOSE 3000