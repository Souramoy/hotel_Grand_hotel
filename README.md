# Grand Hotel Website

A modern, responsive hotel website built with React, TypeScript, Tailwind CSS, and Vite. The website showcases the hotel's rooms, amenities, restaurant menu, gallery, and provides a contact form for inquiries.
<img width="1357" height="596" alt="image" src="https://github.com/user-attachments/assets/8263a754-9852-4410-bf5d-e1ebdc3cd935" />

## Features

- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Admin Dashboard**: Manage rooms, menu items, and gallery content
- **Modern UI**: Built with Tailwind CSS for a sleek, modern interface
- **Interactive Components**: Interactive room booking, gallery view, and contact form

## Deployment Guide for Separate Frontend & Backend

This application is designed to work with a separated architecture where the frontend and backend are deployed to different platforms.

### Frontend Deployment on Vercel

#### 1. Update Environment Variables

Before deploying, update the `.env.production` file:

```
VITE_API_URL=https://your-backend-url.com  # Replace with actual backend URL once deployed
```

#### 2. Push Your Code to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push
```

#### 3. Deploy Frontend to Vercel

1. Sign up or log in at [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add the environment variable:
   - `VITE_API_URL` - Your backend server URL
6. Click "Deploy"

### Backend Deployment Options

You have several options for deploying your backend. Choose the one that best fits your needs:

#### Option A: Railway
#### Option B: Render
#### Option C: DigitalOcean App Platform (Recommended)

#### 1. Prepare Your Backend for Deployment

1. For backend-only deployment, you can use the provided `server-package.json`:
   ```bash
   # Rename the server package.json
   cp server-package.json package.json
   
   # Make sure data and uploads directories exist
   mkdir -p src/data public/uploads
   
   # Copy your data files
   cp -r src/data/* src/data/
   ```

2. Create a Procfile for platforms like Render or Heroku:
   ```
   web: node server.cjs
   ```

3. For Railway or similar, configure the start command as:
   ```
   node server.cjs
   ```

4. Set the following environment variables on your hosting platform:
   - `PORT`: Port for the server (often assigned automatically by the platform)
   - `FRONTEND_URL`: URL of your frontend (the Vercel URL)
   - `NODE_ENV`: Set to "production"
   - `JWT_SECRET`: A secure random string for JWT token generation

#### 2. Deploy the Backend

1. Choose a backend hosting service:
   - [Render](https://render.com): Free tier available, supports Node.js
   - [Railway](https://railway.app): Developer-friendly with good free tier
   - [Heroku](https://heroku.com): Reliable but requires credit card for free tier
   - [Fly.io](https://fly.io): Good performance with global distribution

2. Follow platform-specific instructions:

   **For Render:**
   - Sign up or log in at [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`
   - Set Environment Variables (see above)
   - Deploy

   **For Railway:**
   - Sign up or log in at [railway.app](https://railway.app)
   - Install the Railway CLI:
     ```bash
     npm i -g @railway/cli
     ```
   - Login to Railway:
     ```bash
     railway login
     ```
   - Run the deployment script (Windows):
     ```bash
     .\deploy-railway.ps1
     ```
   - Or for Mac/Linux:
     ```bash
     chmod +x deploy-railway.sh
     ./deploy-railway.sh
     ```
   - Alternatively, manually create a new project:
     - `railway init`
     - Set environment variables:
       ```bash
       railway variables set NODE_ENV=production
       railway variables set FRONTEND_URL=https://your-frontend-url.vercel.app
       railway variables set JWT_SECRET=your-secret-key
       ```
     - Deploy:
       ```bash
       railway up
       ```

   **For DigitalOcean App Platform:**
   - Sign up or log in at [DigitalOcean](https://digitalocean.com)
   - Install the DigitalOcean CLI:
     ```bash
     # For Windows (PowerShell)
     scoop install doctl
     # Or
     choco install doctl
     
     # For Mac
     brew install doctl
     ```
   - Run the deployment script (Windows):
     ```bash
     .\deploy-digitalocean.ps1
     ```
   - Or for Mac/Linux:
     ```bash
     chmod +x deploy-digitalocean.sh
     ./deploy-digitalocean.sh
     ```
   - Authenticate with your DigitalOcean account:
     ```bash
     doctl auth init
     ```
   - Create and deploy the app:
     ```bash
     doctl apps create --spec .do/app.yaml
     ```
   - Alternatively, use the [DigitalOcean App Platform Console](https://cloud.digitalocean.com/apps):
     1. Click "Create App"
     2. Select your GitHub repository
     3. Configure as a Web Service with Node.js
     4. Set the environment variables:
        - NODE_ENV=production
        - FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
        - JWT_SECRET=your-secure-secret
     5. Enable persistent disk for `/public/uploads` (1GB minimum)
     6. Deploy the app

3. Once deployed, note the URL of your backend service

#### 3. Update Frontend Configuration

1. Go back to your Vercel dashboard
2. Update the environment variable:
   - `VITE_API_URL`: Set to the URL of your deployed backend
3. Trigger a redeploy of the frontend

### Running Both Services Locally for Development

1. Start the backend server:
   ```bash
   npm run server
   ```

2. In a separate terminal, start the frontend:
   ```bash
   npm run dev
   ```

3. The frontend will be available at `http://localhost:5173`
4. The backend will be available at `http://localhost:5000`

## Pages

- **Home**: Welcome page with hotel introduction and featured content
- **Rooms**: Browse different room categories and availability
- **Restaurant**: View the restaurant menu with various meal options
- **Gallery**: Photo gallery showcasing hotel amenities and experiences
- **Contact**: Contact information and inquiry form
- **Admin**: Protected admin dashboard for content management

## Technologies Used

- **React**: Frontend library for building the user interface
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Next generation frontend tooling for faster development
- **Express.js**: Backend framework for API endpoints
- **Lucide React**: Icons library

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Souramoy/hotel_Grand_hotel.git
cd hotel_Grand_hotel
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Start the backend server
```bash
node server.js
```

5. Open your browser and visit `http://localhost:5173`

### Admin Access

To access the admin dashboard, navigate to `/admin/login` and use the credentials from the admin.json file.

## Project Structure

```
hotel_Grand_hotel/
├── api/               # API endpoints
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable components
│   ├── data/          # JSON data files
│   ├── pages/         # Page components
│   │   └── admin/     # Admin dashboard
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Entry point
├── server.js          # Express backend server
└── README.md          # This file
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
