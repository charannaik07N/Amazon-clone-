const cases = require("../Models/cases");

// @desc    Get all cases
const getAllCases = async (req, res) => {
  try {
    const allCases = await cases.find();
    res.json(allCases);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Get case by ID
const getCaseById = async (req, res) => {
  try {
    const caseItem = await cases.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ error: "Not Found" });
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Add new case
const addCase = async (req, res) => {
  try {
    const newCase = new cases(req.body);
    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};
// @desc    Update case by ID
const updateCase = async (req, res) => {    
  try {
    const updated = await cases.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};

module.exports = {
  getAllCases,
  getCaseById,
  addCase,
  updateCase,
};
