# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine

WORKDIR /app

# Install serve globally or as a dependency
RUN npm install -g serve

# Copy artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 8080

# Start the command
CMD ["serve", "-s", "dist", "-l", "8080"]
