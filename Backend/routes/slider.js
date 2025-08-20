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
    const uploadDir = path.join(__dirname, '../uploads/slider');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slider-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for videos
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
const sliderValidation = [
  body('title').optional(),
  body('description').optional(),
  body('content_type').isIn(['image', 'video']).withMessage('Content type must be image or video'),
  body('sort_order').optional().isInt().withMessage('Sort order must be a number')
];

// Get all slider content
router.get('/', (req, res) => {
  const db = getDatabase();
  
  db.all(
    'SELECT * FROM slider_content WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC',
    (err, sliderItems) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ sliderItems });
    }
  );
});

// Get single slider item
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM slider_content WHERE id = ? AND is_active = 1',
    [id],
    (err, sliderItem) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!sliderItem) {
        return res.status(404).json({ error: 'Slider item not found' });
      }
      
      res.json({ sliderItem });
    }
  );
});

// Create new slider item
router.post('/', [
  authenticateToken,
  verifyAdmin,
  upload.single('file'),
  ...sliderValidation
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const db = getDatabase();
  const {
    title,
    description,
    content_type,
    sort_order
  } = req.body;

  const file_path = `/uploads/slider/${req.file.filename}`;
  const file_type = path.extname(req.file.originalname).toLowerCase();

  db.run(
    `INSERT INTO slider_content (
      title, description, file_path, file_type, content_type, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, file_path, file_type, content_type, sort_order || 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create slider item' });
      }

      db.get('SELECT * FROM slider_content WHERE id = ?', [this.lastID], (err, sliderItem) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({
          message: 'Slider item created successfully',
          sliderItem
        });
      });
    }
  );
});

// Update slider item
router.put('/:id', [
  authenticateToken,
  verifyAdmin,
  upload.single('file'),
  ...sliderValidation
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
    content_type,
    sort_order
  } = req.body;

  // First get the current slider item to check if it exists and get current file
  db.get('SELECT file_path FROM slider_content WHERE id = ?', [id], (err, sliderItem) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!sliderItem) {
      return res.status(404).json({ error: 'Slider item not found' });
    }

    const file_path = req.file ? `/uploads/slider/${req.file.filename}` : sliderItem.file_path;
    const file_type = req.file ? path.extname(req.file.originalname).toLowerCase() : null;

    // Delete old file if new one is uploaded
    if (req.file && sliderItem.file_path) {
      const oldFilePath = path.join(__dirname, '..', sliderItem.file_path);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const updateFields = req.file 
      ? `title = ?, description = ?, file_path = ?, file_type = ?, content_type = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP`
      : `title = ?, description = ?, content_type = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP`;

    const updateValues = req.file 
      ? [title, description, file_path, file_type, content_type, sort_order || 0, id]
      : [title, description, content_type, sort_order || 0, id];

    db.run(
      `UPDATE slider_content SET ${updateFields} WHERE id = ?`,
      updateValues,
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update slider item' });
        }

        db.get('SELECT * FROM slider_content WHERE id = ?', [id], (err, updatedSliderItem) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({
            message: 'Slider item updated successfully',
            sliderItem: updatedSliderItem
          });
        });
      }
    );
  });
});

// Delete slider item (soft delete)
router.delete('/:id', [authenticateToken, verifyAdmin], (req, res) => {
  const db = getDatabase();
  const { id } = req.params;

  // First get the file path to delete the file
  db.get('SELECT file_path FROM slider_content WHERE id = ?', [id], (err, sliderItem) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!sliderItem) {
      return res.status(404).json({ error: 'Slider item not found' });
    }

    // Delete the file from filesystem
    if (sliderItem.file_path) {
      const filePath = path.join(__dirname, '..', sliderItem.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Soft delete from database
    db.run(
      'UPDATE slider_content SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete slider item' });
        }

        res.json({ message: 'Slider item deleted successfully' });
      }
    );
  });
});

// Reorder slider items
router.post('/reorder', [authenticateToken, verifyAdmin], (req, res) => {
  const { sliderOrders } = req.body; // Array of {id, sort_order}
  
  if (!Array.isArray(sliderOrders)) {
    return res.status(400).json({ error: 'Invalid slider orders format' });
  }

  const db = getDatabase();
  let completed = 0;
  let hasError = false;

  sliderOrders.forEach(({ id, sort_order }) => {
    db.run(
      'UPDATE slider_content SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [sort_order, id],
      (err) => {
        if (err && !hasError) {
          hasError = true;
          return res.status(500).json({ error: 'Failed to reorder slider items' });
        }
        
        completed++;
        if (completed === sliderOrders.length && !hasError) {
          res.json({ message: 'Slider items reordered successfully' });
        }
      }
    );
  });
});

// Get slider items by content type
router.get('/type/:content_type', (req, res) => {
  const db = getDatabase();
  const { content_type } = req.params;
  
  db.all(
    'SELECT * FROM slider_content WHERE content_type = ? AND is_active = 1 ORDER BY sort_order ASC',
    [content_type],
    (err, sliderItems) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ sliderItems });
    }
  );
});

module.exports = router;

