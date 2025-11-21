const Tshirt = require("../Models/TshirtAll");

// @desc    Get all T-shirts
// @route   GET /api/tshirts
const getAllTshirts = async (req, res) => {
  try {
    const tshirts = await Tshirt.find();
    res.status(200).json(tshirts);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Get single T-shirt by ID
// @route   GET /api/tshirts/:id
const getTshirtById = async (req, res) => {
  try {
    const tshirt = await Tshirt.findById(req.params.id);
    if (!tshirt) {
      return res.status(404).json({ message: "T-shirt not found" });
    }
    res.status(200).json(tshirt);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Add a new T-shirt
// @route   POST /api/tshirts
const addTshirt = async (req, res) => {
  try {
    const newTshirt = new Tshirt(req.body);
    await newTshirt.save();
    res.status(201).json(newTshirt);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// @desc    Update a T-shirt
// @route   PUT /api/tshirts/:id
const updateTshirt = async (req, res) => {
  try {
    const updated = await Tshirt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "T-shirt not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// @desc    Delete a T-shirt
// @route   DELETE /api/tshirts/:id
const deleteTshirt = async (req, res) => {
  try {
    const deleted = await Tshirt.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "T-shirt not found" });
    }
    res.status(200).json({ message: "T-shirt deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
};

module.exports = {
  getAllTshirts,
  getTshirtById,
  addTshirt,
  updateTshirt,
  deleteTshirt,
};
