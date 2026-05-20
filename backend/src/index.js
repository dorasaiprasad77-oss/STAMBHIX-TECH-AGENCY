require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Validate required environment variables (warn only — server should still start for health checks)
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.warn(`⚠ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('  Server will start but some features may not work until these are set.');
  if (process.env.RENDER) {
    console.warn('  Set these in your Render dashboard → Environment tab.');
  }
}

// Import routes
const authRoutes = require('./routes/auth');
const passwordResetRoutes = require('./routes/passwordReset');
const memoryRoutes = require('./routes/memories');
const collectionRoutes = require('./routes/collections');
const uploadRoutes = require('./routes/uploads');
const contactRoutes = require('./routes/contact');
const dashboardRoutes = require('./routes/dashboard');
const blogRoutes = require('./routes/blog');
const teamRoutes = require('./routes/team');
const achievementRoutes = require('./routes/achievements');
const projectMediaRoutes = require('./routes/projectMedia');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting - stricter on auth, generous on API
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please try again later' },
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later' },
});
app.use('/api/auth/', authLimiter);
app.use('/api/', apiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (note: publicly accessible, no auth)
// For production, serve images through authenticated routes instead
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadDir));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/project-media', projectMediaRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  // Start listening immediately so health checks work even while DB connects
  app.listen(PORT, () => {
    console.log(`MemoryChain API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  // Then connect to DB (delays server start by ~2s if DB is unreachable)
  try {
    await connectDB();
  } catch (err) {
    console.error(`Failed to connect to MongoDB: ${err.message}`);
    console.error('Server is running but database features will not work until MongoDB is configured.');
  }
};

startServer();

module.exports = app;
