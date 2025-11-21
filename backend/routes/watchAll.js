const express = require("express");
const router = express.Router();
const {
  getAllWatches,
  getWatchById,
  addWatch,
  updateWatch,
} = require("../controllers/watchAll");

// @route   GET /api/watches
// @desc    Get all watches
router.get("/", getAllWatches);

// @route   GET /api/watches/:id
// @desc    Get a single watch by custom 'id' field
router.get("/:id", getWatchById);

// @route   POST /api/watches
// @desc    Add a new watch
router.post("/", addWatch);

// @route   PUT /api/watches/:id
// @desc    Update a watch by custom 'id' field
router.put("/:id", updateWatch);

module.exports = router;
