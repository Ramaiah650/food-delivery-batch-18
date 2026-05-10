const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const orderRoutes = require('./routes/order');
const restaurantRoutes = require('./routes/restaurant');
const menuRoutes = require('./routes/menu');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const IS_VERCEL = process.env.VERCEL === '1';
const path = require('path');

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

// Debug API endpoint
app.get('/api/debug', (req, res) => {
  res.json({ 
    message: 'API is working', 
    timestamp: new Date(),
    mongooseConnected: require('mongoose').connection.readyState === 1
  });
});

// Routes (must come BEFORE static files)
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);

// Redirect routes for convenience
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'login.html')));
app.get('/delivery', (req, res) => res.sendFile(path.join(__dirname, '..', 'delivery.html')));
app.get('/menu', (req, res) => res.sendFile(path.join(__dirname, '..', 'menu.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'index.html')));

// Serve static files from parent directory (AFTER API routes)
app.use(express.static(path.join(__dirname, '..')));

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
const connectMongo = async () => {
  if (mongoose.connection.readyState !== 0) return;
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fooddelivery';
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

connectMongo().catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

if (!IS_VERCEL) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/health\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `\nPort ${PORT} is already in use (another Node server is probably still running).\n` +
        `Fix: run  npm run free-port  (works from this backend folder or from the project root)\n` +
        `Then run again:  npm start\n`
      );
      process.exit(1);
    }
    throw err;
  });
}

module.exports = app;