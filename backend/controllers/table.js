const Stand = require("../Models/table");

// @desc    Get all stands
const getAllStands = async (req, res) => {
  try {
    const stands = await Stand.find();
    res.status(200).json(stands);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get single stand by ID
const getStandById = async (req, res) => {
  try {
    const stand = await Stand.findOne({ id: req.params.id });
    if (!stand) return res.status(404).json({ message: "Stand not found" });
    res.status(200).json(stand);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Add a new stand
const addStand = async (req, res) => {
  try {
    const newStand = new Stand(req.body);
    const saved = await newStand.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

// @desc    Update a stand by ID
const updateStand = async (req, res) => {
  try {
    const updated = await Stand.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Stand not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error });
  }
};

// @desc    Delete a stand by ID
const deleteStand = async (req, res) => {
  try {
    const deleted = await Stand.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Stand not found" });
    res.status(200).json({ message: "Stand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};

module.exports = {
  getAllStands,
  getStandById,
  addStand,
  updateStand,
  deleteStand,
};
