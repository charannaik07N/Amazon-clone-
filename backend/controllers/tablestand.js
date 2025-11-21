const tablestand = require("../Models/tablestand");

// @desc    Get all tablestand products
const getAllTablestandProducts = async (req, res) => {  
  try {
    const products = await tablestand.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Add new tablestand product
const addTablestandProduct = async (req, res) => {
  try {
    const newProduct = new tablestand(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};
// @desc    Get tablestand product by ID
const getTablestandProductById = async (req, res) => {
  try {
    const product = await tablestand.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Tablestand product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Update tablestand product
const updateTablestandProduct = async (req, res) => {
  try {
    const updatedProduct = await tablestand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Tablestand product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};
module.exports = {
  getAllTablestandProducts,
  addTablestandProduct,
  getTablestandProductById,
  updateTablestandProduct,
};