const TableLamp = require("../Models/lightAll");

// @desc    Get all table lamps
// @route   GET /api/tablelamps
// @access  Public
const getAllTableLamps = async (req, res) => {
  const search = req.query.search || "";

  try {
    const lamps = await TableLamp.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { features: { $regex: search, $options: "i" } }, // only if features is a string or array of strings
      ],
    });

    res.status(200).json(lamps);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getTableLampById = async (req, res) => {
  try {
    const lamp = await TableLamp.findById(req.params.id);
    if (!lamp) {
      return res.status(404).json({ message: "Table lamp not found" });
    }
    res.status(200).json(lamp);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Add a new table lamp
// @route   POST /api/tablelamps
// @access  Public (You can make it protected if needed)
const addTableLamp = async (req, res) => {
  try {
    const newLamp = new TableLamp(req.body);
    await newLamp.save();
    res.status(201).json(newLamp);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Update a table lamp
// @route   PUT /api/tablelamps/:id
// @access  Public
const updateTableLamp = async (req, res) => {
  try {
    const updatedLamp = await TableLamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedLamp) {
      return res.status(404).json({ message: "Table lamp not found" });
    }
    res.status(200).json(updatedLamp);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// @desc    Delete a table lamp
// @route   DELETE /api/tablelamps/:id
// @access  Public
const deleteTableLamp = async (req, res) => {
  try {
    const deletedLamp = await TableLamp.findByIdAndDelete(req.params.id);
    if (!deletedLamp) {
      return res.status(404).json({ message: "Table lamp not found" });
    }
    res.status(200).json({ message: "Table lamp deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};

module.exports = {
  getAllTableLamps,
  getTableLampById,
  addTableLamp,
  updateTableLamp,
  deleteTableLamp,
};
