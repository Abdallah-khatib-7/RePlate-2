const { pool } = require('../config/database');


const dashboardController = {
  
  getActiveReservations: async (req, res) => {
    try {
      const userId = req.user.id;
      
      console.log('Fetching active reservations for user:', userId);
      
      
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

  
  getPickupHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      
      console.log('Fetching pickup history for user:', userId);
      
      
      const [history] = await pool.execute(`
  SELECT 
    c.id AS claim_id,
    c.food_id,                    -- ✅ THIS IS THE FIX
    c.claimed_at,
    c.status,
    fl.title AS food_title,
    fl.quantity,
    fl.price,
    fl.city,
    u.full_name AS restaurant_name
  FROM claims c
  JOIN food_listings fl ON c.food_id = fl.id
  JOIN users u ON fl.donor_id = u.id
  WHERE c.recipient_id = ? 
  AND c.status = 'completed'
  ORDER BY c.claimed_at DESC
  LIMIT 10
`, [userId]);


      console.log('Pickup history found:', history.length);

      
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

  
  getDashboardStats: async (req, res) => {
    try {
      const userId = req.user.id;
      
      console.log('Fetching dashboard stats for user:', userId);
      
      
      const [totalSpentResult] = await pool.execute(`
        SELECT SUM(fl.price) as total_spent
        FROM claims c
        JOIN food_listings fl ON c.food_id = fl.id
        WHERE c.recipient_id = ? AND c.status = 'completed'
      `, [userId]);

      const totalSpent = totalSpentResult[0]?.total_spent || 0;

      
      const [mealsSavedResult] = await pool.execute(`
        SELECT SUM(fl.quantity) as meals_saved
        FROM claims c
        JOIN food_listings fl ON c.food_id = fl.id
        WHERE c.recipient_id = ? AND c.status = 'completed'
      `, [userId]);

      const mealsSaved = mealsSavedResult[0]?.meals_saved || 0;

      
      const moneySaved = totalSpent * 0.35;

      
      const co2Saved = mealsSaved * 0.5;

      
      const [activeReservationsResult] = await pool.execute(`
        SELECT COUNT(*) as active_count
        FROM claims
        WHERE recipient_id = ? AND status IN ('pending', 'confirmed')
      `, [userId]);

      const activeReservations = activeReservationsResult[0]?.active_count || 0;

      
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

  
  cancelReservation: async (req, res) => {
    try {
      const { reservationId } = req.params;
      const { reason, food_id } = req.body;
      const userId = req.user.id;

      console.log('Cancelling reservation:', { reservationId, userId, reason, food_id });

      
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

      
      await pool.execute(
        'UPDATE claims SET status = "cancelled" WHERE id = ?',
        [reservationId]
      );

      
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

  
  completePickup: async (req, res) => {
    try {
      const { claimId } = req.params;
      const userId = req.user.id;

      console.log('Completing pickup for claim:', claimId);

      
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