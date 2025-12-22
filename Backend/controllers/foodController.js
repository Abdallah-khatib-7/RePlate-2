const { pool } = require('../config/database');

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

  // Get all claims for a restaurant's listings
  getRestaurantClaims: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Get all food listings by this restaurant
      const [listings] = await pool.execute(
        'SELECT id FROM food_listings WHERE donor_id = ?',
        [userId]
      );
      
      if (listings.length === 0) {
        return res.json({
          status: 'success',
          claims: []
        });
      }
      
      const listingIds = listings.map(l => l.id);

if (listingIds.length === 0) {
  return res.json({
    status: 'success',
    claims: []
  });
}

const placeholders = listingIds.map(() => '?').join(',');

const [claims] = await pool.execute(`
  SELECT 
    c.*,
    f.title as food_title,
    f.quantity as food_quantity,
    f.price as food_price,
    f.pickup_time as food_pickup_time,
    f.address as restaurant_address,
    f.city as restaurant_city,
    u.full_name as recipient_name,
    u.email as recipient_email,
    u.phone as recipient_phone
  FROM claims c
  JOIN food_listings f ON c.food_id = f.id
  JOIN users u ON c.recipient_id = u.id
  WHERE c.food_id IN (${placeholders})
  ORDER BY c.claimed_at DESC
`, listingIds);

      
      // Generate confirmation codes if not present
      for (let claim of claims) {
        if (!claim.confirmation_code) {
          const code = generateConfirmationCode();
          await pool.execute(
            'UPDATE claims SET confirmation_code = ? WHERE id = ?',
            [code, claim.id]
          );
          claim.confirmation_code = code;
        }
      }
      
      res.json({
        status: 'success',
        claims: claims
      });
      
    } catch (error) {
      console.error('Get restaurant claims error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch claims'
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
      console.log('=== CREATE LISTING REQUEST ===');
      console.log('User ID:', req.user ? req.user.id : 'No user');
      console.log('Request Body:', req.body);
      
      const { 
        title, 
        description, 
        quantity, 
        price,
        pickup_time, 
        expiry_time, 
        address, 
        city, 
        image_url
      } = req.body;
      
      // Validate required fields
      const requiredFields = ['title', 'quantity', 'pickup_time', 'address', 'city', 'price'];
      console.log('Checking required fields:', requiredFields);
      
      for (const field of requiredFields) {
        if (!req.body[field]) {
          console.log(`Missing field: ${field}`);
          return res.status(400).json({
            status: 'error',
            message: `Missing required field: ${field}`
          });
        }
      }
      
      // Validate user is authenticated
      if (!req.user || !req.user.id) {
        console.log('No user authentication');
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }
      
      console.log('All validation passed, creating listing...');
      
      const query = `
        INSERT INTO food_listings 
        (donor_id, title, description, quantity, price, pickup_time, expiry_time, 
         address, city, status, image_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?, NOW())
      `;
      
      const params = [
        req.user.id,
        title,
        description || null,
        parseInt(quantity) || 1,
        parseFloat(price) || 0.00,
        pickup_time,
        expiry_time || null,
        address,
        city,
        image_url || null
      ];
      
      console.log('Query parameters:', params);
      
      const [result] = await pool.execute(query, params);
      console.log('Insert result:', result);
      
      // Get the newly created listing
      const [newListing] = await pool.execute(
        'SELECT * FROM food_listings WHERE id = ?',
        [result.insertId]
      );
      
      console.log('New listing created:', newListing[0]);
      
      res.status(201).json({
        status: 'success',
        message: 'Food listing created successfully',
        listingId: result.insertId,
        listing: newListing[0]
      });
      
    } catch (error) {
      console.error('=== CREATE LISTING ERROR ===');
      console.error('Error:', error.message);
      console.error('Full error:', error);
      console.error('Stack trace:', error.stack);
      
      res.status(500).json({
        status: 'error',
        message: 'Failed to create food listing',
        error: error.message,
        details: error.code
      });
    }
  },

  // Update listing
  updateListing: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      console.log('=== UPDATE LISTING REQUEST ===');
      console.log('Listing ID:', id);
      console.log('User ID:', req.user ? req.user.id : 'No user');
      console.log('Updates:', updates);
      
      // Check if listing exists
      const [existing] = await pool.execute(
        'SELECT * FROM food_listings WHERE id = ?',
        [id]
      );
      
      console.log('Existing listing:', existing[0]);
      
      if (existing.length === 0) {
        console.log('Listing not found');
        return res.status(404).json({
          status: 'error',
          message: 'Listing not found'
        });
      }
      
      const listing = existing[0];
      console.log('Listing donor_id:', listing.donor_id);
      console.log('Request user id:', req.user.id);
      console.log('Are they equal?', listing.donor_id === req.user.id);
      
      // Check if user owns the listing
      if (listing.donor_id !== req.user.id) {
        console.log('User does not own this listing');
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to update this listing'
        });
      }
      
      console.log('User authorized, proceeding with update...');
      
      // Don't allow updating certain fields
      delete updates.id;
      delete updates.donor_id;
      delete updates.created_at;
      
      // Build dynamic update query
      const updateFields = [];
      const params = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined && value !== null) {
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
        console.log('No fields to update');
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
      
      console.log('Update query:', query);
      console.log('Update params:', params);
      
      await pool.execute(query, params);
      
      // Get updated listing
      const [updated] = await pool.execute(
        'SELECT * FROM food_listings WHERE id = ?',
        [id]
      );
      
      console.log('Updated listing:', updated[0]);
      
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

  // Get restaurant's own listings (for PostFood page)
  getMyListings: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }
      
      const query = `
        SELECT f.*, u.full_name as donor_name, u.email as donor_email
        FROM food_listings f
        JOIN users u ON f.donor_id = u.id
        WHERE f.donor_id = ?
        ORDER BY f.created_at DESC
      `;
      
      const [listings] = await pool.execute(query, [req.user.id]);
      
      // Format the listings for frontend
      const formattedListings = listings.map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: parseFloat(listing.price),
        quantity: listing.quantity,
        city: listing.city,
        address: listing.address,
        pickup_time: listing.pickup_time,
        image_url: listing.image_url,
        status: listing.status,
        created_at: listing.created_at,
        donor_id: listing.donor_id,
        donor_name: listing.donor_name
      }));
      
      res.json({
        status: 'success',
        listings: formattedListings
      });
    } catch (error) {
      console.error('Get my listings error:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch your listings' 
      });
    }
  },

  // Claim food with confirmation code
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
      
      // Generate confirmation code
      const confirmationCode = generateConfirmationCode();
      
      // Create claim with confirmation code
      const claimQuery = `
        INSERT INTO claims (food_id, recipient_id, notes, status, confirmation_code, claimed_at)
        VALUES (?, ?, ?, 'pending', ?, NOW())
      `;
      
      const [claimResult] = await pool.execute(claimQuery, [
        foodId,
        req.user.id,
        notes || null,
        confirmationCode
      ]);
      
      // Update food status to reserved
      await pool.execute(
        'UPDATE food_listings SET status = ? WHERE id = ?',
        ['reserved', foodId]
      );
      
      res.json({
        status: 'success',
        message: 'Food claimed successfully!',
        claimId: claimResult.insertId,
        confirmationCode: confirmationCode
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
      
      console.log('=== DELETE LISTING REQUEST ===');
      console.log('Listing ID:', id);
      console.log('User ID:', req.user ? req.user.id : 'No user');
      
      // Check if listing exists
      const [listingRows] = await pool.execute(
        'SELECT * FROM food_listings WHERE id = ?',
        [id]
      );
      
      console.log('Found listing:', listingRows[0]);
      
      if (listingRows.length === 0) {
        console.log('Listing not found');
        return res.status(404).json({
          status: 'error',
          message: 'Listing not found'
        });
      }
      
      const listing = listingRows[0];
      console.log('Listing donor_id:', listing.donor_id);
      console.log('Request user id:', req.user.id);
      console.log('Are they equal?', listing.donor_id === req.user.id);
      
      // Check if user owns the listing
      if (listing.donor_id !== req.user.id) {
        console.log('User does not own this listing');
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to delete this listing'
        });
      }
      
      console.log('User authorized, deleting...');
      
      // Delete related claims first (if any)
      await pool.execute('DELETE FROM claims WHERE food_id = ?', [id]);
      
      // Delete the listing
      await pool.execute('DELETE FROM food_listings WHERE id = ?', [id]);
      
      console.log('Listing deleted successfully');
      
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

  // Get user's listings (similar to getMyListings but with different data)
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

  // Update claim status (verify/complete)
  updateClaimStatus: async (req, res) => {
    try {
      const { claimId } = req.params;
      const { status, verification_code } = req.body;
      const userId = req.user.id;
      
      console.log('=== UPDATE CLAIM STATUS ===');
      console.log('Claim ID:', claimId);
      console.log('Status:', status);
      console.log('Verification Code:', verification_code);
      console.log('User ID:', userId);
      
      // Verify the restaurant owns this food listing
      const [claimCheck] = await pool.execute(`
        SELECT f.donor_id, f.id as food_id 
        FROM claims c
        JOIN food_listings f ON c.food_id = f.id
        WHERE c.id = ?
      `, [claimId]);
      
      if (claimCheck.length === 0) {
        console.log('Claim not found');
        return res.status(404).json({
          status: 'error',
          message: 'Claim not found'
        });
      }
      
      console.log('Claim found, donor_id:', claimCheck[0].donor_id);
      
      if (claimCheck[0].donor_id !== userId) {
        console.log('User not authorized');
        return res.status(403).json({
          status: 'error',
          message: 'Not authorized to update this claim'
        });
      }
      
      // If verifying with code
      if (verification_code) {
        const [codeCheck] = await pool.execute(
          'SELECT confirmation_code FROM claims WHERE id = ?',
          [claimId]
        );
        
        console.log('Checking code:', codeCheck[0]);
        
        if (!codeCheck[0] || codeCheck[0].confirmation_code !== verification_code) {
          console.log('Invalid code');
          return res.status(400).json({
            status: 'error',
            message: 'Invalid verification code'
          });
        }
      }
      
      // Update claim status
      let updateQuery = 'UPDATE claims SET status = ?';
      const params = [status];
      
      if (status === 'completed') {
        updateQuery += ', verified_at = NOW()';
        // Also update food listing status to claimed
        await pool.execute(
          'UPDATE food_listings SET status = ? WHERE id = ?',
          ['claimed', claimCheck[0].food_id]
        );
      } else if (status === 'cancelled') {
        // Reset food listing status to available
        await pool.execute(
          'UPDATE food_listings SET status = ? WHERE id = ?',
          ['available', claimCheck[0].food_id]
        );
      }
      
      updateQuery += ' WHERE id = ?';
      params.push(claimId);
      
      console.log('Executing query:', updateQuery, params);
      await pool.execute(updateQuery, params);
      
      console.log('Claim status updated successfully');
      
      res.json({
        status: 'success',
        message: 'Claim status updated successfully'
      });
      
    } catch (error) {
      console.error('Update claim status error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update claim status'
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
  },

  // Check user type
  checkUserType: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }
      
      const [userRows] = await pool.execute(
        'SELECT user_type FROM users WHERE id = ?',
        [req.user.id]
      );
      
      if (userRows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      const userType = userRows[0].user_type;
      
      res.json({
        status: 'success',
        user_type: userType,
        isDonor: userType === 'donor',
        isRecipient: userType === 'recipient',
        isAdmin: userType === 'admin'
      });
    } catch (error) {
      console.error('Check user type error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to check user type',
        error: error.message
      });
    }
  },

  // Debug: Get current user info and listings
  debugInfo: async (req, res) => {
    try {
      console.log('=== DEBUG INFO REQUEST ===');
      console.log('Request user:', req.user);
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
      }
      
      // Get user details
      const [userRows] = await pool.execute(
        'SELECT id, email, full_name, user_type FROM users WHERE id = ?',
        [req.user.id]
      );
      
      if (userRows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found in database'
        });
      }
      
      const user = userRows[0];
      
      // Get user's listings
      const [listings] = await pool.execute(
        'SELECT id, title, donor_id, status FROM food_listings WHERE donor_id = ?',
        [req.user.id]
      );
      
      // Get user's claims (as donor)
      const listingIds = listings.map(l => l.id);

if (listingIds.length === 0) {
  return res.json({
    status: 'success',
    claims: []
  });
}

const placeholders = listingIds.map(() => '?').join(',');

const [claims] = await pool.execute(`
  SELECT 
    c.*,
    f.title as food_title,
    f.quantity as food_quantity,
    f.price as food_price,
    f.pickup_time as food_pickup_time,
    f.address as restaurant_address,
    f.city as restaurant_city,
    u.full_name as recipient_name,
    u.email as recipient_email,
    u.phone as recipient_phone
  FROM claims c
  JOIN food_listings f ON c.food_id = f.id
  JOIN users u ON c.recipient_id = u.id
  WHERE c.food_id IN (${placeholders})
  ORDER BY c.claimed_at DESC
`, listingIds);

      
      res.json({
        status: 'success',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type
        },
        user_listings: listings,
        user_claims: claims,
        is_donor: user.user_type === 'donor'
      });
      
    } catch (error) {
      console.error('Debug info error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Debug failed',
        error: error.message
      });
    }
  }


  
};

// Helper function to generate confirmation code
function generateConfirmationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = foodController;