# Script to prepare deployment configuration for DigitalOcean App Platform

Write-Host "Creating DigitalOcean App Platform configuration files..." -ForegroundColor Green

# Create .do directory if it doesn't exist
New-Item -Path ".do" -ItemType Directory -Force | Out-Null

# Create app.yaml configuration file
@"
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
    value: https://hotel-grand-hotel.vercel.app
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
"@ | Out-File -FilePath ".do/app.yaml" -Encoding utf8

# Create deploy.yaml configuration file for CI/CD
@"
alerts:
- rule: DEPLOYMENT_FAILED
- rule: DOMAIN_FAILED
regions:
- nyc
"@ | Out-File -FilePath ".do/deploy.yaml" -Encoding utf8

# Create Dockerfile
@"
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
"@ | Out-File -FilePath "Dockerfile" -Encoding utf8

Write-Host "Configuration files created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To deploy to DigitalOcean App Platform:" -ForegroundColor Cyan
Write-Host "1. Install the DigitalOcean CLI (doctl)" -ForegroundColor White
Write-Host "   https://docs.digitalocean.com/reference/doctl/how-to/install/"
Write-Host ""
Write-Host "2. Authenticate with your DigitalOcean account:" -ForegroundColor White
Write-Host "   doctl auth init"
Write-Host ""
Write-Host "3. Create an app:" -ForegroundColor White
Write-Host "   doctl apps create --spec .do/app.yaml"
Write-Host ""
Write-Host "4. Or, use the DigitalOcean web console and connect your GitHub repository" -ForegroundColor White
Write-Host "   https://cloud.digitalocean.com/apps"
