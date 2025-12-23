const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, no token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret-123');
    
    // Get user from database WITH admin fields
    const [users] = await pool.execute(
      'SELECT id, email, full_name, user_type, is_admin, admin_role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, token failed'
    });
  }
};

// ✅ NEW: Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.user_type !== 'admin' && !req.user.is_admin) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized as admin'
    });
  }
  next();
};

module.exports = { protect, isAdmin };