# Helper script to deploy the backend to Railway

# Check if Railway CLI is installed
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "Railway CLI not found. Installing..."
    npm i -g @railway/cli
}

# Login to Railway (if needed)
railway login

# Create a new Railway project (if needed)
Write-Host "Creating a new Railway project (skip if you already have one)..."
railway init

# Link to the existing Railway project
Write-Host "Linking to the project..."
railway link

# Set environment variables
Write-Host "Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-frontend-url.vercel.app
railway variables set JWT_SECRET=helloworldgraNdhtel1234MYNAMEISSOURAMOY

# Deploy to Railway
Write-Host "Deploying to Railway..."
railway up

Write-Host "Deployment complete. Your backend should be accessible at:"
railway status
