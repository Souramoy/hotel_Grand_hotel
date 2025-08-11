import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'b44a50d44f1c3a997124555db40f74bf';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    try {
      const filePath = path.join(process.cwd(), 'src/data/admin.json');
      const data = fs.readFileSync(filePath, 'utf8');
      const admin = JSON.parse(data);
      
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