import { setCorsHeaders, ensureUploadsDir } from './_helpers.js';
import { join } from 'path';
import { writeFileSync } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Check if we're in production (Vercel)
      const isProduction = process.env.VERCEL === '1';
      
      if (isProduction) {
        // In production, we can't write to the filesystem
        // Generate a placeholder URL for demo purposes
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `placeholder-${uniqueSuffix}.jpg`;
        
        // Return a placeholder image URL
        // Note: In a real app, you would use a service like Vercel Blob Storage or S3
        const fileUrl = `https://placehold.co/600x400?text=Image+${uniqueSuffix}`;
        res.status(200).json({ success: true, fileUrl });
      } else {
        // In development, save to local filesystem
        const uploadsDir = ensureUploadsDir();
        
        // Handle file upload manually
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const buffer = Buffer.concat(chunks);
  
        // Extract content type and filename from headers
        let filename = '';
        
        if (req.headers['x-file-name']) {
          filename = req.headers['x-file-name'];
        } else {
          // Generate a unique filename
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          filename = `upload-${uniqueSuffix}.jpg`;
        }
  
        // Save the file
        const filePath = join(uploadsDir, filename);
        writeFileSync(filePath, buffer);
  
        // Return the URL to the uploaded file
        const fileUrl = `/uploads/${filename}`;
        res.status(200).json({ success: true, fileUrl });
      }
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
