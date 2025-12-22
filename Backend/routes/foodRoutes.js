const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/listings', foodController.getAvailableListings);
router.get('/listings/:id', foodController.getListingById);

// Protected routes
router.post('/listings', protect, foodController.createListing);
router.put('/listings/:id', protect, foodController.updateListing);
router.delete('/listings/:id', protect, foodController.deleteListing);
router.get('/my-listings', protect, foodController.getMyListings);
router.post('/listings/:foodId/claim', protect, foodController.claimFood);
router.get('/my-claims', protect, foodController.getRestaurantClaims); // Get restaurant's claims
router.put('/claims/:claimId/status', protect, foodController.updateClaimStatus); // Update claim status
router.get('/user-claims', protect, foodController.getUserClaims); // Get user's own claims
router.get('/user-type', protect, foodController.checkUserType); // Check user type
router.get('/debug-info', protect, foodController.debugInfo); // Debug info
// Development only routes
router.post('/reset-status', foodController.resetFoodStatus);

module.exports = router;