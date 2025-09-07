FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY server.cjs .
COPY src/data ./src/data

# Install dependencies
RUN npm install --production

# Create uploads directory with proper permissions
RUN mkdir -p public/uploads
RUN chmod -R 755 public

# Expose the port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
