const mongoose = require("mongoose");

const StandSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    material: { type: String },
    image: { type: String },
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
    features: [String],
    keyFeatures: [String],
    specifications: {
      brand: String,
      model: String,
      material: String,
      weightCapacity: String,
      dimensions: String,
      assembly: String,
      warranty: String,
      madeIn: String,
    },
    aboutThisItem: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("table", StandSchema);
