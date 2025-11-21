// Models/cycleAll.js

const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Mountain Cycle
  gearType: { type: String },
  frontBrake: { type: String },
  rearBrake: { type: String },
  price: { type: Number, required: true },
  ageGroup: { type: String },
  discount: { type: Number }, // Discount percentage
  name: { type: String, required: true },
  image: { type: String },
});

const CycleProduct = mongoose.model("cycle", cycleSchema);

module.exports = cycle = CycleProduct;
