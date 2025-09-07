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
      const rooms = readData('rooms.json');
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load rooms data' });
    }
  } else if (req.method === 'PUT') {
    // Admin only - update rooms data
    try {
      const updatedRooms = req.body;
      writeData('rooms.json', updatedRooms);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update rooms data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}