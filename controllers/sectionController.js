const Section = require('../models/Section');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DEFAULT_SECTIONS = [
  { name: "Bouquets", slug: "bouquets", showOnHome: true, order: 1, description: "Bespoke hand-tied floral bouquets." },
  { name: "Room Decor", slug: "room-decor", showOnHome: true, order: 2, description: "Romantic & aesthetic room transformations." },
  { name: "Car Decor", slug: "car-decor", showOnHome: true, order: 3, description: "Elegant wedding car floral adornments." },
  { name: "Zewar Sett", slug: "zewar-sett", showOnHome: true, order: 4, description: "Handcrafted fresh floral jewelry sets." },
  { name: "Party Decor", slug: "party-decor", showOnHome: true, order: 5, description: "Custom event styling and backdrops." },
  { name: "Artificial", slug: "artificial", showOnHome: true, order: 6, description: "Everlasting premium silk flowers." },
  { name: "Decor Accessories", slug: "decor-accessories", showOnHome: true, order: 7, description: "Poppers, candles, and cake cutting sets." }
];

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// GET all sections
exports.getSections = async (req, res) => {
  try {
    let sections = await Section.find({}).sort({ order: 1, createdAt: 1 });
    
    // Auto-seed default sections if none exist yet
    if (sections.length === 0) {
      sections = await Section.insertMany(DEFAULT_SECTIONS);
    }
    
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET single section by slug
exports.getSectionBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const section = await Section.findOne({ slug });
    if (!section) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// CREATE new section
exports.createSection = async (req, res) => {
  try {
    let body = req.body;
    
    if (!body.slug && body.name) {
      body.slug = generateSlug(body.name);
    } else if (body.slug) {
      body.slug = generateSlug(body.slug);
    }

    if (body.image && body.image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.image, {
        folder: 'roose_more_sections',
      });
      body.image = uploadResponse.secure_url;
    }

    const section = await Section.create(body);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// UPDATE section
exports.updateSection = async (req, res) => {
  try {
    let body = req.body;
    
    if (body.name && !body.slug) {
      body.slug = generateSlug(body.name);
    } else if (body.slug) {
      body.slug = generateSlug(body.slug);
    }

    if (body.image && body.image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.image, {
        folder: 'roose_more_sections',
      });
      body.image = uploadResponse.secure_url;
    }

    const section = await Section.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    });
    
    if (!section) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE section
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, error: 'Section not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
