FROM node:22-alpine

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy application source
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
