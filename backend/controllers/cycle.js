// controllers/cycleController.js
const Cycle = require("../Models/cycle"); // Make sure this is the correct model file

// @desc    Get all cycles
// @route   GET /api/cycles
const getAllCycles = async (req, res) => {
  try {
    const cycles = await Cycle.find({});
    res.status(200).json(cycles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cycles", error });
  }
};

// @desc    Get a single cycle by ID
// @route   GET /api/cycles/:id
const getCycleById = async (req, res) => {
  try {
    const cycleItem = await Cycle.findById(req.params.id);
    if (!cycleItem) {
      return res.status(404).json({ message: "Cycle not found" });
    }
    res.status(200).json(cycleItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cycle", error });
  }
};

// @desc    Add a new cycle
// @route   POST /api/cycles
const addCycle = async (req, res) => {
  try {
    const newCycle = new Cycle(req.body);
    await newCycle.save();
    res.status(201).json(newCycle);
  } catch (error) {
    res.status(400).json({ message: "Error adding cycle", error });
  }
};

// @desc    Update a cycle
// @route   PUT /api/cycles/:id
const updateCycle = async (req, res) => {
  try {
    const updatedCycle = await Cycle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCycle) {
      return res.status(404).json({ message: "Cycle not found" });
    }
    res.status(200).json(updatedCycle);
  } catch (error) {
    res.status(400).json({ message: "Error updating cycle", error });
  }
};

module.exports = {
  getAllCycles,
  getCycleById,
  addCycle,
  updateCycle,
};
