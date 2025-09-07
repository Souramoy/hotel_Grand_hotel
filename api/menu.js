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
      const menu = readData('menu.json');
      res.status(200).json(menu);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load menu data' });
    }
  } else if (req.method === 'PUT') {
    // Admin only - update menu data
    try {
      const updatedMenu = req.body;
      writeData('menu.json', updatedMenu);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update menu data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}