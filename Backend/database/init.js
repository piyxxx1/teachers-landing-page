const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'jlt_academy.db');
const db = new sqlite3.Database(dbPath);

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create admin users table
      db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create courses table
      db.run(`
        CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          duration TEXT,
          level TEXT,
          featured BOOLEAN DEFAULT 0,
          image_url TEXT,
          registration_link TEXT,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create webinars table
      db.run(`
        CREATE TABLE IF NOT EXISTS webinars (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT,
          duration TEXT,
          attendees TEXT,
          status TEXT DEFAULT 'upcoming',
          registration_link TEXT,
          video_url TEXT,
          image_url TEXT,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create slider content table
      db.run(`
        CREATE TABLE IF NOT EXISTS slider_content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          file_path TEXT NOT NULL,
          file_type TEXT NOT NULL,
          content_type TEXT NOT NULL,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create default admin user
      const defaultAdmin = {
        username: 'admin',
        email: 'admin@jltacademy.com',
        password: 'admin123'
      };

      // Check if admin user exists
      db.get('SELECT id FROM admin_users WHERE username = ?', [defaultAdmin.username], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          // Create default admin user
          bcrypt.hash(defaultAdmin.password, 10, (err, hash) => {
            if (err) {
              reject(err);
              return;
            }

            db.run(
              'INSERT INTO admin_users (username, email, password_hash) VALUES (?, ?, ?)',
              [defaultAdmin.username, defaultAdmin.email, hash],
              (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                console.log('✅ Default admin user created');
                console.log('👤 Username: admin');
                console.log('🔑 Password: admin123');
                console.log('📧 Email: admin@jltacademy.com');
                resolve();
              }
            );
          });
        } else {
          console.log('✅ Admin user already exists');
          resolve();
        }
      });
    });
  });
}

function getDatabase() {
  return db;
}

module.exports = {
  initializeDatabase,
  getDatabase
};

