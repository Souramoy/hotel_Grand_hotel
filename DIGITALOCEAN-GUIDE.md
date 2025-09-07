# DigitalOcean Deployment Guide for Grand Hotel

This guide provides detailed instructions for deploying the Grand Hotel backend to DigitalOcean App Platform.

## Why DigitalOcean App Platform?

DigitalOcean App Platform is an excellent choice for this application because:

1. **Simplicity** - Deploy directly from your GitHub repository with minimal configuration
2. **Managed Infrastructure** - No server maintenance required
3. **Scalability** - Easy to scale as your traffic grows
4. **Persistent Storage** - Built-in support for file uploads
5. **Reasonable Pricing** - Starts at $5/month with a $100 free credit for new users

## Prerequisites

1. A [DigitalOcean account](https://cloud.digitalocean.com/registrations/new)
2. Your code pushed to GitHub
3. [DigitalOcean CLI](https://docs.digitalocean.com/reference/doctl/how-to/install/) (optional)

## Deployment Options

### Option 1: Using the Web Console (Recommended for beginners)

1. Log in to [DigitalOcean Cloud Console](https://cloud.digitalocean.com)
2. Navigate to the [App Platform section](https://cloud.digitalocean.com/apps)
3. Click "Create App"
4. Choose "GitHub" as the source and connect your account
5. Select your repository and branch (usually `master` or `main`)
6. Select the "Web Service" component type
7. Configure your app:
   - **Environment**: Node.js
   - **Source Directory**: `/` (root)
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **HTTP Port**: `5000` or `$PORT` (environment variable)
8. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `JWT_SECRET`: Your secure JWT secret
9. Add Resources:
   - Enable persistent disk for file uploads
   - Path: `/public/uploads`
   - Size: 1GB (minimum)
10. Choose your plan:
    - **Basic**: $5/month (1 vCPU, 512MB RAM)
    - **Professional**: $12/month (1 vCPU, 1GB RAM) - recommended for production
11. Choose your region (closest to your users)
12. Name your app and click "Launch App"

### Option 2: Using the DigitalOcean CLI

1. Install the DigitalOcean CLI (doctl):
   ```bash
   # Windows (PowerShell)
   scoop install doctl
   # or
   choco install doctl
   
   # macOS
   brew install doctl
   
   # Linux
   snap install doctl
   ```

2. Authenticate with your DigitalOcean account:
   ```bash
   doctl auth init
   ```

3. Run the provided deployment script:
   ```bash
   # Windows
   .\deploy-digitalocean.ps1
   
   # macOS/Linux
   chmod +x deploy-digitalocean.sh
   ./deploy-digitalocean.sh
   ```

4. Create and deploy the app:
   ```bash
   doctl apps create --spec .do/app.yaml
   ```

5. Check the status of your app:
   ```bash
   doctl apps list
   ```

### Option 3: Using Docker and DigitalOcean Droplets

If you need more control or want to save costs, you can deploy to a DigitalOcean Droplet:

1. Create a Droplet:
   - Select Ubuntu 22.04 LTS
   - Choose Basic plan ($5/month)
   - Choose your region
   - Add your SSH key

2. Connect to your Droplet:
   ```bash
   ssh root@your-droplet-ip
   ```

3. Install Docker and Docker Compose:
   ```bash
   apt update
   apt install -y docker.io docker-compose
   systemctl enable docker
   systemctl start docker
   ```

4. Create a docker-compose.yml file:
   ```yaml
   version: '3'
   services:
     hotel-backend:
       build: .
       restart: always
       ports:
         - "80:5000"
       environment:
         - NODE_ENV=production
         - FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
         - JWT_SECRET=your-secure-secret
       volumes:
         - ./data:/app/src/data
         - ./uploads:/app/public/uploads
   ```

5. Deploy your app:
   ```bash
   docker-compose up -d
   ```

## After Deployment

1. Note the URL of your deployed backend service
2. Update your frontend's `.env.production` file with the backend URL
3. Redeploy your frontend to Vercel

## Monitoring and Maintenance

1. Monitor your app's performance in the [DigitalOcean Dashboard](https://cloud.digitalocean.com/apps)
2. Set up alerts for CPU and memory usage
3. Enable automatic deployments to deploy changes when you push to GitHub

## Cost Management

- Basic App Platform: $5/month
- Professional App Platform: $12/month
- Droplet: $5/month (but requires more maintenance)
- All options offer 1TB bandwidth

## Scaling

As your hotel website grows, you can:

1. Increase the instance size for more resources
2. Enable horizontal scaling (multiple instances)
3. Add a database component for better data persistence
4. Set up a CDN for faster global access

## Troubleshooting

1. Check app logs in the DigitalOcean console
2. Ensure all environment variables are set correctly
3. Verify that persistent disk is configured for uploads
4. Check CORS settings if the frontend can't connect

For more assistance, refer to [DigitalOcean's App Platform documentation](https://docs.digitalocean.com/products/app-platform/).
