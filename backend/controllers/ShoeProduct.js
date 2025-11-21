// shoeController.js
const ShoeProduct = require("../Models/ShoeProduct");

// @desc    Get all shoe products
const getAllProducts = async (req, res) => {
  try {
    const products = await ShoeProduct.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Add new shoe product
const addProduct = async (req, res) => {
  try {
    // Optional: Validate req.body against schema here if needed
    const newProduct = new ShoeProduct(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// @desc    Get single shoe product by ID
const getProductById = async (req, res) => {
  try {
    const product = await ShoeProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Update shoe product
const updateProduct = async (req, res) => {
  try {
    const product = await ShoeProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// @desc    Delete shoe product
const deleteProduct = async (req, res) => {
  try {
    const product = await ShoeProduct.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
