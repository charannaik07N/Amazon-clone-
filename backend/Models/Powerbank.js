// models/PowerBank.js
const mongoose = require("mongoose");

const powerBankSchema = new mongoose.Schema({
  brand: String,
  name: String,
  capacity: String,
  originalPrice: Number,
  discountedPrice: Number,
  discount: Number,
  rating: Number,
  image: String,
  images: {
    main: String,
    gallery: [String],
  },
  fastCharging: String,
  warranty: String,
  description: String,
  specifications: Object,
  inputOutput: Object,
  protection: [String],
  keyFeatures: [String],
  tags: [String],
});

module.exports = mongoose.model("Powerbank", powerBankSchema);
