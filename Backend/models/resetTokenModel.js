const { pool } = require('../config/database');

class ResetToken {
  static async create(tokenData) {
    await pool.execute(
      'INSERT INTO reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [tokenData.user_id, tokenData.token, tokenData.expires_at]
    );
  }

  static async findValid(token, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM reset_tokens WHERE token = ? AND user_id = ? AND used = FALSE AND expires_at > NOW()',
      [token, userId]
    );
    return rows[0];
  }

  static async markAsUsed(token) {
    await pool.execute(
      'UPDATE reset_tokens SET used = TRUE WHERE token = ?',
      [token]
    );
  }
}

module.exports = ResetToken;