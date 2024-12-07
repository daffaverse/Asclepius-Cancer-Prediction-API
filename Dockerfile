# Gunakan Node.js versi LTS
FROM node:18-slim

# Install dependencies untuk TensorFlow.js dan Sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Copy GCP credentials
COPY config/gcp-key.json ./config/

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]