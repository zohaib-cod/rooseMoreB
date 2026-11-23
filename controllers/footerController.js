const Footer = require('../models/Footer');

const DEFAULT_FOOTER = {
  brandName: 'Roose More Floral & Events',
  tagline: 'Premium Floral & Event Decoration in Lahore',
  copyrightText: 'Roose More. All rights reserved.',
  showYear: true,
  phone: '+92 303 4836076',
  whatsapp: '+92 303 4836076',
  address: 'Chungi Amar Sidhu, Lahore',
  instagram: '',
  facebook: '',
  isActive: true
};

// GET active footer
exports.getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne({ isActive: true }).sort({ updatedAt: -1 });

    if (!footer) {
      footer = await Footer.findOne().sort({ updatedAt: -1 });
    }

    if (!footer) {
      footer = await Footer.create(DEFAULT_FOOTER);
    }

    res.status(200).json({ success: true, data: footer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET all footers for admin panel
exports.getAllFooters = async (req, res) => {
  try {
    let footers = await Footer.find().sort({ createdAt: -1 });

    if (footers.length === 0) {
      const defaultItem = await Footer.create(DEFAULT_FOOTER);
      footers = [defaultItem];
    }

    res.status(200).json({ success: true, data: footers });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// CREATE new footer settings
exports.createFooter = async (req, res) => {
  try {
    let body = req.body;

    if (body.isActive) {
      await Footer.updateMany({}, { isActive: false });
    }

    const footer = await Footer.create(body);
    res.status(201).json({ success: true, data: footer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// UPDATE footer settings
exports.updateFooter = async (req, res) => {
  try {
    let body = req.body;

    if (body.isActive === true) {
      await Footer.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    const footer = await Footer.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    });

    if (!footer) {
      return res.status(404).json({ success: false, error: 'Footer settings not found' });
    }

    res.status(200).json({ success: true, data: footer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE footer settings
exports.deleteFooter = async (req, res) => {
  try {
    const footer = await Footer.findByIdAndDelete(req.params.id);
    if (!footer) {
      return res.status(404).json({ success: false, error: 'Footer settings not found' });
    }

    const remaining = await Footer.findOne({ isActive: true });
    if (!remaining) {
      const firstAvailable = await Footer.findOne().sort({ updatedAt: -1 });
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
