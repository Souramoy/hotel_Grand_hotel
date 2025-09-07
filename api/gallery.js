import { readData, writeData, setCorsHeaders } from './_helpers.js';

export default function handler(req, res) {
  // Enable CORS
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    try {
      const gallery = readData('gallery.json');
      res.status(200).json(gallery);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load gallery data' });
    }
  } else if (req.method === 'PUT') {
    // Admin only - update gallery data
    try {
      const updatedGallery = req.body;
      writeData('gallery.json', updatedGallery);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update gallery data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}