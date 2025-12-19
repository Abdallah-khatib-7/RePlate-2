// backend/models/ContactModel.js
const { pool } = require('../config/database');

class Contact {
  static async create(contactData) {
    try {
      const [result] = await pool.execute(
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
      return result.insertId;
    } catch (error) {
      console.error('Contact model error:', error);
      throw error;
    }
  }

  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updateStatus(id, status) {
    await pool.execute(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM contact_messages WHERE email = ? ORDER BY created_at DESC',
      [email]
    );
    return rows;
  }
}

module.exports = Contact;