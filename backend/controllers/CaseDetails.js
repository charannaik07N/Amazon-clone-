const CaseDetails = require("../Models/CaseDetails");

// @desc    Get all case details
const getAllCaseDetails = async (req, res) => {
  try {
    const cases = await CaseDetails.find();
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Get case details by ID
const getCaseDetailsById = async (req, res) => {
  try {
    const caseDetails = await  CaseDetails.findById(req.params.id);
    if (!caseDetails) return res.status(404).json({ error: "Not Found" });
    res.json(caseDetails); 
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
    }
};
// @desc    Add new case details
const addCaseDetails = async (req, res) => {
  try {
    const newCase = new CaseDetails(req.body);
    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};
// @desc    Update case details by ID
const updateCaseDetails = async (req, res) => {
  try {
    const updated = await CaseDetails.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

module.exports = {
  getAllCaseDetails,
  getCaseDetailsById,
  addCaseDetails,
  updateCaseDetails,
};
