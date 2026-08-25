/**
 * Adamas University Entrepreneurship Club (E-Club)
 * Full-Stack Node.js + Express + Supabase API Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const eventsRoutes = require('./src/routes/eventsRoutes');
const noticesRoutes = require('./src/routes/noticesRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const stallsRoutes = require('./src/routes/stallsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server proxies)
    if (!origin) return callback(null, true);

    // Check if origin matches allowed list or vercel preview deployments
    if (
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from React client public folder if present locally
const staticAssetsPath = path.join(__dirname, '../client/public/assets');
if (fs.existsSync(staticAssetsPath)) {
  app.use('/assets', express.static(staticAssetsPath));
}

// Root status endpoint for Render health monitoring
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Adamas University E-Club Backend API',
    version: '2.0.0',
    health: '/api/health',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stalls', stallsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Adamas University E-Club API',
    version: '2.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error handler:', err.stack || err);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Adamas University E-Club Server running on port ${PORT}`);
  console.log(`📡 API Endpoints active at /api`);
});

module.exports = app;

