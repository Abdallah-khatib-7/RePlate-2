// backend/server.js - Add at the top
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database');

const reviewRoutes = require('./routes/reviewRoutes');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/reviews', reviewRoutes);

// Routes - Import them
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/contact', contactRoutes);
// Add this line where you define your routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'RePlate Backend API is running 🚀' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

// For testing, export app
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

// Test database connection on startup
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

module.exports = app; // ADD THIS LINE