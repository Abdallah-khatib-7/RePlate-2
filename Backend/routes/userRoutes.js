const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes - require authentication
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.get('/my-listings', protect, userController.getMyListings);
router.get('/my-claims', protect, userController.getMyClaims);

module.exports = router;