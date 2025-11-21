const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    image: {
      type: String,
      default: "/api/placeholder/200/150",
    },
    color: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster queries
cartSchema.index({ productId: 1 });

// Virtual for total price of this cart item
cartSchema.virtual("totalPrice").get(function () {
  return this.price * this.quantity;
});

cartSchema.set("toJSON", {
  virtuals: true,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
