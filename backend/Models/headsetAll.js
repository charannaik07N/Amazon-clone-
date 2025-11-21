const mongoose = require("mongoose");

const colorOptionSchema = new mongoose.Schema({
  id: String,
  name: String,
});

const modelOptionSchema = new mongoose.Schema({
  model: String,
  price: Number,
});

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  rating: { type: Number },
  discount: { type: Number },
  images: [String],
  colorOptions: [colorOptionSchema],
  modelOptions: [modelOptionSchema],
  features: [String],
  specifications: {
    brand: String,
    model: String,
    type: String,
    defaultColor: String,
    batteryLife: String,
    connection: String,
    waterResistance: String,
    warranty: String,
  },
  aboutItem: [String],
  description: { type: String },
  inStock: { type: Boolean, default: true },
  freeDelivery: { type: Boolean, default: false },
  deliveryTime: { type: String },
  returnPolicy: { type: String },
  reviewCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("headsetAll", productSchema);
