const headsetAll = require("../Models/headsetAll");

// @desc    Get all Headsets
const getAllHeadsets = async (req, res) => {
  try {
    const headsets = await headsetAll.find();
    res.json(headsets);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Get Headset by ID
const getHeadsetById = async (req, res) => {
  try {
    const headset = await headsetAll.findById(req.params.id);
    if (!headset) return res.status(404).json({ error: "Not Found" });
    res.json(headset);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Add new Headset
const addHeadset = async (req, res) => {
  try {
    const newHeadset = new headsetAll(req.body);
    await newHeadset.save();
    res.status(201).json(newHeadset);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};

// @desc    Update Headset by ID
const updateHeadset = async (req, res) => {
  try {
    const updated = await headsetAll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid Update Request" });
  }
};

module.exports = {
  getAllHeadsets,
  getHeadsetById,
  addHeadset,
  updateHeadset,
};
