const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Test route
router.get('/test', dashboardController.test);

// Get active reservations
router.get('/active-reservations', dashboardController.getActiveReservations);

// Get pickup history
router.get('/pickup-history', dashboardController.getPickupHistory);

// Get dashboard stats
router.get('/stats', dashboardController.getDashboardStats);

// Cancel reservation
router.post('/cancel-reservation/:reservationId', dashboardController.cancelReservation);

// Mark pickup as completed
router.post('/complete-pickup/:claimId', dashboardController.completePickup);

module.exports = router;