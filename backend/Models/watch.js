const mongoose = require("mongoose");

const watchSchema = new mongoose.Schema({
  id: Number,
  brand: String,
  price: Number,
  originalPrice: Number, // optional
  discountedPrice: Number, // optional
  rating: Number,
  discount: Number,
  name: String,
  image: String,
  features: [String],
  type: String,
  dialShape: String,
  displaySize: String,
  displayType: String,
  compatibleOS: String,
  images: [String],
  colorOptions: [
    {
      id: String,
      name: String,
    },
  ],
  modelOptions: [
    {
      model: String,
      price: Number,
    },
  ],
  keyFeatures: [String],
  specifications: {
    brand: String,
    model: String,
    displaySize: String,
    displayType: String,
    processor: String,
    storage: String,
    batteryLife: String,
    waterResistance: String,
    warranty: String,
    color: String,
  },
  aboutThisItem: [String],
});

module.exports = mongoose.model("watch", watchSchema);
