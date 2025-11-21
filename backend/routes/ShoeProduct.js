// routes/shoeRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/ShoeProduct");

// @route   GET /api/shoes
// @desc    Get all shoe products
// @access  Public
router.get("/", getAllProducts);

// @route   POST /api/shoes
// @desc    Add new shoe product
// @access  Private (you might want to add auth middleware)
router.post("/", addProduct);

// @route   GET /api/shoes/:id
// @desc    Get single shoe product by ID
// @access  Public
router.get("/:id", getProductById);

// @route   PUT /api/shoes/:id
// @desc    Update shoe product
// @access  Private (you might want to add auth middleware)
router.put("/:id", updateProduct);

// @route   DELETE /api/shoes/:id
// @desc    Delete shoe product
// @access  Private (you might want to add auth middleware)
router.delete("/:id", deleteProduct);

module.exports = router;
