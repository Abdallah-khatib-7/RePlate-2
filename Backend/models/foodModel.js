const { pool } = require('../config/database');

class Food {
  static async create(foodData) {
    const [result] = await pool.execute(
      `INSERT INTO food_listings 
      (donor_id, title, description, quantity, price, pickup_time, expiry_time, address, city, status, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        foodData.donor_id,
        foodData.title,
        foodData.description,
        foodData.quantity,
        foodData.price || 0.00,
        foodData.pickup_time,
        foodData.expiry_time || null,
        foodData.address,
        foodData.city,
        foodData.status || 'available',
        foodData.image_url
      ]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT f.*, u.full_name as donor_name, u.email as donor_email 
       FROM food_listings f
       JOIN users u ON f.donor_id = u.id
       WHERE f.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByCity(city) {
    const [rows] = await pool.execute(
      `SELECT f.*, u.full_name as donor_name 
       FROM food_listings f
       JOIN users u ON f.donor_id = u.id
       WHERE f.city = ? AND f.status = 'available'
       ORDER BY f.created_at DESC`,
      [city]
    );
    return rows;
  }

  static async findByDonor(donorId) {
    const [rows] = await pool.execute(
      `SELECT * FROM food_listings 
       WHERE donor_id = ?
       ORDER BY created_at DESC`,
      [donorId]
    );
    return rows;
  }

  static async updateStatus(id, status) {
    await pool.execute(
      'UPDATE food_listings SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  static async delete(id, donorId) {
    await pool.execute(
      'DELETE FROM food_listings WHERE id = ? AND donor_id = ?',
      [id, donorId]
    );
  }

  // NEW METHOD: Update listing with multiple fields
  static async update(id, donorId, updateData) {
    const fields = [];
    const values = [];
    
    // Build dynamic query based on provided fields
    if (updateData.title !== undefined) {
      fields.push('title = ?');
      values.push(updateData.title);
    }
    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description);
    }
    if (updateData.price !== undefined) {
      fields.push('price = ?');
      values.push(updateData.price);
    }
    if (updateData.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(updateData.quantity);
    }
    if (updateData.city !== undefined) {
      fields.push('city = ?');
      values.push(updateData.city);
    }
    if (updateData.address !== undefined) {
      fields.push('address = ?');
      values.push(updateData.address);
    }
    if (updateData.pickup_time !== undefined) {
      fields.push('pickup_time = ?');
      values.push(updateData.pickup_time);
    }
    if (updateData.expiry_time !== undefined) {
      fields.push('expiry_time = ?');
      values.push(updateData.expiry_time);
    }
    if (updateData.image_url !== undefined) {
      fields.push('image_url = ?');
      values.push(updateData.image_url);
    }
    if (updateData.status !== undefined) {
      fields.push('status = ?');
      values.push(updateData.status);
    }
    
    if (fields.length === 0) {
      return 0; // No fields to update
    }
    
    // Add updated_at timestamp
    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Add id and donorId for WHERE clause
    values.push(id, donorId);
    
    const [result] = await pool.execute(
      `UPDATE food_listings SET ${fields.join(', ')} WHERE id = ? AND donor_id = ?`,
      values
    );
    
    return result.affectedRows;
  }

  // NEW METHOD: Get all available listings with filters
  static async getAllListings(filters = {}) {
    let query = `
      SELECT f.*, u.full_name as donor_name 
      FROM food_listings f
      JOIN users u ON f.donor_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Apply filters
    if (filters.city) {
      query += ' AND f.city = ?';
      params.push(filters.city);
    }
    
    if (filters.price_max) {
      query += ' AND f.price <= ?';
      params.push(parseFloat(filters.price_max));
    }
    
    if (filters.status) {
      if (filters.status !== 'all') {
        query += ' AND f.status = ?';
        params.push(filters.status);
      }
    } else {
      // Default to available if no status filter
      query += ' AND f.status = "available"';
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'oldest':
          query += ' ORDER BY f.created_at ASC';
          break;
        case 'price_low':
          query += ' ORDER BY f.price ASC';
          break;
        case 'price_high':
          query += ' ORDER BY f.price DESC';
          break;
        case 'quantity_high':
          query += ' ORDER BY f.quantity DESC';
          break;
        case 'newest':
        default:
          query += ' ORDER BY f.created_at DESC';
          break;
      }
    } else {
      query += ' ORDER BY f.created_at DESC';
    }

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // NEW METHOD: Check if listing belongs to donor
  static async isOwner(listingId, donorId) {
    const [rows] = await pool.execute(
      'SELECT id FROM food_listings WHERE id = ? AND donor_id = ?',
      [listingId, donorId]
    );
    return rows.length > 0;
  }

  // NEW METHOD: Get listing with donor info
  static async getListingWithDonor(id) {
    const [rows] = await pool.execute(
      `SELECT f.*, u.full_name as donor_name, u.email as donor_email, u.phone as donor_phone
       FROM food_listings f
       JOIN users u ON f.donor_id = u.id
       WHERE f.id = ?`,
      [id]
    );
    return rows[0];
  }
}

module.exports = Food;