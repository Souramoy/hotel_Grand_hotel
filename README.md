# Grand Hotel Website

A modern, responsive hotel website built with React, TypeScript, Tailwind CSS, and Vite. The website showcases the hotel's rooms, amenities, restaurant menu, gallery, and provides a contact form for inquiries.

## Features

- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Admin Dashboard**: Manage rooms, menu items, and gallery content
- **Modern UI**: Built with Tailwind CSS for a sleek, modern interface
- **Interactive Components**: Interactive room booking, gallery view, and contact form

## Deployment Guide for Vercel

This application is configured to work properly on Vercel with both frontend and backend functionality. Follow these steps for deployment:

### 1. Push Your Code to GitHub

First, make sure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Deploy to Vercel

1. Sign up or log in at [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add the following environment variable:
   - `JWT_SECRET` - Set a secure random string for JWT token generation
6. Click "Deploy"

### 3. Check Your Deployment

- Once deployed, Vercel will provide you with a domain where your application is hosted
- Test all functionality, including:
  - Viewing rooms, menu, and gallery
  - Admin login and dashboard
  - File uploads
  - Data updates

### How the Deployment Works

This application is configured to work on Vercel through:

1. **Serverless Functions**: The `/api` directory contains serverless functions that handle backend functionality
2. **File System Access**: Data is stored in JSON files in the `/src/data` directory
3. **File Uploads**: Files are uploaded to the `/public/uploads` directory
4. **Routing Configuration**: The `vercel.json` file configures routing to correctly serve API endpoints and the SPA frontend

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
