const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Let's Create Magic"
  },
  description: {
    type: String,
    default: "At Roose More Floral & Events, we believe every occasion deserves to be beautiful. Whether it's original flowers or stunning artificial setups, we pour our heart into making your event perfect."
  },
  image: {
    type: String,
    default: "/images/bike.jpg"
  },
  boxTitle: {
    type: String,
    default: "Get in Touch"
  },
  phone: {
    type: String,
    default: "+92 303 4836076"
  },
  whatsapp: {
    type: String,
    default: "+92 303 4836076"
  },
  address: {
    type: String,
    default: "Chungi Amar Sidhu, Lahore"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
