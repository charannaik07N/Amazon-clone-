// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    original_price: {
      type: Number,
      required: true,
      min: 0,
    },
    discounted_price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: String, // since you're using "32%" as a string
      default: "0%",
    },
    image: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
    category: {
      type: String,
      default: "cool", // so you can query all cooling pads
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("cool", productSchema);
