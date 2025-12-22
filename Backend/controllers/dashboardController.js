const pool = require('../config/database');

const dashboardController = {
  // Get active reservations for user
  getActiveReservations: async (req, res) => {
    try {
      const userId = req.user.id;
      
      console.log('Fetching active reservations for user:', userId);
      
      // Get all claims with status 'pending' or 'confirmed'
      const [claims] = await pool.execute(`
        SELECT 
          c.id, c.status, c.claimed_at, c.notes,
          fl.id AS food_id, fl.title AS food_title, fl.price, fl.pickup_time, 
          fl.address, fl.city, fl.image_url, fl.quantity,
          u.full_name AS restaurant_name, u.email AS restaurant_email
        FROM claims c
        JOIN food_listings fl ON c.food_id = fl.id
        JOIN users u ON fl.donor_id = u.id
        WHERE c.recipient_id = ? 
        AND c.status IN ('pending', 'confirmed')
        ORDER BY fl.pickup_time ASC
      `, [userId]);

      console.log('Active reservations found:', claims.length);

      // Generate pickup codes for display
      const reservations = claims.map(claim => ({
        ...claim,
        pickup_code: `RP-${claim.id.toString().padStart(6, '0')}`,
        pickup_status: claim.status
      }));

      res.json({
        status: 'success',
        reservations: reservations
      });
    } catch (error) {
      console.error('Get active reservations error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch active reservations: ' + error.message
      });
    }
  },

  // Get pickup history for user
  getPickupHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      
      console.log('Fetching pickup history for user:', userId);
      
      // First, let's get completed claims
      const [history] = await pool.execute(`
        SELECT 
          c.id, c.claimed_at, c.status,
          fl.title AS food_title, fl.quantity, fl.price,
          u.full_name AS restaurant_name, fl.city
        FROM claims c
        JOIN food_listings fl ON c.food_id = fl.id
        JOIN users u ON fl.donor_id = u.id
        WHERE c.recipient_id = ? 
        AND c.status = 'completed'
        ORDER BY c.claimed_at DESC
        LIMIT 10
      `, [userId]);

      console.log('Pickup history found:', history.length);

      // Format the history with additional info
      const formattedHistory = history.map(item => ({
        ...item,
        amount: item.price,
        original_price: item.price,
        payment_method: 'cash',
        payment_status: 'completed',
        pickup_time: item.claimed_at,
        actual_pickup_time: item.claimed_at,
        status: 'completed',
        reviewed: false
      }));

      res.json({
        status: 'success',
        history: formattedHistory
      });
    } catch (error) {
      console.error('Get pickup history error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch pickup history: ' + error.message
      });
    }
  },

  // Get dashboard stats
  getDashboardStats: async (req, res) => {
    try {
      const userId = req.user.id;
      
      console.log('Fetching dashboard stats for user:', userId);
      
      // Get total spent (sum of all completed claims)
      const [totalSpentResult] = await pool.execute(`
        SELECT SUM(fl.price) as total_spent
        FROM claims c
        JOIN food_listings fl ON c.food_id = fl.id
        WHERE c.recipient_id = ? AND c.status = 'completed'
      `, [userId]);

      const totalSpent = totalSpentResult[0]?.total_spent || 0;

      // Get meals saved (total quantity of completed claims)
      const [mealsSavedResult] = await pool.execute(`
        SELECT SUM(fl.quantity) as meals_saved
        FROM claims c
        JOIN food_listings fl ON c.food_id = fl.id
        WHERE c.recipient_id = ? AND c.status = 'completed'
      `, [userId]);

      const mealsSaved = mealsSavedResult[0]?.meals_saved || 0;

      // Calculate money saved (assuming 35% discount)
      const moneySaved = totalSpent * 0.35;

      // Calculate CO2 saved (approximately 0.5kg per meal)
      const co2Saved = mealsSaved * 0.5;

      // Get active reservations count
      const [activeReservationsResult] = await pool.execute(`
        SELECT COUNT(*) as active_count
        FROM claims
        WHERE recipient_id = ? AND status IN ('pending', 'confirmed')
      `, [userId]);

      const activeReservations = activeReservationsResult[0]?.active_count || 0;

      // Get completed pickups count
      const [completedPickupsResult] = await pool.execute(`
        SELECT COUNT(*) as completed_count
        FROM claims
        WHERE recipient_id = ? AND status = 'completed'
      `, [userId]);

      const completedPickups = completedPickupsResult[0]?.completed_count || 0;

      const stats = {
        totalSpent: parseFloat(totalSpent),
        mealsSaved: parseInt(mealsSaved),
        moneySaved: parseFloat(moneySaved.toFixed(2)),
        co2Saved: parseFloat(co2Saved.toFixed(2)),
        activeReservations: parseInt(activeReservations),
        completedPickups: parseInt(completedPickups)
      };

      console.log('Dashboard stats:', stats);

      res.json({
        status: 'success',
        stats: stats
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch dashboard stats: ' + error.message
      });
    }
  },

  // Cancel reservation
  cancelReservation: async (req, res) => {
    try {
      const { reservationId } = req.params;
      const { reason, food_id } = req.body;
      const userId = req.user.id;

      console.log('Cancelling reservation:', { reservationId, userId, reason, food_id });

      // Verify the reservation belongs to the user
      const [claim] = await pool.execute(
        'SELECT * FROM claims WHERE id = ? AND recipient_id = ?',
        [reservationId, userId]
      );

      if (claim.length === 0) {
        console.log('Reservation not found or unauthorized');
        return res.status(404).json({
          status: 'error',
          message: 'Reservation not found or unauthorized'
        });
      }

      // Update claim status
      await pool.execute(
        'UPDATE claims SET status = "cancelled" WHERE id = ?',
        [reservationId]
      );

      // Update food listing status back to available
      await pool.execute(
        'UPDATE food_listings SET status = "available" WHERE id = ?',
        [food_id]
      );

      console.log('Reservation cancelled successfully');

      res.json({
        status: 'success',
        message: 'Reservation cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel reservation error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to cancel reservation: ' + error.message
      });
    }
  },

  // Mark claim as completed (pickup completed)
  completePickup: async (req, res) => {
    try {
      const { claimId } = req.params;
      const userId = req.user.id;

      console.log('Completing pickup for claim:', claimId);

      // Verify the claim belongs to the user
      const [claim] = await pool.execute(
        'SELECT * FROM claims WHERE id = ? AND recipient_id = ?',
        [claimId, userId]
      );

      if (claim.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Claim not found or unauthorized'
        });
      }

      // Update claim status to completed
      await pool.execute(
        'UPDATE claims SET status = "completed" WHERE id = ?',
        [claimId]
      );

      console.log('Pickup marked as completed');

      res.json({
        status: 'success',
        message: 'Pickup marked as completed'
      });
    } catch (error) {
      console.error('Complete pickup error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to complete pickup: ' + error.message
      });
    }
  },

  // Quick test endpoint
  test: async (req, res) => {
    try {
      console.log('Dashboard test endpoint called');
      res.json({
        status: 'success',
        message: 'Dashboard API is working',
        user: req.user
      });
    } catch (error) {
      console.error('Test error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Test failed'
      });
    }
  }
};

module.exports = dashboardController;