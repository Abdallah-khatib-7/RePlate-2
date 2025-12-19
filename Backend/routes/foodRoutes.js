// backend/routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');  // Make sure this line is EXACT
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/listings', foodController.getAvailableListings);
router.get('/listings/:id', foodController.getListingById);

// Protected routes
router.post('/listings', protect, foodController.createListing);
router.post('/listings/:foodId/claim', protect, foodController.claimFood);
router.delete('/listings/:id', protect, foodController.deleteListing);

module.exports = router;