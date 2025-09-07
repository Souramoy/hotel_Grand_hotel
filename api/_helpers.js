import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

// Helper to read JSON file from data directory
export function readData(filename) {
  const filePath = join(process.cwd(), 'src/data', filename);
  try {
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

// Helper to write JSON file to data directory
export function writeData(filename, data) {
  const filePath = join(process.cwd(), 'src/data', filename);
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Helper to set CORS headers
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
}

// Ensure uploads directory exists
export function ensureUploadsDir() {
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}
