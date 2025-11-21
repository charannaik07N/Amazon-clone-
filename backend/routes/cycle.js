const express = require('express');
const router = express.Router();
const {
  getAllCycles,
  getCycleById,
  addCycle,
  updateCycle,
} = require("../controllers/cycle");
router.get("/", getAllCycles); // Get all cycles
router.get("/:id", getCycleById); // Get cycle by ID    
router.post("/", addCycle); // Add new cycle
router.put("/:id", updateCycle); // Update cycle by ID
module.exports = router; // Export the router for use in the main app