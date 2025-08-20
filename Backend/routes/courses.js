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
    const uploadDir = path.join(__dirname, '../uploads/courses');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'course-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Validation middleware
const courseValidation = [
  body('title').notEmpty().withMessage('Course title is required'),
  body('description').notEmpty().withMessage('Course description is required'),
  body('duration').optional(),
  body('level').optional(),
  body('featured').optional().isBoolean(),
  body('registration_link').optional().isURL().withMessage('Invalid registration link'),
  body('sort_order').optional().isInt().withMessage('Sort order must be a number')
];

// Get all courses
router.get('/', (req, res) => {
  const db = getDatabase();
  
  db.all(
    'SELECT * FROM courses WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC',
    (err, courses) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ courses });
    }
  );
});

// Get single course
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM courses WHERE id = ? AND is_active = 1',
    [id],
    (err, course) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      res.json({ course });
    }
  );
});

// Create new course
router.post('/', [
  authenticateToken,
  verifyAdmin,
  upload.single('image'),
  ...courseValidation
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const {
    title,
    description,
    duration,
    level,
    featured,
    registration_link,
    sort_order
  } = req.body;

  const image_url = req.file ? `/uploads/courses/${req.file.filename}` : null;

  db.run(
    `INSERT INTO courses (
      title, description, duration, level, featured, 
      image_url, registration_link, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, duration, level, featured ? 1 : 0, image_url, registration_link, sort_order || 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create course' });
      }

      db.get('SELECT * FROM courses WHERE id = ?', [this.lastID], (err, course) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({
          message: 'Course created successfully',
          course
        });
      });
    }
  );
});

// Update course
router.put('/:id', [
  authenticateToken,
  verifyAdmin,
  upload.single('image'),
  ...courseValidation
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
    duration,
    level,
    featured,
    registration_link,
    sort_order
  } = req.body;

  // First get the current course to check if it exists and get current image
  db.get('SELECT image_url FROM courses WHERE id = ?', [id], (err, course) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const image_url = req.file ? `/uploads/courses/${req.file.filename}` : course.image_url;

    // Delete old image if new one is uploaded
    if (req.file && course.image_url) {
      const oldImagePath = path.join(__dirname, '..', course.image_url);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    db.run(
      `UPDATE courses SET 
        title = ?, description = ?, duration = ?, level = ?, 
        featured = ?, image_url = ?, registration_link = ?, 
        sort_order = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, description, duration, level, featured ? 1 : 0, image_url, registration_link, sort_order || 0, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update course' });
        }

        db.get('SELECT * FROM courses WHERE id = ?', [id], (err, updatedCourse) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({
            message: 'Course updated successfully',
            course: updatedCourse
          });
        });
      }
    );
  });
});

// Delete course (soft delete)
router.delete('/:id', [authenticateToken, verifyAdmin], (req, res) => {
  const db = getDatabase();
  const { id } = req.params;

  db.run(
    'UPDATE courses SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete course' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.json({ message: 'Course deleted successfully' });
    }
  );
});

// Reorder courses
router.post('/reorder', [authenticateToken, verifyAdmin], (req, res) => {
  const { courseOrders } = req.body; // Array of {id, sort_order}
  
  if (!Array.isArray(courseOrders)) {
    return res.status(400).json({ error: 'Invalid course orders format' });
  }

  const db = getDatabase();
  let completed = 0;
  let hasError = false;

  courseOrders.forEach(({ id, sort_order }) => {
    db.run(
      'UPDATE courses SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [sort_order, id],
      (err) => {
        if (err && !hasError) {
          hasError = true;
          return res.status(500).json({ error: 'Failed to reorder courses' });
        }
        
        completed++;
        if (completed === courseOrders.length && !hasError) {
          res.json({ message: 'Courses reordered successfully' });
        }
      }
    );
  });
});

module.exports = router;

