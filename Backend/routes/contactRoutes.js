// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.post('/submit', contactController.submitContact);

// Protected routes (admin only)
router.get('/messages', protect, contactController.getAllMessages);
router.put('/messages/:id/status', protect, contactController.updateMessageStatus);

module.exports = router;