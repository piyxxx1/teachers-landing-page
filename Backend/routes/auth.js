const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken, verifyAdmin, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Login validation
const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Login route
router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const db = getDatabase();

  db.get(
    'SELECT * FROM admin_users WHERE username = ? OR email = ?',
    [username, username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      try {
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Authentication error' });
      }
    }
  );
});

// Get current user profile
router.get('/profile', authenticateToken, verifyAdmin, (req, res) => {
  res.json({
    user: req.adminUser
  });
});

// Change password
router.post('/change-password', [
  authenticateToken,
  verifyAdmin,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;
  const db = getDatabase();

  db.get(
    'SELECT password_hash FROM admin_users WHERE id = ?',
    [req.user.id],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      try {
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
        
        if (!isValidPassword) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        db.run(
          'UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [newPasswordHash, req.user.id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to update password' });
            }

            res.json({ message: 'Password updated successfully' });
          }
        );
      } catch (error) {
        res.status(500).json({ error: 'Password update error' });
      }
    }
  );
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;

