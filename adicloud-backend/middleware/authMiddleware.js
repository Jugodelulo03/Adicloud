const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens.
 *
 * This function checks the `Authorization` header for a Bearer token.
 * If a valid token is found and verified, it attaches the decoded user
 * information to the `req.user` object and allows the request to continue.
 *
 * If no token is found or the token is invalid/expired, it returns an
 * appropriate error response.
 *
 * Usage: Apply this middleware to any route that requires authentication.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user; // Attach decoded payload (e.g., user ID, role) to the request object
    next(); // Proceed to the next middleware or route handler
  });
}

/**
 * Middleware to enforce admin-only access.
 *
 * This function assumes the `authenticateToken` middleware has already been called,
 * and that `req.user` exists. It checks the user's role and only allows access
 * if the role is "admin".
 *
 * If the user is not an admin, it returns a 403 error response.
 *
 * Usage: Use this middleware *after* `authenticateToken` to protect admin routes.
 */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  next(); // User is an admin, continue to the next middleware or route handler
}

module.exports = { authenticateToken, requireAdmin };
