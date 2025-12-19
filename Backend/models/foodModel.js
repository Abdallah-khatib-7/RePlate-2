const { pool } = require('../config/database');

class Food {
  static async create(foodData) {
    const [result] = await pool.execute(
      `INSERT INTO food_listings 
      (donor_id, title, description, quantity, pickup_time, expiry_time, address, city, status, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        foodData.donor_id,
        foodData.title,
        foodData.description,
        foodData.quantity,
        foodData.pickup_time,
        foodData.expiry_time,
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
}

module.exports = Food;