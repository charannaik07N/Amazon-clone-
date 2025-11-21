const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  rating: { type: Number, required: true },
  discount: { type: Number, required: true },
  bodyType: { type: String },
  wheels: { type: String },
  images: [String], // ✅ Array of image paths
  colors: [
    {
      id: String,
      value: String,
      name: String,
    },
  ],
  features: [String],
  size:{ type:String},
  quantity: { type: Number, default: 100 },
});

module.exports = mongoose.model("Allshoe", productSchema);
