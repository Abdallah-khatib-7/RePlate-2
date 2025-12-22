// backend/controllers/contactController.js
const Contact = require('../models/contactModel');

const contactController = {
  // Submit contact form
  submitContact: async (req, res) => {
    try {
      const { 
        name: full_name, 
        email, 
        inquiryType: inquiry_type, 
        subject, 
        message, 
        isUrgent: is_urgent 
      } = req.body;

      // Validate required fields
      if (!full_name || !email || !subject || !message) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields'
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid email format'
        });
      }

      // Create contact message
      const contactId = await Contact.create({
        full_name,
        email,
        inquiry_type,
        subject,
        message,
        is_urgent: is_urgent || false
      });

      console.log('Message saved successfully with ID:', contactId);

      res.status(201).json({
        status: 'success',
        message: 'Message sent successfully! We\'ll get back to you within 24 hours.',
        contactId
      });

    } catch (error) {
      console.error('Contact submission error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send message. Please try again.',
        // Remove this in production, for debugging only:
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get all contact messages (admin only)
  getAllMessages: async (req, res) => {
    try {
      const messages = await Contact.findAll();
      
      res.json({
        status: 'success',
        count: messages.length,
        messages
      });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch messages'
      });
    }
  },

  // Update message status (admin only)
  updateMessageStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid status'
        });
      }

      const affectedRows = await Contact.updateStatus(id, status);
      
      if (affectedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Message not found'
        });
      }

      res.json({
        status: 'success',
        message: 'Message status updated successfully'
      });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update status'
      });
    }
  }
};

module.exports = contactController;