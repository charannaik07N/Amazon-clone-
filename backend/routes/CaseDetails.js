const express = require("express");
const router = express.Router();
const {
  getAllCaseDetails,
  getCaseDetailsById,
  addCaseDetails,
  updateCaseDetails,
} = require("../controllers/CaseDetails");

// GET all cases
router.get("/", getAllCaseDetails);

// GET single case by ID
router.get("/:id", getCaseDetailsById);

// POST new case
router.post("/", addCaseDetails);

// PUT update case by ID
router.put("/:id", updateCaseDetails);

module.exports = router;
