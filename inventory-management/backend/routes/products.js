const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const { showMyProducts } = req.query;
    console.log('Fetching products, showMyProducts:', showMyProducts);
    
    let query = {};
    if (showMyProducts === 'true') {
      query = { user: req.user._id };
      console.log('Fetching only user products for:', req.user._id);
    } else {
      console.log('Fetching all products');
    }

    const products = await Product.find(query)
      .populate('user', 'name _id')
      .sort({ createdAt: -1 });
    
    console.log('Found products:', products.length);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get single product (only if owned by the user)
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    console.log('Creating product for user:', req.user._id);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      image: req.file ? req.file.path : '',
      user: req.user._id
    });

    console.log('New product:', product);
    const newProduct = await product.save();
    console.log('Saved product:', newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update product
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.quantity = req.body.quantity || product.quantity;
    product.category = req.body.category || product.category;
    if (req.file) {
      product.image = req.file.path;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 