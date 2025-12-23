const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { protect } = require('../middleware/authMiddleware');

// Submit a review
router.post('/submit', protect, async (req, res) => {
  try {
    const { claim_id, food_id, rating, review_text, category_feedback, suggestions, anonymous } = req.body;
    const recipient_id = req.user.id;

    console.log('Review submission data:', {
      claim_id, food_id, rating, review_text, category_feedback, suggestions, anonymous
    });

    // Safe defaults for nullable fields - convert undefined to null
    const safeReviewText = review_text === undefined ? null : (review_text || null);
    const safeCategory = category_feedback === undefined ? null : (category_feedback || null);
    const safeSuggestions = suggestions === undefined ? null : (suggestions || null);
    const safeAnonymous = anonymous === undefined ? 1 : (anonymous ? 1 : 0);

    console.log('Safe values:', {
      safeReviewText, safeCategory, safeSuggestions, safeAnonymous
    });

    // Validate required fields
    if (!claim_id || !food_id || !rating) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields: claim_id, food_id, or rating' 
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Get restaurant_id from food listing
    const [food] = await pool.execute(
      'SELECT donor_id FROM food_listings WHERE id = ?',
      [food_id]
    );

    if (food.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Food not found' });
    }

    const restaurant_id = food[0].donor_id;
    console.log('Restaurant ID:', restaurant_id);

    // Check if review already exists
    const [existing] = await pool.execute(
      'SELECT id FROM food_reviews WHERE claim_id = ?',
      [claim_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Review already submitted for this claim' });
    }

    // Insert review with explicit null for undefined values
    const [result] = await pool.execute(
      `INSERT INTO food_reviews 
       (claim_id, recipient_id, food_id, restaurant_id, rating, review_text, category_feedback, suggestions, anonymous)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        claim_id,
        recipient_id,
        food_id,
        restaurant_id,
        rating,
        safeReviewText,  // This will be null if undefined
        safeCategory,    // This will be null if undefined
        safeSuggestions, // This will be null if undefined
        safeAnonymous
      ]
    );

    console.log('Review inserted successfully, ID:', result.insertId);

    // Update restaurant stats
    await updateRestaurantStats(restaurant_id);

    // Update claim to mark as reviewed
    try {
      await pool.execute(
        `UPDATE claims 
         SET reviewed = 1 
         WHERE id = ?`,
        [claim_id]
      );
      console.log('Claim marked as reviewed');
    } catch (error) {
      console.log('Note: reviewed column might not exist or there was an error updating it');
    }

    res.status(200).json({
      status: 'success',
      message: 'Review submitted successfully',
      review_id: result.insertId
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to submit review: ' + error.message,
      details: error.stack 
    });
  }
});

// Get reviews for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const [reviews] = await pool.execute(
      `SELECT fr.*, fl.title as food_title, 
              DATE_FORMAT(fr.created_at, '%Y-%m-%d %H:%i') as review_date,
              CASE 
                WHEN fr.anonymous = 1 THEN 'Anonymous User'
                ELSE u.full_name 
              END as reviewer_name
       FROM food_reviews fr
       JOIN food_listings fl ON fr.food_id = fl.id
       LEFT JOIN users u ON fr.recipient_id = u.id
       WHERE fr.restaurant_id = ?
       ORDER BY fr.created_at DESC
       LIMIT 20`,
      [restaurantId]
    );

    // Get restaurant stats
    const [stats] = await pool.execute(
      'SELECT * FROM restaurant_stats WHERE restaurant_id = ?',
      [restaurantId]
    );

    res.status(200).json({
      status: 'success',
      reviews: reviews,
      stats: stats[0] || null
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch reviews' });
  }
});

// Get user's reviews
router.get('/my-reviews', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [reviews] = await pool.execute(
      `SELECT fr.*, fl.title as food_title, fl.image_url, u.full_name as restaurant_name
       FROM food_reviews fr
       JOIN food_listings fl ON fr.food_id = fl.id
       JOIN users u ON fr.restaurant_id = u.id
       WHERE fr.recipient_id = ?
       ORDER BY fr.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      status: 'success',
      reviews: reviews
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch your reviews' });
  }
});

// Helper function to update restaurant stats
async function updateRestaurantStats(restaurantId) {
  try {
    const [stats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_stars,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_stars,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_stars,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_stars
       FROM food_reviews 
       WHERE restaurant_id = ?`,
      [restaurantId]
    );

    if (stats.length > 0) {
      const stat = stats[0];
      
      // Insert or update restaurant stats
      await pool.execute(
        `INSERT INTO restaurant_stats 
         (restaurant_id, total_reviews, average_rating, one_star, two_stars, three_stars, four_stars, five_stars)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         total_reviews = VALUES(total_reviews),
         average_rating = VALUES(average_rating),
         one_star = VALUES(one_star),
         two_stars = VALUES(two_stars),
         three_stars = VALUES(three_stars),
         four_stars = VALUES(four_stars),
         five_stars = VALUES(five_stars)`,
        [
          restaurantId,
          stat.total_reviews,
          parseFloat(stat.average_rating || 0).toFixed(2),
          stat.one_star,
          stat.two_stars,
          stat.three_stars,
          stat.four_stars,
          stat.five_stars
        ]
      );
    }
  } catch (error) {
    console.error('Update restaurant stats error:', error);
  }
}

module.exports = router;