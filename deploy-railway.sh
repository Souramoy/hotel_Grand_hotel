#!/bin/bash
# Helper script to deploy the backend to Railway

# Install Railway CLI if not already installed
if ! command -v railway &> /dev/null; then
  echo "Railway CLI not found. Installing..."
  npm i -g @railway/cli
fi

# Login to Railway (if needed)
railway login

# Create a new Railway project (if needed)
echo "Creating a new Railway project (skip if you already have one)..."
railway init

# Link to the existing Railway project
echo "Linking to the project..."
railway link

# Set environment variables
echo "Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-frontend-url.vercel.app
railway variables set JWT_SECRET=helloworldgraNdhtel1234MYNAMEISSOURAMOY

# Deploy to Railway
echo "Deploying to Railway..."
railway up

echo "Deployment complete. Your backend should be accessible at:"
railway status
