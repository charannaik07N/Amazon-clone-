const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, 
  name: { type: String, required: true }, 
  description: { type: String, required: true }, 
  rating: { type: Number, default: 0 }, 
  images: { type: [String], required: true }, 

  colors: [
    {
      id: { type: String, required: true }, 
      value: { type: String, required: true },
      name: { type: String, required: true }, 
    },
  ],

  sizes: [
    {
      size: { type: String, required: true }, 
      price: { type: Number, required: true }, 
    },
  ],

  brand: { type: String, required: true }, 

  qunatity: { type: Number, default: 100 },

});

module.exports = mongoose.model("ShoeProduct", shoeSchema);
