const express = require('express');
const router = express.Router();
const {
      getAllCoolItems,
      getCoolItemById,
      addCoolItem,
      updateCoolItem,
} = require('../controllers/coolAll');

router.get('/', getAllCoolItems); // Get all cool item
router.get('/:id', getCoolItemById); // Get cool item by ID
router.post('/', addCoolItem); // Add new cool item
router.put('/:id', updateCoolItem); // Update cool item by ID

module.exports = router; // Export the router for use in the main app