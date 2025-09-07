#!/bin/bash
# Script to prepare deployment configuration for DigitalOcean App Platform

echo "Creating DigitalOcean App Platform configuration files..."

# Create .do directory if it doesn't exist
mkdir -p .do

# Create app.yaml configuration file
cat > .do/app.yaml << EOL
name: hotel-grand-backend
services:
- name: api
  github:
    branch: master
    deploy_on_push: true
    repo: Souramoy/hotel_Grand_hotel
  envs:
  - key: NODE_ENV
    scope: RUN_TIME
    value: production
  - key: FRONTEND_URL
    scope: RUN_TIME
    value: https://your-vercel-frontend-url.vercel.app  # Update this with your Vercel URL
  - key: JWT_SECRET
    scope: RUN_TIME
    value: helloworldgraNdhtel1234MYNAMEISSOURAMOY
  http_port: 8080
  instance_count: 1
  instance_size_slug: basic-xs
  run_command: npm start
  source_dir: /
  # File system configuration for persistent storage
  filesystem:
  - name: uploads
    mount_path: /public/uploads
    size_gb: 1
EOL

# Create deploy.yaml configuration file for CI/CD
cat > .do/deploy.yaml << EOL
alerts:
- rule: DEPLOYMENT_FAILED
- rule: DOMAIN_FAILED
regions:
- nyc
EOL

# Create Dockerfile
cat > Dockerfile << EOL
FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY server-package.json .
COPY server.cjs .
COPY src/data ./src/data

RUN npm install

RUN mkdir -p public/uploads
RUN chmod -R 755 public

EXPOSE 8080

CMD ["npm", "start"]
EOL

echo "Configuration files created successfully!"
echo ""
echo "To deploy to DigitalOcean App Platform:"
echo "1. Install the DigitalOcean CLI (doctl)"
echo "   https://docs.digitalocean.com/reference/doctl/how-to/install/"
echo ""
echo "2. Authenticate with your DigitalOcean account:"
echo "   doctl auth init"
echo ""
echo "3. Create an app:"
echo "   doctl apps create --spec .do/app.yaml"
echo ""
echo "4. Or, use the DigitalOcean web console and connect your GitHub repository"
echo "   https://cloud.digitalocean.com/apps"
