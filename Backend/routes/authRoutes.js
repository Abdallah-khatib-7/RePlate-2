const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected route
router.get('/me', (req, res) => {
  res.json({
    status: 'success',
    message: 'Auth endpoint working'
  });
});

module.exports = router;