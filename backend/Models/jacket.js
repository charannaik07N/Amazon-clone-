const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true }, // Array of image URLs/paths
  colors: [
    {
      id: { type: String, required: true },
      value: { type: String, required: true }, // e.g. Hex color code
      name: { type: String, required: true },
    },
  ],
  sizes: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("jacket", productSchema);
