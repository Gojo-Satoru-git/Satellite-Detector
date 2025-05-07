import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data'; // ✅ ADD THIS

const app = express();
const PORT = 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Handle image upload and forward to FastAPI
app.post('/api/detect', upload.single('image'), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  console.log("Received file:", req.file);

  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath)); // ✅ Appending file correctly

    console.log("Forwarding image to FastAPI...");

    const pyResponse = await fetch('http://localhost:8000/process', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(), // ✅ Required to set proper multipart headers
    });

    if (!pyResponse.ok) {
      console.error('Python server failed with status:', pyResponse.status);
      throw new Error('Python server failed');
    }

    res.setHeader('Content-Type', 'image/png');
    pyResponse.body.pipe(res); // ✅ Pipe processed image back to frontend
  } catch (error) {
    console.error('Error during image processing:', error);
    res.status(500).send('Processing failed');
  } finally {
    fs.unlink(filePath, () => {}); // ✅ Clean up temp uploaded file
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
