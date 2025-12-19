const { pool } = require('../config/database');

class Claim {
  static async create(claimData) {
    const [result] = await pool.execute(
      `INSERT INTO claims (food_id, recipient_id, status, notes) 
       VALUES (?, ?, ?, ?)`,
      [
        claimData.food_id,
        claimData.recipient_id,
        claimData.status || 'pending',
        claimData.notes
      ]
    );
    return result.insertId;
  }

  static async findByRecipient(recipientId) {
    const [rows] = await pool.execute(
      `SELECT c.*, f.title, f.description, f.pickup_time, f.address, u.full_name as donor_name
       FROM claims c
       JOIN food_listings f ON c.food_id = f.id
       JOIN users u ON f.donor_id = u.id
       WHERE c.recipient_id = ?
       ORDER BY c.claimed_at DESC`,
      [recipientId]
    );
    return rows;
  }

  static async findByFood(foodId) {
    const [rows] = await pool.execute(
      `SELECT c.*, u.full_name as recipient_name, u.email as recipient_email
       FROM claims c
       JOIN users u ON c.recipient_id = u.id
       WHERE c.food_id = ?`,
      [foodId]
    );
    return rows;
  }

  static async updateStatus(id, status) {
    await pool.execute(
      'UPDATE claims SET status = ? WHERE id = ?',
      [status, id]
    );
  }
}

module.exports = Claim;