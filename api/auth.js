import jwt from 'jsonwebtoken';
import { readData, setCorsHeaders } from './_helpers.js';

// Use the environment variable JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'b44a50d44f1c3a997124555db40f74bf';

export default function handler(req, res) {
  // Enable CORS
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    try {
      const admin = readData('admin.json');
      
      // Production safe logging (no sensitive info)
      console.log(`Login attempt for username: ${username}`);
      
      if (username === admin.admin.username && password === admin.admin.password) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ success: true, token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}