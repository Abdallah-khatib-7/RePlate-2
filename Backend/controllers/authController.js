// backend/controllers/authController.js - SIMPLIFIED VERSION
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authController = {
  // Register new user - SIMPLIFIED
  register: async (req, res) => {
    console.log('=== REGISTRATION START ===');
    
    try {
      const { email, password, full_name, phone, address, user_type } = req.body;
      console.log('📦 Request data:', { email, full_name, user_type });

      // Basic validation
      if (!email || !password || !full_name) {
        return res.status(400).json({
          status: 'error',
          message: 'Email, password, and full name are required'
        });
      }

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userId = await User.create({
        email,
        password: hashedPassword,
        full_name,
        phone: phone || null,
        address: address || null,
        user_type: user_type || 'recipient'
      });

      console.log('✅ User created with ID:', userId);

      // Generate token
      const token = jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET || 'test-secret-123',
        { expiresIn: '7d' }
      );

      console.log('=== REGISTRATION SUCCESS ===');
      
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        token,
        user: {
          id: userId,
          email,
          full_name,
          user_type: user_type || 'recipient'
        }
      });

    } catch (error) {
      console.error('=== REGISTRATION FAILED ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      
      res.status(500).json({
        status: 'error',
        message: 'Registration failed: ' + error.message
      });
    }
  },

  // Keep login function as is
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'test-secret-123',
        { expiresIn: '7d' }
      );

      res.json({
        status: 'success',
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Login failed'
      });
    }
  },

  // Google login/register
  googleAuth: async (req, res) => {
    try {
      const { email, name, googleId } = req.body;

      // Check if user exists by googleId
      let user = await User.findByGoogleId(googleId);

      if (!user) {
        // Check if user exists by email
        user = await User.findByEmail(email);
        
        if (user) {
          // Update existing user with googleId
          await User.updateProfile(user.id, { google_id: googleId });
        } else {
          // Create new user
          const userId = await User.create({
            email,
            full_name: name,
            google_id: googleId,
            email_verified: true
          });
          
          user = await User.findById(userId);
        }
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        status: 'success',
        message: 'Google authentication successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type
        }
      });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Google authentication failed'
      });
    }
  },

  // Forgot password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // In a real app, send email here
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.json({
        status: 'success',
        message: 'Password reset instructions sent to email',
        resetToken // For testing only
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to process request'
      });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await User.updatePassword(decoded.id, hashedPassword);

      res.json({
        status: 'success',
        message: 'Password reset successful'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to reset password'
      });
    }
  }
};

module.exports = authController;