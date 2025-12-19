const { pool } = require('../config/database');

class User {
  static async create(userData) {
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, full_name, phone, address, user_type, google_id, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userData.email,
        userData.password,
        userData.full_name,
        userData.phone,
        userData.address,
        userData.user_type || 'recipient',
        userData.google_id,
        userData.email_verified ? 1 : 0
      ]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, email, full_name, phone, address, user_type, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByGoogleId(googleId) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE google_id = ?',
      [googleId]
    );
    return rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
  }

  static async updateProfile(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) return;

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    await pool.execute(query, values);
  }
}

module.exports = User;