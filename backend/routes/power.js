const express = require("express");
const router = express.Router();
const {
  getAllPowerProducts,
  getPowerProductById,
  addPowerProduct,
  updatePowerProduct,
} = require("../controllers/power");

// @route   GET /api/power?keyword=...
// @desc    Get all power products or search by keyword
router.get("/", getAllPowerProducts);

// @route   GET /api/power/:id
// @desc    Get a single power product by ID
router.get("/:id", getPowerProductById);

// @route   POST /api/power
// @desc    Add a new power product
router.post("/", addPowerProduct);

// @route   PUT /api/power/:id
// @desc    Update an existing power product by ID
router.put("/:id", updatePowerProduct);

module.exports = router;
