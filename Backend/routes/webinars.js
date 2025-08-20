const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/webinars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'webinar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|wmv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Validation middleware
const webinarValidation = [
  body('title').notEmpty().withMessage('Webinar title is required'),
  body('description').notEmpty().withMessage('Webinar description is required'),
  body('date').notEmpty().withMessage('Webinar date is required'),
  body('time').optional(),
  body('duration').optional(),
  body('attendees').optional(),
  body('status').isIn(['upcoming', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('registration_link').optional().isURL().withMessage('Invalid registration link'),
  body('video_url').optional().isURL().withMessage('Invalid video URL'),
  body('sort_order').optional().isInt().withMessage('Sort order must be a number')
];

// Get all webinars
router.get('/', (req, res) => {
  const db = getDatabase();
  
  db.all(
    'SELECT * FROM webinars WHERE is_active = 1 ORDER BY sort_order ASC, date DESC',
    (err, webinars) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ webinars });
    }
  );
});

// Get single webinar
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM webinars WHERE id = ? AND is_active = 1',
    [id],
    (err, webinar) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!webinar) {
        return res.status(404).json({ error: 'Webinar not found' });
      }
      
      res.json({ webinar });
    }
  );
});

// Create new webinar
router.post('/', [
  authenticateToken,
  verifyAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  ...webinarValidation
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const {
    title,
    description,
    date,
    time,
    duration,
    attendees,
    status,
    registration_link,
    video_url,
    sort_order
  } = req.body;

  const image_url = req.files.image ? `/uploads/webinars/${req.files.image[0].filename}` : null;
  const uploaded_video_url = req.files.video ? `/uploads/webinars/${req.files.video[0].filename}` : null;

  db.run(
    `INSERT INTO webinars (
      title, description, date, time, duration, attendees, status,
      registration_link, video_url, image_url, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title, description, date, time, duration, attendees, status,
      registration_link, uploaded_video_url || video_url, image_url, sort_order || 0
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create webinar' });
      }

      db.get('SELECT * FROM webinars WHERE id = ?', [this.lastID], (err, webinar) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({
          message: 'Webinar created successfully',
          webinar
        });
      });
    }
  );
});

// Update webinar
router.put('/:id', [
  authenticateToken,
  verifyAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  ...webinarValidation
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const { id } = req.params;
  const {
    title,
    description,
    date,
    time,
    duration,
    attendees,
    status,
    registration_link,
    video_url,
    sort_order
  } = req.body;

  // First get the current webinar to check if it exists and get current files
  db.get('SELECT image_url, video_url FROM webinars WHERE id = ?', [id], (err, webinar) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    const image_url = req.files.image ? `/uploads/webinars/${req.files.image[0].filename}` : webinar.image_url;
    const uploaded_video_url = req.files.video ? `/uploads/webinars/${req.files.video[0].filename}` : webinar.video_url;

    // Delete old files if new ones are uploaded
    if (req.files.image && webinar.image_url) {
      const oldImagePath = path.join(__dirname, '..', webinar.image_url);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    if (req.files.video && webinar.video_url) {
      const oldVideoPath = path.join(__dirname, '..', webinar.video_url);
      if (fs.existsSync(oldVideoPath)) {
        fs.unlinkSync(oldVideoPath);
      }
    }

    db.run(
      `UPDATE webinars SET 
        title = ?, description = ?, date = ?, time = ?, duration = ?, 
        attendees = ?, status = ?, registration_link = ?, video_url = ?, 
        image_url = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        title, description, date, time, duration, attendees, status,
        registration_link, uploaded_video_url || video_url, image_url, sort_order || 0, id
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update webinar' });
        }

        db.get('SELECT * FROM webinars WHERE id = ?', [id], (err, updatedWebinar) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({
            message: 'Webinar updated successfully',
            webinar: updatedWebinar
          });
        });
      }
    );
  });
});

// Delete webinar (soft delete)
router.delete('/:id', [authenticateToken, verifyAdmin], (req, res) => {
  const db = getDatabase();
  const { id } = req.params;

  db.run(
    'UPDATE webinars SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete webinar' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Webinar not found' });
      }

      res.json({ message: 'Webinar deleted successfully' });
    }
  );
});

// Reorder webinars
router.post('/reorder', [authenticateToken, verifyAdmin], (req, res) => {
  const { webinarOrders } = req.body; // Array of {id, sort_order}
  
  if (!Array.isArray(webinarOrders)) {
    return res.status(400).json({ error: 'Invalid webinar orders format' });
  }

  const db = getDatabase();
  let completed = 0;
  let hasError = false;

  webinarOrders.forEach(({ id, sort_order }) => {
    db.run(
      'UPDATE webinars SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [sort_order, id],
      (err) => {
        if (err && !hasError) {
          hasError = true;
          return res.status(500).json({ error: 'Failed to reorder webinars' });
        }
        
        completed++;
        if (completed === webinarOrders.length && !hasError) {
          res.json({ message: 'Webinars reordered successfully' });
        }
      }
    );
  });
});

// Get webinars by status
router.get('/status/:status', (req, res) => {
  const db = getDatabase();
  const { status } = req.params;
  
  db.all(
    'SELECT * FROM webinars WHERE status = ? AND is_active = 1 ORDER BY date DESC',
    [status],
    (err, webinars) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ webinars });
    }
  );
});

module.exports = router;

