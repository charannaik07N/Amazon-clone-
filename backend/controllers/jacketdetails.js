// controllers/jacketController.js
const Jacket = require("../Models/Jacketdetails");

/** ------------------------------------------------------------------
 * @desc    Get ONE jacket by Mongo _id
 * @route   GET /api/jackets/:id
 * ------------------------------------------------------------------ */
const getProduct = async (req, res) => {
  try {
    const jacket = await Jacket.findById(req.params.id);
    if (!jacket) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(jacket);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

/** ------------------------------------------------------------------
 * @desc    (Optional) Get ALL jackets, with ?search= query
 * @route   GET /api/jackets
 * ------------------------------------------------------------------ */
const getAllProducts = async (req, res) => {
  const search = req.query.search || "";
  try {
    const jackets = await Jacket.find({
      name: { $regex: search, $options: "i" }, // case‑insensitive search on name
    });
    res.json(jackets);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

/** ------------------------------------------------------------------
 * @desc    Add a new jacket
 * @route   POST /api/jackets
 * ------------------------------------------------------------------ */
const addProduct = async (req, res) => {
  try {
    const newJacket = new Jacket(req.body);
    await newJacket.save();
    res.status(201).json(newJacket);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

/** ------------------------------------------------------------------
 * @desc    Update an existing jacket
 * @route   PUT /api/jackets/:id
 * ------------------------------------------------------------------ */
const updateProduct = async (req, res) => {
  try {
    const updated = await Jacket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return the updated doc & validate
    );
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

module.exports = {
  getProduct,
  getAllProducts, // remove if you truly only want single‑item fetches
  addProduct,
  updateProduct,
};
