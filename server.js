require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./src/models');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const errorHandler = require('./src/middleware/errorHandler');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const projectRoutes = require('./src/routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Collaborative Task Manager API',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.originalUrl}' not found`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server and sync database
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    // Auto-sync schema in development if not using migrations
    await sequelize.sync({ alter: false });
    console.log('✅ Sequelize models synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Collaborative Task Manager Server running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
