const Earbudsdetails = require("../Models/Earbudsdetails");

// @desc    Get all Earbuds details
const getAllEarbudsDetails = async (req, res) => {
  try {
    const earbudsDetails = await Earbudsdetails.find();
    res.json(earbudsDetails);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Get Earbuds details by ID
const getEarbudsDetailsById = async (req, res) => {
  try {
    const earbudsDetails = await Earbudsdetails.findById(req.params.id);
    if (!earbudsDetails) return res.status(404).json({ error: "Not Found" });
    res.json(earbudsDetails);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Add new Earbuds details
const addEarbudsDetails = async (req, res) => {
  try {
    const newEarbudsDetails = new Earbudsdetails(req.body);
    await newEarbudsDetails.save();
    res.status(201).json(newEarbudsDetails);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};

// @desc    Update Earbuds details by ID
const updateEarbudsDetails = async (req, res) => {
  try {
    const updated = await Earbudsdetails.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid Update Request" });
  }
};

// @desc    Delete Earbuds details by ID
const deleteEarbudsDetails = async (req, res) => {
  try {
    const deleted = await Earbudsdetails.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not Found" });
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getAllEarbudsDetails,
  getEarbudsDetailsById,
  addEarbudsDetails,
  updateEarbudsDetails,
  deleteEarbudsDetails,
};
