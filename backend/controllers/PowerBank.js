const PowerBank = require("../Models/Powerbank");

// @desc    Get all power banks
const getAllPowerBanks = async (req, res) => {
  try {
    const powerBanks = await PowerBank.find();
    res.json(powerBanks);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Get power bank by ID
const getPowerBankById = async (req, res) => {
  try {
    const powerBank = await PowerBank.findById(req.params.id);
    if (!powerBank) return res.status(404).json({ error: "Not Found" });
    res.json(powerBank);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Add new power bank
const addPowerBank = async (req, res) => {
  try {
    const newPowerBank = new PowerBank(req.body);
    await newPowerBank.save();
    res.status(201).json(newPowerBank);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};

// @desc    Update power bank by ID
const updatePowerBank = async (req, res) => {
  try {
    const updated = await PowerBank.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid Update Request" });
  }
};

// @desc    Delete power bank by ID
const deletePowerBank = async (req, res) => {
  try {
    const deleted = await PowerBank.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not Found" });
    res.json({ message: "Power bank deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getAllPowerBanks,
  getPowerBankById,
  addPowerBank,
  updatePowerBank,
  deletePowerBank,
};
