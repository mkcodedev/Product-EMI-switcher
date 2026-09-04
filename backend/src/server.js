import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

const app = express();

// Trust reverse proxy (Crucial for secure HTTPS cookies on Render)
app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://product-emi-switcher.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Check against allowed origins or any Vercel preview domain
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      } else {
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  })
);

// Handle preflight OPTIONS requests explicitly
app.options('*', cors());

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect Database
connectDB();

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Catalog backend running' });
});

// API Endpoints
app.use('/api/admin', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/media', mediaRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));