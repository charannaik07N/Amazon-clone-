// Models/cooAll.js

const mongoose = require("mongoose");

const coolingProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discount: { type: String },
  rating: { type: Number },
  inStock: { type: Boolean, default: true },
  image: { type: String },
  images: [{ type: String }],
  features: [{ type: String }],
  keyFeatures: [{ type: String }],
  specifications: {
    brand: { type: String },
    model: { type: String },
    fanCount: { type: Number },
    fanSpeed: { type: String },
    compatibleSize: { type: String },
    powerSource: { type: String },
    noiseLevel: { type: String },
    weight: { type: String },
    dimensions: { type: String },
    material: { type: String },
    warranty: { type: String },
  },
  aboutThisItem: [{ type: String }],
});

const CoolingProduct = mongoose.model("coolAll", coolingProductSchema);

module.exports = coolAll = CoolingProduct;
