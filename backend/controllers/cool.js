const cool = require("../Models/cool");

// @desc    Get all cool items
const getAllCoolItems = async (req, res) => {
  try {
    const allCoolItems = await cool.find();
    res.json(allCoolItems);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Get cool item by ID
const getCoolItemById = async (req, res) => {
  try {
    const coolItem = await cool.findById(req.params.id);
    if (!coolItem) return res.status(404).json({ error: "Not Found" });
    res.json(coolItem);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Add new cool item
const addCoolItem = async (req, res) => {
  try {
    const newCoolItem = new cool(req.body);
    await newCoolItem.save();
    res.status(201).json(newCoolItem);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};

// @desc    Update cool item by ID
const updateCoolItem = async (req, res) => {
  try {
    const updated = await cool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};

module.exports = {
  getAllCoolItems,
  getCoolItemById,
  addCoolItem,
  updateCoolItem,
};
