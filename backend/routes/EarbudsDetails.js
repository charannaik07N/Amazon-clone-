const express = require('express');
const router = express.Router();
const {  getAllEarbudsDetails,
  getEarbudsDetailsById,
  addEarbudsDetails,
  updateEarbudsDetails,
  deleteEarbudsDetails, 
} = require('../controllers/Earbudsdetails');

router.get('/', getAllEarbudsDetails); // Get all earbuds details
router.get('/:id', getEarbudsDetailsById); // Get earbuds details by ID
router.post('/', addEarbudsDetails); // Add new earbuds details
router.put('/:id', updateEarbudsDetails); // Update earbuds details by ID
router.delete('/:id', deleteEarbudsDetails); // Delete earbuds details by ID
module.exports = router; // Export the router for use in the main app