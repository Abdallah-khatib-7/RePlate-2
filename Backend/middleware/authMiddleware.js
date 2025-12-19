const jwt = require('jsonwebtoken');

const authMiddleware = {
  // Protect routes - require authentication
  protect: async (req, res, next) => {
    try {
      let token;

      // Get token from header
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authorized - no token'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user to request object
      req.user = {
        id: decoded.id,
        email: decoded.email
      };

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({
        status: 'error',
        message: 'Not authorized - invalid token'
      });
    }
  }
};

module.exports = authMiddleware;