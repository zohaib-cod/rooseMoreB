const Service = require('../models/Service');

const DEFAULT_SERVICES = [
  { title: "Original & Artificial Flowers", icon: "Flower2", desc: "Breathtaking arrangements using fresh and premium artificial blooms.", order: 1, isActive: true },
  { title: "Birthday & Party Events", icon: "Gift", desc: "Make your special day unforgettable with our custom event styling.", order: 2, isActive: true },
  { title: "Room Decor", icon: "Heart", desc: "Romantic and aesthetic room transformations for any occasion.", order: 3, isActive: true },
  { title: "Bouquets", icon: "Sparkles", desc: "Hand-tied, bespoke bouquets crafted with love and care.", order: 4, isActive: true },
  { title: "Car Decor", icon: "Crown", desc: "Elegant floral adornments for wedding and event vehicles.", order: 5, isActive: true },
  { title: "Zewar Sett", icon: "Sparkles", desc: "Beautiful floral jewelry sets for Mehndi and Mayun.", order: 6, isActive: true },
  { title: "Baby Shower", icon: "Heart", desc: "Soft, beautiful setups to welcome your little one.", order: 7, isActive: true },
  { title: "House Decor", icon: "Home", desc: "Complete home floral transformations for festive events.", order: 8, isActive: true }
];

// GET active services for public homepage
exports.getServices = async (req, res) => {
  try {
    let services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    // Auto-seed default services if collection is empty
    if (services.length === 0) {
      services = await Service.insertMany(DEFAULT_SERVICES);
    }

    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// GET all services for admin panel (active & inactive)
exports.getAllServices = async (req, res) => {
  try {
    let services = await Service.find().sort({ order: 1, createdAt: 1 });

    if (services.length === 0) {
      services = await Service.insertMany(DEFAULT_SERVICES);
    }

    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// CREATE new service
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// UPDATE service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
