# JLT Academy Admin Panel

This is the admin panel for the JLT Academy website, built with React, TypeScript, and shadcn/ui components.

## Features

- **Authentication System**: Secure login with JWT tokens
- **Dashboard**: Overview of courses, webinars, and slider items
- **Course Management**: Create, edit, delete, and manage courses
- **Webinar Management**: Schedule and manage webinar events
- **Slider Management**: Manage homepage slider content
- **File Upload**: Image upload for courses, webinars, and slider items
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5173`

## Admin Panel Access

### Login
- Navigate to `/admin/login`
- Use the admin credentials configured in your backend

### Available Routes
- `/admin/dashboard` - Overview and statistics
- `/admin/courses` - Course management
- `/admin/webinars` - Webinar management  
- `/admin/slider` - Slider content management

## Features Overview

### Dashboard
- View total counts of courses, webinars, and slider items
- Recent activity overview
- Quick action buttons

### Course Management
- Create new courses with images
- Edit existing course details
- Toggle course visibility
- Set featured courses
- Manage course metadata (duration, level, registration links)

### Webinar Management
- Schedule new webinars with date and time
- Add speaker information
- Set webinar duration
- Manage registration links
- Toggle webinar visibility

### Slider Management
- Create slider items for homepage
- Upload slider images
- Set button text and links
- Control display order
- Toggle slider item visibility

## API Integration

The admin panel integrates with the JLT Academy backend API:

- **Authentication**: JWT-based authentication
- **File Upload**: Multipart form data for images
- **Real-time Updates**: React Query for data synchronization
- **Error Handling**: Toast notifications for user feedback

## Security Features

- Protected routes requiring authentication
- Automatic token refresh
- Secure file upload validation
- Input validation with Zod schemas
- XSS protection with proper data sanitization

## Development

### Project Structure
```
src/
├── components/
│   ├── admin/          # Admin-specific components
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts (Auth)
├── lib/              # Utilities and API
├── pages/
│   ├── admin/        # Admin pages
│   └── ...           # Public pages
└── App.tsx           # Main app component
```

### Key Technologies
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** with Zod validation
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **Axios** for API communication

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Update the `.env` file with your production API URL:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure the backend server is running
   - Check the `VITE_API_URL` environment variable
   - Verify CORS settings on the backend

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify admin credentials

3. **File Upload Problems**
   - Check file size limits
   - Verify supported image formats
   - Ensure upload directory permissions

### Support

For technical support or questions about the admin panel, please contact the development team.
