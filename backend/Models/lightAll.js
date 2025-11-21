const mongoose = require("mongoose");

const TableLampSchema = new mongoose.Schema({
  name: String,
  brand: String,
  originalPrice: Number,
  discountedPrice: Number,
  rating: Number,
  discount: Number,
  type: String,
  image: String,
  watts: String,
  material: String,
  features: [String],
  colorOptions: [{ id: String, name: String }],
  modelOptions: [{ model: String, price: Number }],
  images: [String],
  keyFeatures: [String],
  specifications: {
    brand: String,
    model: String,
    watts: String,
    material: String,
    powerSource: String,
    controlType: String,
    dimensions: String,
    warranty: String,
    color: String,
  },
  aboutThisItem: [String],
});

module.exports = mongoose.model("lightAll", TableLampSchema);
