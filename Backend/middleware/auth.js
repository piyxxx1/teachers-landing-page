const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database/init');

const JWT_SECRET = process.env.JWT_SECRET || 'jlt-academy-secret-key-2024';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  const db = getDatabase();
  
  db.get(
    'SELECT id, username, email, role FROM admin_users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      req.adminUser = user;
      next();
    }
  );
};

module.exports = {
  authenticateToken,
  verifyAdmin,
  JWT_SECRET
};

