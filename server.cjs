// Simple Express backend for reading and writing hotel data
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Ensure required directories exist
// Define paths for important directories
const DATA_DIR = path.join(__dirname, 'src', 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure required directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('Created data directory:', DATA_DIR);
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('Created uploads directory:', UPLOADS_DIR);
}

const app = express();

// Configure CORS for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
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

// Use the already defined DATA_DIR constant

// Helper to read JSON file
function readData(file) {
  const filePath = path.join(DATA_DIR, file);
  // Create empty file if it doesn't exist
  if (!fs.existsSync(filePath)) {
    console.log(`Creating empty data file: ${filePath}`);
    const emptyData = file.includes('rooms') ? { rooms: [] } :
                      file.includes('menu') ? { menu: { breakfast: [], lunch: [], dinner: [] } } :
                      file.includes('gallery') ? { gallery: [] } :
                      file.includes('admin') ? { admin: { username: "admin", password: "password123" } } : {};
    fs.writeFileSync(filePath, JSON.stringify(emptyData, null, 2));
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Helper to write JSON file
function writeData(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
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

// Authentication endpoint for admin login
app.post('/api/auth', (req, res) => {
  const { username, password } = req.body;
  try {
    const adminData = readData('admin.json');
    
    if (username === adminData.admin.username && password === adminData.admin.password) {
      // Use JWT_SECRET from environment variables or fallback to a default (not recommended for production)
      const jwtSecret = process.env.JWT_SECRET || 'helloworldgraNdhtel1234MYNAMEISSOURAMOY';
      
      // Simple JWT-like token for authentication
      const token = Buffer.from(JSON.stringify({ 
        username, 
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      })).toString('base64');
      
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
