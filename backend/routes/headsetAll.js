const express = require("express");
const router = express.Router();
const {
  getAllHeadsets,
  getHeadsetById,
  addHeadset,
  updateHeadset,
} = require("../controllers/headsetAll");

router.get("/", getAllHeadsets); // Get all headsets
router.get("/:id", getHeadsetById); // Get headset by ID
router.post("/", addHeadset); // Add new headset
router.put("/:id", updateHeadset); // Update headset by ID

module.exports = router; // Export the router for use in the main app
