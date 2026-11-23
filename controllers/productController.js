const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let body = req.body;
    if (body.image && body.image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.image, {
        folder: 'roose_more_products',
      });
      body.image = uploadResponse.secure_url;
    }
    const product = await Product.create(body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let body = req.body;
    if (body.image && body.image.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(body.image, {
        folder: 'roose_more_products',
      });
      body.image = uploadResponse.secure_url;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
