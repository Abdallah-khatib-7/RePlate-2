// backend/controllers/foodController.js - SIMPLIFIED VERSION
const foodController = {
  getAvailableListings: async (req, res) => {
    try {
      res.json({
        status: 'success',
        message: 'Food controller is working',
        listings: []
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Server error'
      });
    }
  },

  getListingById: async (req, res) => {
    res.json({
      status: 'success',
      message: 'Get by ID working',
      id: req.params.id
    });
  },

  createListing: async (req, res) => {
    res.status(201).json({
      status: 'success',
      message: 'Create listing endpoint'
    });
  },

  claimFood: async (req, res) => {
    res.json({
      status: 'success',
      message: 'Claim food endpoint'
    });
  },

  deleteListing: async (req, res) => {
    res.json({
      status: 'success',
      message: 'Delete endpoint'
    });
  }
};

module.exports = foodController;