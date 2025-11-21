// Models/tshirtAll.js

const mongoose = require("mongoose");

const tshirtSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discount: { type: String },
  image: { type: String },
  fabric: { type: String },
  rating: { type: Number, default: 0 },
});

const TshirtProduct = mongoose.model("Tshirt", tshirtSchema);

module.exports = Tshirt =  TshirtProduct;
