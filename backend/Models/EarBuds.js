// Models/earAll.js

const mongoose = require("mongoose");

const earphoneSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  discount: { type: Number }, // Discount percentage
  name: { type: String, required: true },
  image: { type: String },
  features: [{ type: String }],
});

const EarphoneProduct = mongoose.model("Earbuds", earphoneSchema);

module.exports = Earbuds = EarphoneProduct;
