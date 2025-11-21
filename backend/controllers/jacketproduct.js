const Product = require("../Models/jacket");

const getAllProducts = async (req, res) => {
  const search = req.query.search || "";

  try {
    const products = await Product.find({
      name: { $regex: search, $options: "i" }, // case-insensitive match
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Add new product
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};
module.exports = { getAllProducts, addProduct };
