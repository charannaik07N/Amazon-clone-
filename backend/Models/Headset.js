// Models/Headset.js (or Headphones.js)

const mongoose = require("mongoose");

const headphonesSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number },
  rating: { type: Number, default: 0 },
  connectivity: { type: String }, // e.g., Wired, Wireless
  features: [{ type: String }],
  image: { type: String },
});

// Create model named "Headset"
const HeadphonesProduct = mongoose.model("Headset", headphonesSchema);

// Export the model
module.exports = HeadphonesProduct;
