// Simple Express backend for reading and writing hotel data
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const dataDir = path.join(__dirname, 'src', 'data');

// Helper to read JSON file
function readData(file) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
}
// Helper to write JSON file
function writeData(file, data) {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
}

// GET endpoints
app.get('/api/rooms', (req, res) => {
  res.json(readData('rooms.json'));
});
app.get('/api/menu', (req, res) => {
  res.json(readData('menu.json'));
});
app.get('/api/gallery', (req, res) => {
  res.json(readData('gallery.json'));
});

// PUT endpoints for updating data
app.put('/api/rooms', (req, res) => {
  writeData('rooms.json', req.body);
  res.json({ success: true });
});
app.put('/api/menu', (req, res) => {
  writeData('menu.json', req.body);
  res.json({ success: true });
});
app.put('/api/gallery', (req, res) => {
  writeData('gallery.json', req.body);
  res.json({ success: true });
});

// File upload endpoints
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, fileUrl });
});

// POST endpoints for adding new items
app.post('/api/rooms', (req, res) => {
  const data = readData('rooms.json');
  data.rooms.push(req.body);
  writeData('rooms.json', data);
  res.json({ success: true, room: req.body });
});

app.post('/api/menu/:category', (req, res) => {
  const { category } = req.params;
  const data = readData('menu.json');
  if (!data.menu[category]) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  data.menu[category].push(req.body);
  writeData('menu.json', data);
  res.json({ success: true, item: req.body });
});

app.post('/api/gallery', (req, res) => {
  const data = readData('gallery.json');
  data.gallery.push(req.body);
  writeData('gallery.json', data);
  res.json({ success: true, item: req.body });
});

// DELETE endpoints
app.delete('/api/rooms/:id', (req, res) => {
  const { id } = req.params;
  const data = readData('rooms.json');
  data.rooms = data.rooms.filter(room => room.id !== parseInt(id));
  writeData('rooms.json', data);
  res.json({ success: true });
});

app.delete('/api/menu/:category/:id', (req, res) => {
  const { category, id } = req.params;
  const data = readData('menu.json');
  if (!data.menu[category]) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  data.menu[category] = data.menu[category].filter(item => item.id !== parseInt(id));
  writeData('menu.json', data);
  res.json({ success: true });
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const data = readData('gallery.json');
  data.gallery = data.gallery.filter(item => item.id !== parseInt(id));
  writeData('gallery.json', data);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
