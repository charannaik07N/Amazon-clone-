const express = require("express");
const router = express.Router();
const {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartSummary,
} = require("./controllers/cartController");

// @route   GET /api/cart
// @desc    Get all cart items
// @access  Public
router.get("/", getCartItems);

// @route   POST /api/cart
// @desc    Add item to cart or update quantity if exists
// @access  Public
router.post("/", addToCart);

// @route   GET /api/cart/summary
// @desc    Get cart summary (total items, total price)
// @access  Public
router.get("/summary", getCartSummary);

// @route   PUT /api/cart/:id
// @desc    Update cart item quantity
// @access  Public
router.put("/:id", updateCartItem);

// @route   DELETE /api/cart/:id
// @desc    Remove specific item from cart
// @access  Public
router.delete("/:id", removeCartItem);

// @route   DELETE /api/cart
// @desc    Clear all cart items
// @access  Public
router.delete("/", clearCart);

module.exports = router;
