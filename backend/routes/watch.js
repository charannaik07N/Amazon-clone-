const express = require("express");
const router = express.Router();
const {
  getAllWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch,
} = require("../controllers/watch");

router.get("/", getAllWatches);


router.get("/:id", getWatchById);


router.post("/", createWatch);

router.put("/:id", updateWatch);

router.delete("/:id", deleteWatch);

module.exports = router;
