const express = require("express");
const router = express.Router();
const {
  getAllStands,
  getStandById,
  addStand,
  updateStand,
  deleteStand,
} = require("../controllers/table");

// @route   GET /api/stands
// @desc    Get all stands
router.get("/", getAllStands);

// @route   GET /api/stands/:id
// @desc    Get a stand by ID
router.get("/:id", getStandById);

// @route   POST /api/stands
// @desc    Add a new stand
router.post("/", addStand);

// @route   PUT /api/stands/:id
// @desc    Update a stand by ID
router.put("/:id", updateStand);

// @route   DELETE /api/stands/:id
// @desc    Delete a stand by ID
router.delete("/:id", deleteStand);

module.exports = router;
