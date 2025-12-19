// backend/models/userModel.js - CORRECTED VERSION
const { pool } = require('../config/database');

class User {
  static async create(userData) {
    console.log('📋 UserModel.create() called with:', userData);
    
    try {
      // Handle NULL values properly
      const sql = `
        INSERT INTO users 
        (email, password, full_name, phone, address, user_type, google_id, email_verified) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        userData.email || null,
        userData.password || null,
        userData.full_name || null,
        userData.phone || null,
        userData.address || null,
        userData.user_type || 'recipient',
        userData.google_id || null,
        userData.email_verified ? 1 : 0
      ];
      
      console.log('📝 SQL:', sql);
      console.log('🔢 Parameters:', params);
      
      const [result] = await pool.execute(sql, params);
      console.log('✅ Insert result:', result);
      
      return result.insertId;
      
    } catch (error) {
      console.error('❌ UserModel.create() error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error sqlMessage:', error.sqlMessage);
      console.error('❌ Error sql:', error.sql);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      console.log('🔍 UserModel.findByEmail() called for:', email);
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      console.log('📊 Found users:', rows.length);
      return rows[0];
    } catch (error) {
      console.error('❌ UserModel.findByEmail() error:', error);
      return null;
    }
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