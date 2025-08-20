# JLT Academy Admin Backend

A comprehensive backend API for managing JLT Academy website content including courses, webinars, and slider content.

## Features

- 🔐 **Secure Authentication** - JWT-based admin authentication
- 📚 **Course Management** - CRUD operations for courses with image uploads
- 🎥 **Webinar Management** - Manage webinars with video/image uploads
- 🖼️ **Slider Management** - Upload and manage slider images/videos
- 🗄️ **SQLite Database** - Lightweight, file-based database
- 📁 **File Upload** - Support for images and videos with size limits
- 🔒 **Security** - Rate limiting, CORS, input validation
- 📊 **API Documentation** - Comprehensive REST API

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-secret-key-here
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` with a default admin user:
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@jltacademy.com`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/reorder` - Reorder courses

### Webinars
- `GET /api/webinars` - Get all webinars
- `GET /api/webinars/:id` - Get single webinar
- `POST /api/webinars` - Create new webinar
- `PUT /api/webinars/:id` - Update webinar
- `DELETE /api/webinars/:id` - Delete webinar
- `POST /api/webinars/reorder` - Reorder webinars
- `GET /api/webinars/status/:status` - Get webinars by status

### Slider Content
- `GET /api/slider` - Get all slider items
- `GET /api/slider/:id` - Get single slider item
- `POST /api/slider` - Create new slider item
- `PUT /api/slider/:id` - Update slider item
- `DELETE /api/slider/:id` - Delete slider item
- `POST /api/slider/reorder` - Reorder slider items
- `GET /api/slider/type/:content_type` - Get items by type

## Database Schema

### Admin Users
```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Courses
```sql
CREATE TABLE courses (
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
);
```

### Webinars
```sql
CREATE TABLE webinars (
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
);
```

### Slider Content
```sql
CREATE TABLE slider_content (
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
);
```

## File Upload

### Supported Formats
- **Images:** JPEG, JPG, PNG, GIF, WebP
- **Videos:** MP4, AVI, MOV, WMV

### Size Limits
- **Course Images:** 5MB
- **Webinar Images/Videos:** 10MB
- **Slider Content:** 50MB

### Upload Directories
- Course images: `uploads/courses/`
- Webinar files: `uploads/webinars/`
- Slider content: `uploads/slider/`

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Express-validator for request validation
- **Rate Limiting** - Prevents abuse with request limits
- **CORS Protection** - Configurable cross-origin requests
- **Helmet Security** - Security headers middleware
- **File Type Validation** - Only allowed file types accepted

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

### Project Structure
```
backend/
├── database/
│   └── init.js          # Database initialization
├── middleware/
│   └── auth.js          # Authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── courses.js       # Course management routes
│   ├── webinars.js      # Webinar management routes
│   └── slider.js        # Slider content routes
├── uploads/             # File upload directory
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Production Deployment

1. **Set environment variables:**
   ```env
   NODE_ENV=production
   JWT_SECRET=your-very-secure-secret-key
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Install dependencies:**
   ```bash
   npm install --production
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Health Check

Check if the server is running:
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "JLT Academy Admin Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Support

For issues and questions, please contact the development team or create an issue in the repository.

