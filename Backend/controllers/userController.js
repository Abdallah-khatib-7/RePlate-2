const User = require('../models/userModel');
const Food = require('../models/foodModel');
const Claim = require('../models/claimModel');

const userController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      res.json({
        status: 'success',
        user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get profile'
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { full_name, phone, address } = req.body;
      
      await User.updateProfile(req.user.id, {
        full_name,
        phone,
        address
      });

      const updatedUser = await User.findById(req.user.id);

      res.json({
        status: 'success',
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update profile'
      });
    }
  },

  // Get user's food listings
  getMyListings: async (req, res) => {
    try {
      const listings = await Food.findByDonor(req.user.id);

      res.json({
        status: 'success',
        count: listings.length,
        listings
      });
    } catch (error) {
      console.error('Get my listings error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch listings'
      });
    }
  },

  // Get user's claims
  getMyClaims: async (req, res) => {
    try {
      const claims = await Claim.findByRecipient(req.user.id);

      res.json({
        status: 'success',
        count: claims.length,
        claims
      });
    } catch (error) {
      console.error('Get my claims error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch claims'
      });
    }
  }
};

module.exports = userController;