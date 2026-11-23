const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide section name'], 
    unique: true,
    trim: true
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  description: { 
    type: String, 
    default: '' 
  },
  image: { 
    type: String, 
    default: '' 
  },
  showOnHome: { 
    type: Boolean, 
    default: true 
  },
  showInNav: { 
    type: Boolean, 
    default: true 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Section', SectionSchema);
