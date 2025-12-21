// backend/routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/listings', foodController.getAvailableListings);
router.get('/listings/:id', foodController.getListingById);
router.get('/debug-info', protect, foodController.debugInfo);

// Protected routes
router.post('/listings', protect, foodController.createListing);
router.post('/listings/:foodId/claim', protect, foodController.claimFood);
router.delete('/listings/:id', protect, foodController.deleteListing);
router.post('/reset-food-status', foodController.resetFoodStatus);

// Restaurant management routes
router.get('/my-listings', protect, foodController.getMyListings);
router.put('/listings/:id', protect, foodController.updateListing);

module.exports = router;