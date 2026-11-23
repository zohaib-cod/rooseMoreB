const mongoose = require('mongoose');

const showcaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Perfection in Every Petal.'
  },
  description: {
    type: String,
    default: 'We source the finest blooms to create masterpieces that leave a lasting impression. Every bouquet is crafted with love and attention to detail.'
  },
  buttonText: {
    type: String,
    default: 'Browse All Products'
  },
  buttonLink: {
    type: String,
    default: '/products'
  },
  productName: {
    type: String,
    default: ''
  },
  productPrice: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Showcase', showcaseSchema);
