# DigitalOcean App Platform Deployment Guide

This document provides step-by-step instructions for deploying your hotel backend to DigitalOcean App Platform.

## Option 1: Deploy via DigitalOcean Web Interface

1. **Create DigitalOcean Account**
   - Go to [DigitalOcean](https://www.digitalocean.com/)
   - Sign up for an account if you don't already have one
   - Verify your email and add payment information

2. **Access App Platform**
   - In the DigitalOcean dashboard, click on "Apps" in the left sidebar
   - Click the "Create App" button

3. **Connect Your GitHub Repository**
   - Select "GitHub" as the source
   - Connect your GitHub account if not already connected
   - Select the "hotel_Grand_hotel" repository
   - Choose the "master" branch

4. **Configure App**
   - DigitalOcean will analyze the repository and detect it as a Node.js app
   - Make sure the following settings are configured:
     - **Type**: Web Service
     - **Source Directory**: `/` (root)
     - **Build Command**: `npm install`
     - **Run Command**: `npm start`

5. **Configure Environment Variables**
   - Scroll down to "Environment Variables" section and add:
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: `https://hotel-grand-hotel.vercel.app`
     - `JWT_SECRET`: `helloworldgraNdhtel1234MYNAMEISSOURAMOY`
     - `PORT`: `8080`

6. **Configure Persistent Storage**
   - Scroll to the "File System" section
   - Click "Add" to create a new persistent disk
   - Mount Path: `/public/uploads`
   - Size: 1GB (minimum)

7. **Choose a Plan**
   - Select "Basic" plan ($5/month) for development/testing
   - Or "Professional" plan ($12/month) for production use

8. **Choose a Region**
   - Select a region closest to your users (e.g., New York, San Francisco, etc.)

9. **Name Your App**
   - Enter a name like "hotel-grand-backend"
   - Optionally add a project (or create a new one)

10. **Review and Launch**
    - Review all settings
    - Click "Launch App" to deploy your application

11. **Monitor Deployment**
    - DigitalOcean will build and deploy your application
    - This process may take a few minutes
    - You can view build logs in real-time

12. **Access Your Deployed Application**
    - Once deployment is complete, DigitalOcean will provide a URL
    - The URL will look something like: `https://hotel-grand-backend-abc123.ondigitalocean.app`
    - Test your backend by accessing `https://your-app-url/api/rooms`

## Option 2: Deploy Using the Backend-Only Repository

If you prefer to deploy only the backend files (from the prepared backend-only directory):

1. **Create a New GitHub Repository**
   - Create a new repository named "hotel-grand-backend" on GitHub
   - Initialize it with a README file

2. **Push the Backend-Only Files to GitHub**
   ```powershell
   cd c:\Users\SOURAMOY\OneDrive - SS Production\Desktop\hotel-grand-backend
   git init
   git add .
   git commit -m "Initial backend-only commit"
   git branch -M main
   git remote add origin https://github.com/Souramoy/hotel-grand-backend.git
   git push -u origin main
   ```

3. **Follow the Web Interface Steps Above**
   - Use the new "hotel-grand-backend" repository instead of "hotel_Grand_hotel"

## After Deployment

1. **Update Your Frontend Environment Variable**
   - Go to your Vercel dashboard for the frontend
   - Update the `VITE_API_URL` environment variable to your DigitalOcean App URL
   - Redeploy the frontend

2. **Test the Full Application**
   - Access your frontend at `https://hotel-grand-hotel.vercel.app`
   - Test all functionality including:
     - Viewing rooms, menu, and gallery
     - Admin login and dashboard
     - File uploads
     - Data updates

## Troubleshooting

- **CORS Issues**: If you see CORS errors, verify that the `FRONTEND_URL` environment variable is set correctly
- **Upload Errors**: Make sure persistent storage is configured correctly
- **Build Failures**: Check the build logs for specific errors
- **Connection Issues**: Test if the backend URL responds to `/api/rooms` endpoint

For additional help, refer to [DigitalOcean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/).
