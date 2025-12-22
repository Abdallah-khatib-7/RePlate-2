// backend/models/contactModel.js
const { pool } = require('../config/database');

class Contact {
  static async create(contactData) {
    let connection;
    try {
      // Get a connection from the pool
      connection = await pool.getConnection();
      
      const [result] = await connection.execute(
        `INSERT INTO contact_messages 
         (full_name, email, inquiry_type, subject, message, is_urgent, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          contactData.full_name,
          contactData.email,
          contactData.inquiry_type || 'general',
          contactData.subject,
          contactData.message,
          contactData.is_urgent ? 1 : 0,
          'new'
        ]
      );
      
      // Release the connection back to the pool
      if (connection) connection.release();
      
      return result.insertId;
      
    } catch (error) {
      // Always release connection on error
      if (connection) connection.release();
      console.error('Contact model error details:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  static async findAll() {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM contact_messages ORDER BY created_at DESC'
      );
      connection.release();
      return rows;
    } catch (error) {
      if (connection) connection.release();
      throw error;
    }
  }

  static async findById(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM contact_messages WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0];
    } catch (error) {
      if (connection) connection.release();
      throw error;
    }
  }

  static async updateStatus(id, status) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.execute(
        'UPDATE contact_messages SET status = ? WHERE id = ?',
        [status, id]
      );
      connection.release();
      return result.affectedRows;
    } catch (error) {
      if (connection) connection.release();
      throw error;
    }
  }

  static async findByEmail(email) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM contact_messages WHERE email = ? ORDER BY created_at DESC',
        [email]
      );
      connection.release();
      return rows;
    } catch (error) {
      if (connection) connection.release();
      throw error;
    }
  }
}

module.exports = Contact;