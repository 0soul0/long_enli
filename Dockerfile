# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from web directory
COPY web/package.json web/package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code from web directory
COPY web/ .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy artifacts from builder stage (the dist folder)
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 8080

# Start command
CMD ["serve", "-s", "dist", "-l", "8080"]
