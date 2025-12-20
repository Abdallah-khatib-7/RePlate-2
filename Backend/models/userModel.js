// backend/models/userModel.js - CORRECTED VERSION
const pool = require('../config/database'); // Remove the { pool } destructuring

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
      
      const result = await pool.execute(sql, params);
      console.log('✅ Insert result:', result);
      
      // Handle the result structure properly
      const rows = Array.isArray(result) ? result[0] : result;
      return rows.insertId;
      
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
      const result = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      // Handle different result structures
      let rows;
      if (Array.isArray(result) && Array.isArray(result[0])) {
        rows = result[0]; // [rows, fields] structure
      } else if (Array.isArray(result)) {
        rows = result; // Direct array of rows
      } else {
        rows = []; // Default empty array
      }
      
      console.log('📊 Found users:', rows.length);
      return rows[0] || null;
    } catch (error) {
      console.error('❌ UserModel.findByEmail() error:', error);
      console.error('❌ Full error object:', error);
      return null;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.execute(
        'SELECT id, email, full_name, phone, address, user_type, created_at FROM users WHERE id = ?',
        [id]
      );
      
      let rows;
      if (Array.isArray(result) && Array.isArray(result[0])) {
        rows = result[0];
      } else if (Array.isArray(result)) {
        rows = result;
      } else {
        rows = [];
      }
      
      return rows[0] || null;
    } catch (error) {
      console.error('UserModel.findById() error:', error);
      return null;
    }
  }

  static async findByGoogleId(googleId) {
    try {
      const result = await pool.execute(
        'SELECT * FROM users WHERE google_id = ?',
        [googleId]
      );
      
      let rows;
      if (Array.isArray(result) && Array.isArray(result[0])) {
        rows = result[0];
      } else if (Array.isArray(result)) {
        rows = result;
      } else {
        rows = [];
      }
      
      return rows[0] || null;
    } catch (error) {
      console.error('UserModel.findByGoogleId() error:', error);
      return null;
    }
  }

  static async updatePassword(id, hashedPassword) {
    try {
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
    } catch (error) {
      console.error('UserModel.updatePassword() error:', error);
      throw error;
    }
  }

  static async updateProfile(id, updateData) {
    try {
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
    } catch (error) {
      console.error('UserModel.updateProfile() error:', error);
      throw error;
    }
  }
}

module.exports = User;