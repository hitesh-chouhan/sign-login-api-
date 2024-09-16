const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract userId
exports.verifyToken = (req, res, next) => {
  // Get the token from the Authorization header (format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // Attach userId to the req object
    req.user = { userId: decoded.userId };
    next();
  });
};
