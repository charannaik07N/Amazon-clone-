const express = require("express");
const router = express.Router();
const {
  getAllMonitors,
  getMonitorById,
  addMonitor,
  updateMonitor,
} = require("../controllers/Monitor");
router.get("/", getAllMonitors);
router.get("/:id", getMonitorById);
router.post("/", addMonitor);

router.put("/:id", updateMonitor);

module.exports = router;
