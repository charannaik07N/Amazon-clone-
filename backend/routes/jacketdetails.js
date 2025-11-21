const express = require('express');
const router = express.Router();
const {
      getProduct,
      getAllProducts, // remove if you truly only want single‑item fetches
      addProduct,
      updateProduct,
}=require("../controllers/jacketdetails");

router.get("/",getProduct);
router.get("/all",getAllProducts);
router.post("/",addProduct);
router.put("/id",updateProduct);

module.exports = router;