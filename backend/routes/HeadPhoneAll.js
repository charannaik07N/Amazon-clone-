const express = require('express');
const router = express.Router();
const {
    getAllProducts, addProduct } = require('../controllers/HeadPhoneall');
    
    router.get('/', getAllProducts); // Get all headphones
    router.post('/', addProduct); // Add new headphone

module.exports = router; // Export the router for use in the main app