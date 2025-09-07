import { setCorsHeaders } from './_helpers.js';

export default function handler(req, res) {
  // Enable CORS
  setCorsHeaders(res);

  // Send response
  res.status(200).json({ 
    success: true, 
    message: 'API is working!',
    environment: process.env.NODE_ENV,
    hasJwtSecret: !!process.env.JWT_SECRET
  });
}
