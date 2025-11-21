const express = require('express');
const router = express.Router();

const {
    getAllCoolItems,
    getCoolItemById,
    addCoolItem,
    updateCoolItem,
} = require('../controllers/cool');

router.get('/', getAllCoolItems); // Get all cool items
router.get('/:id', getCoolItemById); // Get cool item by ID
router.post('/', addCoolItem); // Add new cool item
router.put('/:id', updateCoolItem); // Update cool item by ID

module.exports = router; // Export the router for use in the main app
// This code defines the routes for handling cool items in the application.