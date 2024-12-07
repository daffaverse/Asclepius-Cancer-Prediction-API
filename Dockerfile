# Gunakan image Node.js sebagai base image
FROM node:18-slim

# Set direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file ke dalam container
COPY . .

ENV NODE_ENV=production
ENV PORT=8080

# Expose port yang akan digunakan
EXPOSE 8080

# Perintah untuk menjalankan aplikasi
CMD ["node", "server.js"]