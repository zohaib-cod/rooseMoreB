const Showcase = require('../models/Showcase');
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DEFAULT_SHOWCASE = {
  title: 'Perfection in Every Petal.',
  description: 'We source the finest blooms to create masterpieces that leave a lasting impression. Every bouquet is crafted with love and attention to detail.',
  buttonText: 'Browse All Products',
  buttonLink: '/products',
  productName: '',
  productPrice: 0,
  image: '',
  isActive: true
};

// GET active showcase section - auto-initializes if none exists
exports.getShowcase = async (req, res) => {
  try {
    let showcase = await Showcase.findOne({ isActive: true })
      .populate('productId')
      .sort({ updatedAt: -1 });

    if (!showcase) {
      showcase = await Showcase.findOne()
        .populate('productId')
        .sort({ updatedAt: -1 });
    }

    if (!showcase) {
      showcase = await Showcase.create(DEFAULT_SHOWCASE);
    }

    res.status(200).json({ success: true, data: showcase });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET all showcases (for admin panel list)
exports.getAllShowcases = async (req, res) => {
  try {
    let showcases = await Showcase.find()
      .populate('productId')
      .sort({ createdAt: -1 });

    if (showcases.length === 0) {
      const defaultItem = await Showcase.create(DEFAULT_SHOWCASE);
      showcases = [defaultItem];
    }

    res.status(200).json({ success: true, data: showcases });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// CREATE new showcase
exports.createShowcase = async (req, res) => {
  try {
    let body = req.body;

    if (body.image && body.image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.image, {
        folder: 'roose_more_showcase',
      });
      body.image = uploadResponse.secure_url;
    }

    if (body.isActive) {
      await Showcase.updateMany({}, { isActive: false });
    }

    const showcase = await Showcase.create(body);
    res.status(201).json({ success: true, data: showcase });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// UPDATE showcase
exports.updateShowcase = async (req, res) => {
  try {
    let body = req.body;

    if (body.image && body.image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.image, {
        folder: 'roose_more_showcase',
      });
      body.image = uploadResponse.secure_url;
    }

    if (body.isActive === true) {
      await Showcase.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    const showcase = await Showcase.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    }).populate('productId');

    if (!showcase) {
      return res.status(404).json({ success: false, error: 'Showcase section not found' });
    }

    res.status(200).json({ success: true, data: showcase });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE showcase
exports.deleteShowcase = async (req, res) => {
  try {
    const showcase = await Showcase.findByIdAndDelete(req.params.id);
    if (!showcase) {
      return res.status(404).json({ success: false, error: 'Showcase section not found' });
    }

    const remaining = await Showcase.findOne({ isActive: true });
    if (!remaining) {
      const firstAvailable = await Showcase.findOne().sort({ updatedAt: -1 });
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
