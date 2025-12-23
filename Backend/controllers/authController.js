
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authController = {
  
  register: async (req, res) => {
    console.log('=== REGISTRATION START ===');
    
    try {
      const { email, password, full_name, phone, address, user_type } = req.body;
      console.log('📦 Request data:', { email, full_name, user_type });

      
      if (!email || !password || !full_name) {
        return res.status(400).json({
          status: 'error',
          message: 'Email, password, and full name are required'
        });
      }

      
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const userId = await User.create({
        email,
        password: hashedPassword,
        full_name,
        phone: phone || null,
        address: address || null,
        user_type: user_type || 'recipient'
      });

      console.log('✅ User created with ID:', userId);

      
      const newUser = await User.findByEmail(email);
      
      
      const token = jwt.sign(
        { 
          id: userId, 
          email,
          user_type: user_type || 'recipient',
          is_admin: newUser.is_admin || false
        },
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
          user_type: user_type || 'recipient',
          is_admin: newUser.is_admin || false,
          admin_role: newUser.admin_role || null
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

  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('🔐 Login attempt for:', email);

      
      const user = await User.findByEmail(email);
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      console.log('✅ Login successful for:', email);
      console.log('📋 User data:', {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        is_admin: user.is_admin,
        admin_role: user.admin_role
      });

      
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          user_type: user.user_type,
          is_admin: user.is_admin || false
        },
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
          user_type: user.user_type,
          is_admin: user.is_admin || user.user_type === 'admin' || false,
          admin_role: user.admin_role || null
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

  
  getCurrentUser: async (req, res) => {
    try {
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
      }

      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        status: 'success',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get user information'
      });
    }
  },

  
  googleAuth: async (req, res) => {
    try {
      const { email, name, googleId } = req.body;
      console.log('🌐 Google auth attempt for:', email);

      
      let user = await User.findByGoogleId(googleId);

      if (!user) {
        
        user = await User.findByEmail(email);
        
        if (user) {
          
          await User.updateProfile(user.id, { google_id: googleId });
        } else {
          
          const userId = await User.create({
            email,
            full_name: name,
            google_id: googleId,
            email_verified: true
          });
          
          user = await User.findById(userId);
        }
      }

      console.log('✅ Google auth successful for:', email);
      console.log('📋 User data:', {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        is_admin: user.is_admin,
        admin_role: user.admin_role
      });

      
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          user_type: user.user_type,
          is_admin: user.is_admin || false
        },
        process.env.JWT_SECRET || 'test-secret-123',
        { expiresIn: '7d' }
      );

      res.json({
        status: 'success',
        message: 'Google authentication successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type,
          is_admin: user.is_admin || user.user_type === 'admin' || false,
          admin_role: user.admin_role || null
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

      
      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.json({
        status: 'success',
        message: 'Password reset instructions sent to email',
        resetToken 
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to process request'
      });
    }
  },

  
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      
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