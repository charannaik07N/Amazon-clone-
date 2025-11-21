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
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  rating: { type: Number },
  discount: { type: Number },
  name: { type: String, required: true },
  image: { type: String },
  features: [String],
  type: { type: String },
  resolution: { type: String },
  formFactor: { type: String },
  displaySize: { type: String },
  images: [String],
  colorOptions: [colorOptionSchema],
  modelOptions: [modelOptionSchema],
  keyFeatures: [String],
  specifications: {
    brand: String,
    model: String,
    displaySize: String,
    resolution: String,
    responseTime: String,
    panelType: String,
    warranty: String,
    color: String,
  },
  aboutThisItem: [String],
});

module.exports = mongoose.model("MonitorDetails", productSchema);
