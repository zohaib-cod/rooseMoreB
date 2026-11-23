require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const heroRoutes = require('./routes/heroRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure DB is connected for all API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed: ' + err.message 
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Roose More Backend API is running successfully!');
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/hero', heroRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
