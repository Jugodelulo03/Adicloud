const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * @route   GET /profile
 * @desc    Returns user information from a valid JWT token
 * @access  Protected (requires Authorization header with Bearer token)
 */
router.get('/profile', (req, res) => {
  // Step 1: Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Token required' }); // No token provided
  }

  // Step 2: Verify and decode the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' }); // Token is invalid
    }

    // Step 3: Send decoded user information
    res.json({ user });
  });
});

module.exports = router;
