const express = require("express");
const router = express.Router();
const {
  getAllPowerBanks,
  getPowerBankById,
  addPowerBank,
  updatePowerBank,
  deletePowerBank,
} = require("../controllers/PowerBank");

router.get("/", getAllPowerBanks);

router.get("/:id", getPowerBankById);

router.post("/", addPowerBank);
router.put("/:id", updatePowerBank);

router.delete("/:id", deletePowerBank);

module.exports = router;
