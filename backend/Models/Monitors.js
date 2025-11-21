// Models/monitorAll.js

const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number },
  rating: { type: Number, default: 0 },
  resolution: { type: String },
  formFactor: { type: String },
  displaySize: { type: String },
  features: [{ type: String }],
  image: { type: String },
});

const MonitorProduct = mongoose.model("Monitors", monitorSchema);

module.exports =Monitors =MonitorProduct;
