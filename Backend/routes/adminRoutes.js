const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All routes require admin authentication
router.use(protect, isAdmin);

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total users
    const [users] = await pool.execute('SELECT COUNT(*) as total FROM users');
    const [donors] = await pool.execute('SELECT COUNT(*) as total FROM users WHERE user_type = "donor"');
    const [recipients] = await pool.execute('SELECT COUNT(*) as total FROM users WHERE user_type = "recipient"');
    
    // Get food listings
    const [foodListings] = await pool.execute('SELECT COUNT(*) as total FROM food_listings');
    
    // Get claims
    const [claims] = await pool.execute('SELECT COUNT(*) as total FROM claims');
    const [completedClaims] = await pool.execute('SELECT COUNT(*) as total FROM claims WHERE status = "completed"');
    
    // Get revenue (sum of all food prices that were claimed)
    const [revenue] = await pool.execute(`
      SELECT SUM(fl.price) as total 
      FROM claims c 
      JOIN food_listings fl ON c.food_id = fl.id 
      WHERE c.status = "completed"
    `);
    
    // Environmental impact (estimated)
    const foodSaved = completedClaims[0].total * 2.5; // 2.5kg per claim
    const co2Saved = completedClaims[0].total * 1.2; // 1.2kg CO2 per claim

    res.status(200).json({
      status: 'success',
      stats: {
        totalUsers: users[0].total,
        totalDonors: donors[0].total,
        totalRecipients: recipients[0].total,
        totalFoodListings: foodListings[0].total,
        totalClaims: claims[0].total,
        totalCompletedClaims: completedClaims[0].total,
        totalRevenue: revenue[0].total || 0,
        foodSaved: foodSaved,
        co2Saved: co2Saved
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch statistics' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT id, email, full_name, phone, address, user_type, 
             is_admin, admin_role, email_verified, created_at
      FROM users 
      ORDER BY created_at DESC
    `);
    
    res.status(200).json({
      status: 'success',
      users: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent deleting yourself
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Cannot delete your own account' 
      });
    }
    
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete user' });
  }
});

// Toggle user status
router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    // In a real implementation, you might have a status column
    // For now, we'll just update a hypothetical status field
    await pool.execute(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, userId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'User status updated successfully'
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update user status' });
  }
});

// Get all food listings
router.get('/food-listings', async (req, res) => {
  try {
    const [listings] = await pool.execute(`
      SELECT fl.*, u.full_name as donor_name, u.email as donor_email
      FROM food_listings fl
      JOIN users u ON fl.donor_id = u.id
      ORDER BY fl.created_at DESC
    `);
    
    res.status(200).json({
      status: 'success',
      listings: listings
    });
  } catch (error) {
    console.error('Get food listings error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch food listings' });
  }
});

// Delete food listing
router.delete('/food-listings/:id', async (req, res) => {
  try {
    const foodId = req.params.id;
    
    await pool.execute('DELETE FROM food_listings WHERE id = ?', [foodId]);
    
    res.status(200).json({
      status: 'success',
      message: 'Food listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete food listing error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete food listing' });
  }
});

// Get all claims
router.get('/claims', async (req, res) => {
  try {
    const [claims] = await pool.execute(`
      SELECT c.*, fl.title as food_title, fl.price,
             u.full_name as recipient_name, u.email as recipient_email,
             d.full_name as donor_name
      FROM claims c
      JOIN food_listings fl ON c.food_id = fl.id
      JOIN users u ON c.recipient_id = u.id
      JOIN users d ON fl.donor_id = d.id
      ORDER BY c.claimed_at DESC
    `);
    
    res.status(200).json({
      status: 'success',
      claims: claims
    });
  } catch (error) {
    console.error('Get claims error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch claims' });
  }
});

// Update claim status
router.put('/claims/:id/status', async (req, res) => {
  try {
    const claimId = req.params.id;
    const { status } = req.body;
    
    await pool.execute(
      'UPDATE claims SET status = ? WHERE id = ?',
      [status, claimId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Claim status updated successfully'
    });
  } catch (error) {
    console.error('Update claim status error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update claim status' });
  }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT fr.*, fl.title as food_title, 
             r.full_name as restaurant_name,
             CASE 
               WHEN fr.anonymous = 1 THEN 'Anonymous User'
               ELSE u.full_name 
             END as reviewer_name
      FROM food_reviews fr
      JOIN food_listings fl ON fr.food_id = fl.id
      JOIN users r ON fr.restaurant_id = r.id
      LEFT JOIN users u ON fr.recipient_id = u.id
      ORDER BY fr.created_at DESC
    `);
    
    res.status(200).json({
      status: 'success',
      reviews: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch reviews' });
  }
});

// Delete review
router.delete('/reviews/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    await pool.execute('DELETE FROM food_reviews WHERE id = ?', [reviewId]);
    
    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete review' });
  }
});

module.exports = router;