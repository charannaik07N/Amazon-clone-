// models/watchAll.js

const mongoose = require("mongoose");

const watchSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: "Smartwatch" },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  discount: { type: Number },
  image: { type: String },
  images: [{ type: String }],
  features: [{ type: String }],
  dialShape: { type: String },
  displaySize: { type: String },
  displayType: { type: String },
  compatibleOS: { type: String },
  colorOptions: [
    {
      id: { type: String },
      name: { type: String },
    },
  ],
  modelOptions: [
    {
      model: { type: String },
      price: { type: Number },
    },
  ],
  keyFeatures: [{ type: String }],
  specifications: {
    brand: { type: String },
    model: { type: String },
    displaySize: { type: String },
    displayType: { type: String },
    processor: { type: String },
    storage: { type: String },
    batteryLife: { type: String },
    waterResistance: { type: String },
    warranty: { type: String },
    color: { type: String },
  },
  aboutThisItem: [{ type: String }],
});

const WatchProduct = mongoose.model("WatchAll", watchSchema);

module.exports = WatchProduct;
