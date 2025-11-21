const Monitor = require("../Models/Monitors");

// @desc    Get all monitors or search by keyword
const getAllMonitors = async (req, res) => {
  try {
    const { keyword } = req.query;
    const query = keyword ? { name: { $regex: keyword, $options: "i" } } : {};
    const monitors = await Monitor.find(query);
    res.json(monitors);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Get a monitor by ID
const getMonitorById = async (req, res) => {
  try {
    const monitor = await Monitor.findById(req.params.id);
    if (!monitor) {
      return res.status(404).json({ error: "Monitor not found" });
    }
    res.json(monitor);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// @desc    Add a new monitor
const addMonitor = async (req, res) => {
  try {
    const newMonitor = new Monitor(req.body);
    await newMonitor.save();
    res.status(201).json(newMonitor);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};
// @desc    Update a monitor
const updateMonitor = async (req, res) => {
  try {
    const updatedMonitor = await Monitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMonitor) {
      return res.status(404).json({ error: "Monitor not found" });
    }
    res.json(updatedMonitor);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
};

module.exports = {
  getAllMonitors,
  getMonitorById,
  addMonitor,
    updateMonitor,
};