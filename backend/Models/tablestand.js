// Models/standAll.js

const mongoose = require("mongoose");
const tablestands = require("../Data/tablestand");

const standSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  company: { type: String, required: true },
  features: [{ type: String }],
  material: { type: String },
  image: { type: String },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discount: { type: Number },
  rating: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
});

const StandProduct = mongoose.model("tablestand", standSchema);

module.exports =tablestand =StandProduct;
