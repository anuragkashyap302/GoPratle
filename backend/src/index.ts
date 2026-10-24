import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import requirementRoutes from './routes/requirementRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// 1. Trust proxy (Required when deploying behind reverse proxies like Render, Railway, Vercel)
app.set('trust proxy', 1);

// 2. Helmet for security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 3. CORS allowlist configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CORS_ORIGIN
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

// 4. Rate Limiting: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', globalLimiter);

// 5. Stricter Limiter on Requirement Submission (25 per 15 mins)
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Requirement posting limit reached. Please wait a few minutes before posting again.'
  }
});

// 6. Body parser with strict size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStateNames[dbState] || 'unknown',
      connected: dbState === 1
    }
  });
});

// Mount Feature Routes (with specific post limiter)
app.use('/api/requirements', (req, res, next) => {
  if (req.method === 'POST') {
    return postLimiter(req, res, next);
  }
  next();
}, requirementRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n GoPratle Backend Server listening on http://localhost:${PORT}`);
  console.log(` Health Check available at http://localhost:${PORT}/api/health`);
  console.log(` Requirements API at http://localhost:${PORT}/api/requirements\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await mongoose.connection.close();
    console.log('HTTP server and MongoDB connection closed.');
    process.exit(0);
  });
});

export default app;
