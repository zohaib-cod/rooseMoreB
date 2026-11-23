const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    default: 'Roose More Floral & Events'
  },
  tagline: {
    type: String,
    default: 'Premium Floral & Event Decoration in Lahore'
  },
  copyrightText: {
    type: String,
    default: 'Roose More. All rights reserved.'
  },
  showYear: {
    type: Boolean,
    default: true
  },
  phone: {
    type: String,
    default: '+92 303 4836076'
  },
  whatsapp: {
    type: String,
    default: '+92 303 4836076'
  },
  address: {
    type: String,
    default: 'Chungi Amar Sidhu, Lahore'
  },
  instagram: {
    type: String,
    default: ''
  },
  facebook: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Footer', footerSchema);
