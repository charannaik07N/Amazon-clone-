const express = require('express');
const router = express.Router();

const {
     getAllCases,
      getCaseById,
      addCase,
      updateCase,
} = require('../controllers/cases');

router.get('/', getAllCases); 
router.get('/:id', getCaseById);
router.post('/', addCase);
router.put('/:id', updateCase);
module.exports = router;
// This code defines the routes for handling cases in the application.
// It imports the necessary modules, sets up the router, and defines the routes for getting all cases, getting a case by ID, adding a new case, and updating a case by ID.
// Finally, it exports the router to be used in the main application file.          