const express = require("express");
const router = express.Router();
const {
  getAllTshirts,
  getTshirtById,
  addTshirt,
  updateTshirt,
  deleteTshirt,
} = require("../controllers/TshirtAll");

// @route   GET /api/tshirts
// @desc    Get all T-shirts
router.get("/", getAllTshirts);

// @route   GET /api/tshirts/:id
// @desc    Get a single T-shirt by ID
router.get("/:id", getTshirtById);

// @route   POST /api/tshirts
// @desc    Add a new T-shirt
router.post("/", addTshirt);

// @route   PUT /api/tshirts/:id
// @desc    Update a T-shirt by ID
router.put("/:id", updateTshirt);

// @route   DELETE /api/tshirts/:id
// @desc    Delete a T-shirt by ID
router.delete("/:id", deleteTshirt);

module.exports = router;
