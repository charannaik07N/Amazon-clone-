const power = require("../Models/power");

// @desc    Get all power products or search by keyword
const getAllPowerProducts = async (req, res) => {
  try {
    const { keyword } = req.query;
    const query = keyword ? { name: { $regex: keyword, $options: "i" } } : {};
    const powerProducts = await power.find(query);
    res.json(powerProducts);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Get a power product by ID
const getPowerProductById = async (req, res) => {
  try {
    const powerProduct = await power.findById(req.params.id);
    if (!powerProduct) {
      return res.status(404).json({ error: "Power product not found" });
    }
    res.json(powerProduct);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Add a new power product
const addPowerProduct = async (req, res) => {
  try {
    const newPowerProduct = new power(req.body);
    await newPowerProduct.save();
    res.status(201).json(newPowerProduct);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};
// @desc    Update a power product      
const updatePowerProduct = async (req, res) => {
  try {
    const updatedPowerProduct = await power.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPowerProduct) {
      return res.status(404).json({ error: "Power product not found" });
    }
    res.json(updatedPowerProduct);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};
module.exports = {
  getAllPowerProducts,
    getPowerProductById,
    addPowerProduct,
    updatePowerProduct,
};
