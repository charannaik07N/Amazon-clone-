const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./Models/CaseDetails");
const express = require("express");
const cors = require("cors");

// Data imports
const jacket = require("./Data/jacket");
const cases = require("./Data/cases");
const Student = require("./Data/Student");
const Shoes = require("./Data/Shoes");
const Earbuds = require("./Data/Earbuds");
const CaseDetails = require("./Data/CaseDetails");
const Monitors = require("./Data/Monitors");
const Headset = require("./Data/Headset");
const AllShoe = require("./Data/AllShoe");
const jacketdetails = require("./Data/Jacketdetails");
const Earbudsdetails = require("./Data/Earbudsdetails");
const MonitorDetails = require("./Data/MonitorDetails");
const headsetAll = require("./Data/headsetAll");
const watch = require("./Data/watch");
const cycle = require("./Data/cycle");
const powerbanks = require("./Data/powerbanks");
const tablestands = require("./Data/tablestand");
const cool = require("./Data/cool");
const lights = require("./Data/lights");
const Tshirt = require("./Data/Tshirt");
const watchAll = require("./Data/watchAll");
const power = require("./Data/power");
const lightdetails = require("./Data/lightdetails");
const TshirtAll = require("./Data/TshirtAll");
const table = require("./Data/table");
const coolAll = require("./Data/coolAll");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import and use cart routes
const cartRoutes = require("./cartRoutes");
app.use("/api/cart", cartRoutes);

// Product data
const products = {
  cases,
  jacket,
  Student,
  Shoes,
  Earbuds,
  Monitors,
  CaseDetails,
  Headset,
  AllShoe,
  jacketdetails,
  Earbudsdetails,
  MonitorDetails,
  headsetAll,
  watch,
  cycle,
  powerbanks,
  tablestands,
  cool,
  lights,
  Tshirt,
  watchAll,
  power,
  lightdetails,
  TshirtAll,
  table,
  coolAll,
};

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "API is running!",
    availableRoutes: [
      "/cases",
      "/jacket",
      "/Student",
      "/Shoes",
      "/Earbuds",
      "/Monitors",
      "/CaseDetails",
      "/Headset",
      "/AllShoe",
      "/jacketdetails",
      "/Earbudsdetails",
      "/MonitorDetails",
      "/headsetAll",
      "/watch",
      "/cycle",
      "/powerbanks",
      "/tablestands",
      "/cool",
      "/lights",
      "/Tshirt",
      "/watchAll",
      "/power",
      "/lightdetails",
      "/TshirtAll",
      "/table",
      "/coolAll",
      "/api/cart",
    ],
  });
});

// Get all products of a type
app.get("/:productType", (req, res) => {
  const { productType } = req.params;
  const productData = products[productType];

  if (!productData || productData.length === 0) {
    return res.status(404).json({ message: `No ${productType} available` });
  }

  res.json(productData);
});

// Get product by ID
app.get("/api/:productType/:id", (req, res) => {
  const { productType, id } = req.params;
  const productData = products[productType];

  if (!productData || productData.length === 0) {
    return res.status(404).json({ message: `No ${productType} available` });
  }

  // Try both string and number id matching for flexibility
  const product = productData.find((item) => item.id == id || item._id == id);

  if (!product) {
    return res
      .status(404)
      .json({ message: `${productType} with ID ${id} not found` });
  }

  res.json(product);
});

// Add a product (POST)
app.post("/api/:productType", async (req, res) => {
  const product = req.body;

  if (
    !product.name ||
    !product.originalPrice ||
    !product.discountedPrice ||
    !product.images ||
    !product.colors
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const newProduct = new Product(product);
    await newProduct.save();
    res.status(201).json({ data: newProduct });
  } catch (error) {
    console.error("Error saving product:", error.message);
    res.status(500).json({ message: "Failed to save product" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
