const { verifyToken } = require('../config/auth');
const db = require('../config/db');

/**
 * Middleware to protect routes. Verifies JWT token and checks if user is administrator.
 */
async function protect(req, res, next) {
  let token;

  // Check headers for authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Fallback check cookies (for dashboard browser requests)
  else if (req.headers.cookie) {
    const tokenCookie = req.headers.cookie
      .split(';')
      .find(c => c.trim().startsWith('token='));
    if (tokenCookie) {
      token = tokenCookie.split('=')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this resource. No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }

    // Fetch admin details
    const result = await db.query(
      'SELECT id, name, email, role FROM admins WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Admin account no longer exists.' });
    }

    // Attach user to request
    req.admin = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ success: false, message: 'Authentication failed.' });
  }
}

/**
 * Middleware to restrict access to superadmins only.
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role (${req.admin ? req.admin.role : 'Guest'}) is not authorized to access this resource` 
      });
    }
    next();
  };
}

module.exports = {
  protect,
  authorizeRoles
};
