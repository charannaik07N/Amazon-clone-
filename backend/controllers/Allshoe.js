const Allshoe = require("../Models/Allshoe");

// @desc    Get all products with optional search
const getAllProducts = async (req, res) => {
  const search = req.query.search || "";

  try {
    const products = await Allshoe.find({
      name: { $regex: search, $options: "i" }, // case-insensitive search
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Add new product
const addProduct = async (req, res) => {
  try {
    const newProduct = new Allshoe(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

module.exports = { getAllProducts, addProduct };
