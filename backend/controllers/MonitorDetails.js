const Product = require("../Models/MonitorDetails");

// @desc    Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Add new product
const addProduct = async (req, res) => {
  try {
    // Optional: Validate req.body against schema here if needed

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

module.exports = { getAllProducts, addProduct };
