const Cart = require("../Models/Cart");

// @desc    Get all cart items
// @route   GET /api/cart
// @access  Public
const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({}).sort({ createdAt: -1 });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      message: "Error fetching cart items",
      error: error.message,
    });
  }
};

// @desc    Add item to cart or update quantity if exists
// @route   POST /api/cart
// @access  Public
const addToCart = async (req, res) => {
  try {
    const { productId, name, price, quantity, image, color, size, category } =
      req.body;

    // Validate required fields
    if (!productId || !name || price === undefined || !quantity) {
      return res.status(400).json({
        message:
          "Missing required fields: productId, name, price, and quantity are required",
      });
    }

    // Validate data types
    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        message: "Price must be a non-negative number",
      });
    }

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive number",
      });
    }

    // Check if item already exists in cart
    const existingItem = await Cart.findOne({ productId });

    if (existingItem) {
      // Update quantity of existing item
      existingItem.quantity += quantity;
      const updatedItem = await existingItem.save();

      return res.status(200).json({
        message: "Cart item updated successfully",
        data: updatedItem,
        ...updatedItem.toJSON(),
      });
    } else {
      // Create new cart item
      const newCartItem = new Cart({
        productId,
        name,
        price,
        quantity,
        image: image || "/api/placeholder/200/150",
        color: color || "",
        size: size || "",
        category: category || "General",
      });

      const savedItem = await newCartItem.save();

      return res.status(201).json({
        message: "Item added to cart successfully",
        data: savedItem,
        ...savedItem.toJSON(),
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Public
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive number",
      });
    }

    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    cartItem.quantity = quantity;
    const updatedItem = await cartItem.save();

    res.status(200).json({
      message: "Cart item updated successfully",
      data: updatedItem,
      ...updatedItem.toJSON(),
    });
  } catch (error) {
    console.error("Error updating cart item:", error);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid cart item ID",
      });
    }

    res.status(500).json({
      message: "Error updating cart item",
      error: error.message,
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Public
const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    await Cart.findByIdAndDelete(id);

    res.status(200).json({
      message: "Item removed from cart successfully",
      removedItem: cartItem,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid cart item ID",
      });
    }

    res.status(500).json({
      message: "Error removing cart item",
      error: error.message,
    });
  }
};

// @desc    Clear all cart items
// @route   DELETE /api/cart
// @access  Public
const clearCart = async (req, res) => {
  try {
    const result = await Cart.deleteMany({});

    res.status(200).json({
      message: "Cart cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

// @desc    Get cart summary (total items, total price)
// @route   GET /api/cart/summary
// @access  Public
const getCartSummary = async (req, res) => {
  try {
    const cartItems = await Cart.find({});

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.status(200).json({
      totalItems,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      itemCount: cartItems.length,
    });
  } catch (error) {
    console.error("Error getting cart summary:", error);
    res.status(500).json({
      message: "Error getting cart summary",
      error: error.message,
    });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartSummary,
};
