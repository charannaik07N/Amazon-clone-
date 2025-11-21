const watchAll = require("../Models/watchAll");

// @desc    Get all watches
const getAllWatches = async (req, res) => {
  try {
    const watches = await watchAll.find();
    res.json(watches);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get watch by ID (custom 'id' field, not _id)
const getWatchById = async (req, res) => {
  try {
    const watch = await watchAll.findOne({ id: req.params.id });
    if (!watch) {
      return res.status(404).json({ message: "Watch not found" });
    }
    res.json(watch);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Add a new watch
const addWatch = async (req, res) => {
  try {
    const newWatch = new watchAll(req.body);
    await newWatch.save();
    res.status(201).json(newWatch);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

// @desc    Update a watch by ID (custom 'id' field)
const updateWatch = async (req, res) => {
  try {
    const updatedWatch = await watchAll.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedWatch) {
      return res.status(404).json({ message: "Watch not found" });
    }

    res.json(updatedWatch);
  } catch (error) {
    res.status(400).json({ message: "Error updating watch", error });
  }
};

module.exports = {
  getAllWatches,
  getWatchById,
  addWatch,
  updateWatch,
};
