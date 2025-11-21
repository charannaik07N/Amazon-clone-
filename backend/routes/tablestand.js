const express = require("express");
const router = express.Router();
const {
  getAllTablestandProducts,
  addTablestandProduct,
  getTablestandProductById,
  updateTablestandProduct,
} = require("../controllers/tablestand");

// @route   GET /api/tablestands
// @desc    Get all tablestand products
router.get("/", getAllTablestandProducts);

// @route   POST /api/tablestands
// @desc    Add a new tablestand product
router.post("/", addTablestandProduct);

// @route   GET /api/tablestands/:id
// @desc    Get a tablestand product by ID
router.get("/:id", getTablestandProductById);

// @route   PUT /api/tablestands/:id
// @desc    Update a tablestand product by ID
router.put("/:id", updateTablestandProduct);

module.exports = router;
