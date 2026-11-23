const About = require('../models/About');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DEFAULT_ABOUT = {
  title: "Let's Create Magic",
  description: "At Roose More Floral & Events, we believe every occasion deserves to be beautiful. Whether it's original flowers or stunning artificial setups, we pour our heart into making your event perfect.",
  image: "/images/bike.jpg",
  boxTitle: "Get in Touch",
  phone: "+92 303 4836076",
  whatsapp: "+92 303 4836076",
  address: "Chungi Amar Sidhu, Lahore",
  isActive: true
};

// GET active About & Contact info
exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true }).sort({ updatedAt: -1 });

    if (!about) {
      about = await About.findOne().sort({ updatedAt: -1 });
    }

    if (!about) {
      about = await About.create(DEFAULT_ABOUT);
    }

    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET all About entries for admin panel
exports.getAllAbout = async (req, res) => {
  try {
    let aboutList = await About.find().sort({ createdAt: -1 });

    if (aboutList.length === 0) {
      const defaultItem = await About.create(DEFAULT_ABOUT);
      aboutList = [defaultItem];
    }

    res.status(200).json({ success: true, data: aboutList });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// CREATE new About entry
exports.createAbout = async (req, res) => {
  try {
    let body = req.body;

    if (body.image && body.image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.image, {
        folder: 'roose_more_about',
      });
      body.image = uploadResponse.secure_url;
    }

    if (body.isActive) {
      await About.updateMany({}, { isActive: false });
    }

    const about = await About.create(body);
    res.status(201).json({ success: true, data: about });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// UPDATE About entry
exports.updateAbout = async (req, res) => {
  try {
    let body = req.body;

    if (body.image && body.image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.image, {
        folder: 'roose_more_about',
      });
      body.image = uploadResponse.secure_url;
    }

    if (body.isActive === true) {
      await About.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    const about = await About.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    });

    if (!about) {
      return res.status(404).json({ success: false, error: 'About entry not found' });
    }

    res.status(200).json({ success: true, data: about });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE About entry
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);
    if (!about) {
      return res.status(404).json({ success: false, error: 'About entry not found' });
    }

    const remaining = await About.findOne({ isActive: true });
    if (!remaining) {
      const firstAvailable = await About.findOne().sort({ updatedAt: -1 });
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
