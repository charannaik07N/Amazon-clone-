const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  addProduct,
} = require("../controllers/MonitorDetails");

// @route   GET /api/products
// @desc    Get all products
router.get("/", getAllProducts);

// @route   POST /api/products
// @desc    Add a new product
router.post("/", addProduct);

module.exports = router;
