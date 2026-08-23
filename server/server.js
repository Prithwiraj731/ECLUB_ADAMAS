/**
 * Adamas University Entrepreneurship Club (E-Club)
 * Full-Stack Node.js + Express + Supabase API Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const eventsRoutes = require('./src/routes/eventsRoutes');
const noticesRoutes = require('./src/routes/noticesRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const stallsRoutes = require('./src/routes/stallsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', '*'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from React client public folder
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));

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
  console.log(`🚀 Adamas University E-Club Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints: http://localhost:${PORT}/api`);
});

module.exports = app;
