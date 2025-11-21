// Models/earbudsAll.js

const mongoose = require("mongoose");

const earbudsSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: "Earbuds" },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  discount: { type: Number },
  images: [{ type: String }],
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
  features: [{ type: String }],
  specifications: {
    brand: { type: String },
    model: { type: String },
    type: { type: String },
    defaultColor: { type: String },
    batteryLife: { type: String },
    connection: { type: String },
    waterResistance: { type: String },
    warranty: { type: String },
  },
  aboutItem: [{ type: String }],
  description: { type: String },
  inStock: { type: Boolean, default: true },
  freeDelivery: { type: Boolean, default: false },
  deliveryTime: { type: String },
  returnPolicy: { type: String },
  reviewCount: { type: Number },
});

const EarbudsProduct = mongoose.model("Earbudsdetails", earbudsSchema);

module.exports = Earbudsdetails = EarbudsProduct;
