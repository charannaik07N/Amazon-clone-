const mongoose = require("mongoose");

const jacketSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  colors: [
    {
      id: { type: String },
      value: { type: String }, // e.g. #000000
      name: { type: String },
    },
  ],
  sizes: [
    {
      size: { type: String }, // e.g. S, M, L
      price: { type: Number },
    },
  ],
});

const Jacket = mongoose.model("Jacketdetails", jacketSchema);

module.exports = Jacket;
