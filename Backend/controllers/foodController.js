// backend/controllers/foodController.js - UPDATED
const pool = require('../config/database');

const foodController = {
  // Get food listings (with status filter)
  getAvailableListings: async (req, res) => {
    try {
      const { city, type, sort = 'newest', price_min, price_max, status = 'available' } = req.query;
      
      let query = `
        SELECT f.*, u.full_name as donor_name, u.email as donor_email,
               (SELECT COUNT(*) FROM claims WHERE food_id = f.id) as claim_count
        FROM food_listings f
        JOIN users u ON f.donor_id = u.id
        WHERE 1=1
      `;
      const params = [];
      
      // Apply status filter
      if (status === 'available') {
        query += " AND f.status = 'available'";
      } else if (status === 'all') {
        // Show all statuses
      } else {
        query += ' AND f.status = ?';
        params.push(status);
      }
      
      // Apply city filter if provided
      if (city) {
        query += ' AND f.city = ?';
        params.push(city);
      }
      
      // Apply type filter if provided
      if (type) {
        query += ' AND f.type = ?';
        params.push(type);
      }
      
      // Apply price filters if provided
      if (price_min) {
        query += ' AND f.price >= ?';
        params.push(parseFloat(price_min));
      }
      
      if (price_max) {
        query += ' AND f.price <= ?';
        params.push(parseFloat(price_max));
      }
      
      // Apply sorting
      if (sort === 'newest') {
        query += ' ORDER BY f.created_at DESC';
      } else if (sort === 'oldest') {
        query += ' ORDER BY f.created_at ASC';
      } else if (sort === 'price_low') {
        query += ' ORDER BY f.price ASC';
      } else if (sort === 'price_high') {
        query += ' ORDER BY f.price DESC';
      } else if (sort === 'quantity_high') {
        query += ' ORDER BY f.quantity DESC';
      } else {
        query += ' ORDER BY f.created_at DESC'; // Default sorting
      }
      
      const [listings] = await pool.execute(query, params);
      
      res.json({
        status: 'success',
        count: listings.length,
        listings
      });
    } catch (error) {
      console.error('Get listings error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch food listings',
        error: error.message
      });
    }
  },

  // Get single listing by ID
  getListingById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const query = `
        SELECT f.*, u.full_name as donor_name, u.email as donor_email,
               (SELECT COUNT(*) FROM claims WHERE food_id = f.id) as claim_count
        FROM food_listings f
        JOIN users u ON f.donor_id = u.id
        WHERE f.id = ?
      `;
      
      const [rows] = await pool.execute(query, [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Food listing not found'
        });
      }
      
      res.json({
        status: 'success',
        listing: rows[0]
      });
    } catch (error) {
      console.error('Get listing error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch food listing',
        error: error.message
      });
    }
  },

  // Create new listing
  createListing: async (req, res) => {
    try {
      const { 
        title, 
        description, 
        quantity, 
        pickup_time, 
        expiry_time, 
        address, 
        city, 
        image_url, 
        price,
        type = 'other' 
      } = req.body;
      
      // Validate required fields
      const requiredFields = ['title', 'quantity', 'pickup_time', 'address', 'city'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            status: 'error',
            message: `Missing required field: ${field}`
          });
        }
      }
      
      // Validate user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }
      
      const query = `
        INSERT INTO food_listings 
        (donor_id, title, description, quantity, pickup_time, expiry_time, 
         address, city, status, image_url, price, type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available', ?, ?, ?, NOW())
      `;
      
      const params = [
        req.user.id,
        title,
        description || null,
        parseInt(quantity) || 1,
        pickup_time,
        expiry_time || null,
        address,
        city,
        image_url || null,
        price ? parseFloat(price) : 0,
        type
      ];
      
      const [result] = await pool.execute(query, params);
      
      // Get the newly created listing
      const [newListing] = await pool.execute(
        'SELECT * FROM food_listings WHERE id = ?',
        [result.insertId]
      );
      
      res.status(201).json({
        status: 'success',
        message: 'Food listing created successfully',
        listingId: result.insertId,
        listing: newListing[0]
      });
    } catch (error) {
      console.error('Create listing error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create food listing',
        error: error.message
      });
    }
  },

  // Update listing
  updateListing: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Check if listing exists
      const [existing] = await pool.execute(
        'SELECT * FROM food_listings WHERE id = ?',
        [id]
      );
      
      if (existing.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Listing not found'
        });
      }
      
      // Check if user owns the listing
      if (existing[0].donor_id !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to update this listing'
        });
      }
      
      // Don't allow updating certain fields
      delete updates.id;
      delete updates.donor_id;
      delete updates.created_at;
      
      // Build dynamic update query
      const updateFields = [];
      const params = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`);
          
          // Handle special field types
          if (key === 'quantity') {
            params.push(parseInt(value) || 1);
          } else if (key === 'price') {
            params.push(parseFloat(value) || 0);
          } else {
            params.push(value);
          }
        }
      }
      
      if (updateFields.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'No fields to update'
        });
      }
      
      params.push(id);
      
      const query = `
        UPDATE food_listings 
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE id = ?
      `;
      
      await pool.execute(query, params);
      
      // Get updated listing
      const [updated] = await pool.execute(
        'SELECT * FROM food_listings WHERE id = ?',
        [id]
      );
      
      res.json({
        status: 'success',
        message: 'Listing updated successfully',
        listing: updated[0]
      });
    } catch (error) {
      console.error('Update listing error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update listing',
        error: error.message
      });
    }
  },

  // Claim food
  claimFood: async (req, res) => {
    try {
      const { foodId } = req.params;
      const { notes } = req.body;
      
      // Validate user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }
      
      // Check if food exists and is available
      const [foodRows] = await pool.execute(
        'SELECT * FROM food_listings WHERE id = ?',
        [foodId]
      );
      
      if (foodRows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Food listing not found'
        });
      }
      
      const food = foodRows[0];
      
      if (food.status !== 'available') {
        return res.status(400).json({
          status: 'error',
          message: 'This food is no longer available'
        });
      }
      
      // Check if user has already claimed
      const [existingClaims] = await pool.execute(
        'SELECT * FROM claims WHERE food_id = ? AND recipient_id = ?',
        [foodId, req.user.id]
      );
      
      if (existingClaims.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'You have already claimed this food'
        });
      }
      
      // Create claim
      const claimQuery = `
        INSERT INTO claims (food_id, recipient_id, notes, status, claimed_at)
        VALUES (?, ?, ?, 'pending', NOW())
      `;
      
      const [claimResult] = await pool.execute(claimQuery, [
        foodId,
        req.user.id,
        notes || null
      ]);
      
      // Update food status
      await pool.execute(
        'UPDATE food_listings SET status = ? WHERE id = ?',
        ['reserved', foodId]
      );
      
      res.json({
        status: 'success',
        message: 'Food claimed successfully!',
        claimId: claimResult.insertId
      });
    } catch (error) {
      console.error('Claim food error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to claim food',
        error: error.message
      });
    }
  },

  // Delete listing
  deleteListing: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if listing exists
      const [listingRows] = await pool.execute(
        'SELECT * FROM food_listings WHERE id = ?',
        [id]
      );
      
      if (listingRows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Listing not found'
        });
      }
      
      const listing = listingRows[0];
      
      // Check if user owns the listing
      if (listing.donor_id !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to delete this listing'
        });
      }
      
      // Delete related claims first (if any)
      await pool.execute('DELETE FROM claims WHERE food_id = ?', [id]);
      
      // Delete the listing
      await pool.execute('DELETE FROM food_listings WHERE id = ?', [id]);
      
      res.json({
        status: 'success',
        message: 'Listing deleted successfully'
      });
    } catch (error) {
      console.error('Delete listing error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete listing',
        error: error.message
      });
    }
  },

  // Get user's listings
  getUserListings: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }
      
      const query = `
        SELECT f.*, 
               COUNT(c.id) as claim_count,
               GROUP_CONCAT(c.status) as claim_statuses
        FROM food_listings f
        LEFT JOIN claims c ON f.id = c.food_id
        WHERE f.donor_id = ?
        GROUP BY f.id
        ORDER BY f.created_at DESC
      `;
      
      const [listings] = await pool.execute(query, [req.user.id]);
      
      // Parse claim statuses
      listings.forEach(listing => {
        if (listing.claim_statuses) {
          listing.claim_statuses = listing.claim_statuses.split(',');
        }
      });
      
      res.json({
        status: 'success',
        count: listings.length,
        listings
      });
    } catch (error) {
      console.error('Get user listings error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch user listings',
        error: error.message
      });
    }
  },

  // Get claimed foods by user
  getUserClaims: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }
      
      const query = `
        SELECT c.*, f.title, f.description, f.image_url, f.pickup_time, 
               f.address, f.city, f.price, f.quantity, f.status as food_status,
               u.full_name as donor_name, u.email as donor_email
        FROM claims c
        JOIN food_listings f ON c.food_id = f.id
        JOIN users u ON f.donor_id = u.id
        WHERE c.recipient_id = ?
        ORDER BY c.claimed_at DESC
      `;
      
      const [claims] = await pool.execute(query, [req.user.id]);
      
      res.json({
        status: 'success',
        count: claims.length,
        claims
      });
    } catch (error) {
      console.error('Get user claims error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch user claims',
        error: error.message
      });
    }
  },

  // Update claim status (for donors to approve/reject claims)
  updateClaimStatus: async (req, res) => {
    try {
      const { claimId } = req.params;
      const { status } = req.body;
      
      if (!status || !['approved', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid status. Must be: approved, rejected, or completed'
        });
      }
      
      // Check if claim exists and user owns the food
      const [claimRows] = await pool.execute(`
        SELECT c.*, f.donor_id 
        FROM claims c
        JOIN food_listings f ON c.food_id = f.id
        WHERE c.id = ?
      `, [claimId]);
      
      if (claimRows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Claim not found'
        });
      }
      
      if (claimRows[0].donor_id !== req.user.id) {
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to update this claim'
        });
      }
      
      // Update claim status
      await pool.execute(
        'UPDATE claims SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, claimId]
      );
      
      // If claim is rejected or completed, update food status
      if (status === 'rejected') {
        await pool.execute(
          'UPDATE food_listings SET status = ? WHERE id = ?',
          ['available', claimRows[0].food_id]
        );
      } else if (status === 'completed') {
        await pool.execute(
          'UPDATE food_listings SET status = ? WHERE id = ?',
          ['claimed', claimRows[0].food_id]
        );
      }
      
      res.json({
        status: 'success',
        message: `Claim ${status} successfully`
      });
    } catch (error) {
      console.error('Update claim status error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update claim status',
        error: error.message
      });
    }
  },

  // Reset food status (for testing/development)
  resetFoodStatus: async (req, res) => {
    try {
      // Only allow in development
      if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({
          status: 'error',
          message: 'This endpoint is only available in development mode'
        });
      }
      
      // Reset all food listings to available
      await pool.execute(
        "UPDATE food_listings SET status = 'available' WHERE status IN ('reserved', 'claimed')"
      );
      
      // Clear all claims
      await pool.execute('DELETE FROM claims');
      
      res.json({
        status: 'success',
        message: 'All food listings reset to available status'
      });
    } catch (error) {
      console.error('Reset food status error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to reset food status',
        error: error.message
      });
    }
  }
};

module.exports = foodController;