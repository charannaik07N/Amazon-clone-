const Earbuds = require("../Models/EarBuds");

// @desc    Get all Earbuds
const getAllEarbuds = async (req, res) => {
  try {
    const earbuds = await Earbuds.find();
    res.json(earbuds);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Get Earbuds by ID
const getEarbudsById = async (req, res) => {
  try {
    const earbuds = await Earbuds.findById(req.params.id);
    if (!earbuds) return res.status(404).json({ error: "Not Found" });
    res.json(earbuds);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Add new Earbuds
const addEarbuds = async (req, res) => {
  try {
    const newEarbuds = new Earbuds(req.body);
    await newEarbuds.save();
    res.status(201).json(newEarbuds);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};
// @desc    Update Earbuds by ID
const updateEarbuds = async (req, res) => {
  try {
    const updated = await Earbuds.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid Update Request" });
  }
};

module.exports = {
  getAllEarbuds,
  getEarbudsById,
  addEarbuds,
  updateEarbuds,
};
