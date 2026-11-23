const Hero = require('../models/Hero');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DEFAULT_HERO = {
  title: 'Elevate Your Moments',
  subtitle: 'Premium Floral & Event Decoration in Lahore',
  buttonText: 'Shop Products',
  buttonLink: '/products',
  backgroundImage: '/images/bg.jpg',
  isActive: true
};

// GET active hero (or latest) - auto-initializes if none exists
exports.getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne({ isActive: true }).sort({ updatedAt: -1 });
    
    // If no active hero found, find any hero
    if (!hero) {
      hero = await Hero.findOne().sort({ updatedAt: -1 });
    }

    // If still none, create default hero
    if (!hero) {
      hero = await Hero.create(DEFAULT_HERO);
    }

    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET all heroes (for admin management list)
exports.getAllHeroes = async (req, res) => {
  try {
    let heroes = await Hero.find().sort({ createdAt: -1 });
    if (heroes.length === 0) {
      const defaultHero = await Hero.create(DEFAULT_HERO);
      heroes = [defaultHero];
    }
    res.status(200).json({ success: true, data: heroes });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// CREATE new hero banner
exports.createHero = async (req, res) => {
  try {
    let body = req.body;

    if (body.backgroundImage && body.backgroundImage.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.backgroundImage, {
        folder: 'roose_more_hero',
      });
      body.backgroundImage = uploadResponse.secure_url;
    }

    // If setting this one active, optionally deactivate other heroes
    if (body.isActive) {
      await Hero.updateMany({}, { isActive: false });
    }

    const hero = await Hero.create(body);
    res.status(201).json({ success: true, data: hero });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// UPDATE hero banner
exports.updateHero = async (req, res) => {
  try {
    let body = req.body;

    if (body.backgroundImage && body.backgroundImage.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.backgroundImage, {
        folder: 'roose_more_hero',
      });
      body.backgroundImage = uploadResponse.secure_url;
    }

    // If marking active, deactivate others
    if (body.isActive === true) {
      await Hero.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    const hero = await Hero.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    });

    if (!hero) {
      return res.status(404).json({ success: false, error: 'Hero banner not found' });
    }

    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE hero banner
exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) {
      return res.status(404).json({ success: false, error: 'Hero banner not found' });
    }

    // Ensure at least one active hero remains if any exist
    const remaining = await Hero.findOne({ isActive: true });
    if (!remaining) {
      const firstAvailable = await Hero.findOne().sort({ updatedAt: -1 });
      if (firstAvailable) {
        firstAvailable.isActive = true;
        await firstAvailable.save();
      }
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
