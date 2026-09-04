import sharp from 'sharp';
import { Readable } from 'stream';
import mongoose from 'mongoose';
import { getGridFSBucket } from '../config/db.js';

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Optimize uploaded images to modern WebP, compress and resize
    const optimizedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const bucket = getGridFSBucket();
    const filename = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}.webp`;

    const readableStream = new Readable();
    readableStream.push(optimizedBuffer);
    readableStream.push(null);

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: 'image/webp'
    });

    readableStream.pipe(uploadStream);

    uploadStream.on('error', (err) => {
      return res.status(500).json({ message: 'GridFS upload failed: ' + err.message });
    });

    uploadStream.on('finish', () => {
      const mediaUrl = `/api/media/${filename}`;
      return res.status(201).json({
        message: 'Image uploaded and optimized successfully',
        url: mediaUrl,
        fileId: uploadStream.id
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error processing image' });
  }
};

export const getMediaStream = async (req, res) => {
  try {
    const { filename } = req.params;
    const bucket = getGridFSBucket();

    const files = await bucket.find({ filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', files[0].contentType || 'image/webp');
    res.set('Cache-Control', 'public, max-age=2592000'); // 30 days cache

    const downloadStream = bucket.openDownloadStreamByName(filename);
    downloadStream.pipe(res);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve media file' });
  }
};