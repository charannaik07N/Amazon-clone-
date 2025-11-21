const mongoose = require("mongoose");

const TshirtSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    brand: String,
    type: {
      type: String,
      default: "T-Shirt",
    },
    originalPrice: Number,
    discountedPrice: Number,
    discount: Number,
    rating: Number,
    image: String,
    fabric: String,
    material: String,
    fit: String,
    sleeve: String,
    neckline: String,
    colorOptions: [
      {
        id: String,
        name: String,
      },
    ],
    sizeOptions: [
      {
        size: String,
        chest: String,
      },
    ],
    images: [String],
    keyFeatures: [String],
    specifications: {
      brand: String,
      model: String,
      fabric: String,
      fit: String,
      sleeve: String,
      care: String,
      madeIn: String,
      warranty: String,
      gender: String,
    },
    aboutThisItem: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TshirtAll", TshirtSchema);
