import fs from 'fs';
import path from 'path';

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

  const filePath = path.join(process.cwd(), 'src/data/gallery.json');
  
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const gallery = JSON.parse(data);
      res.status(200).json(gallery);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load gallery data' });
    }
  } else if (req.method === 'PUT') {
    // Admin only - update gallery data
    try {
      const updatedGallery = req.body;
      fs.writeFileSync(filePath, JSON.stringify(updatedGallery, null, 2));
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update gallery data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}