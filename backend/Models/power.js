const mongoose = require("mongoose");

const powerBankSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  capacity: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discount: { type: Number },
  rating: { type: Number, default: 0 },
  images: [{ type: String }],
  fastCharging: { type: String },
  warranty: { type: String },
  description: { type: String },

  specifications: {
    batteryType: { type: String },
    capacity: { type: String },
    outputPower: { type: String },
    inputPort: { type: String },
    outputPort: { type: String },
    bodyMaterial: { type: String },
    weight: { type: String },
    dimensions: { type: String },
    color: { type: String },
  },

  inputOutput: {
    input: {
      "Type-C": { type: String },
      "Micro USB": { type: String },
    },
    output: {
      "USB-A 1": { type: String },
      "USB-A 2": { type: String },
      "Type-C": { type: String },
    },
  },

  protection: [{ type: String }],
  keyFeatures: [{ type: String }],
  tags: [{ type: String }],
});

const PowerBankProduct = mongoose.model("power", powerBankSchema);

module.exports = PowerBankProduct;
