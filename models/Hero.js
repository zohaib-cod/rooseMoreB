const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Elevate Your Moments'
  },
  subtitle: {
    type: String,
    default: 'Premium Floral & Event Decoration in Lahore'
  },
  buttonText: {
    type: String,
    default: 'Shop Products'
  },
  buttonLink: {
    type: String,
    default: '/products'
  },
  backgroundImage: {
    type: String,
    default: '/images/bg.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema);
