const express = require('express');
const router = express.Router();
const {
      getAllEarbuds,
      getEarbudsById,
      addEarbuds,
      updateEarbuds,
} = require("../controllers/Earbuds");

router.get("/", getAllEarbuds); // Get all earbuds
router.get("/:id", getEarbudsById); // Get earbuds by ID
router.post("/", addEarbuds); // Add new earbuds
router.put("/:id", updateEarbuds); // Update earbuds by ID

module.exports = router; // Export the router for use in the main app