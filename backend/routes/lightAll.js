const express = require('express');
const router = express.Router();
const {
    getAllTableLamps,
    getTableLampById,
    addTableLamp,
    updateTableLamp,
    deleteTableLamp,
}=require("../controllers/lightAll");

router.get("/",getAllTableLamps);
router.get("/:id",getTableLampById);
router.post("/",addTableLamp);
router.delete("/:id",deleteTableLamp);
router.put("/",updateTableLamp);

module.exports=router;