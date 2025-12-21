# Backend Deployment Guide

## Environment Variables Setup

### 1. Local Development
The `.env` file is configured for local development. Copy `.env.example` to `.env` and update with your actual values.

### 2. Production Deployment
For production, update your environment variables:

```
# Server Configuration
PORT=8000
NODE_ENV=production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/auth/google/callback

# Frontend Configuration
FRONTEND_ORIGIN=https://your-frontend-domain.com

# Backend URL for email verification links
BACKEND_URL=https://your-backend-domain.com

# Frontend URL for password reset links
FRONTEND_URL=https://your-frontend-domain.com

# Email Configuration (Gmail)
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
FROM_EMAIL="Your Name <your_gmail_address>"

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

### 3. Platform-Specific Instructions

#### Heroku
```bash
heroku config:set NODE_ENV=production
heroku config:set BACKEND_URL=https://your-app.herokuapp.com
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
heroku config:set FRONTEND_ORIGIN=https://your-frontend-domain.com
heroku config:set GOOGLE_CALLBACK_URL=https://your-app.herokuapp.com/auth/google/callback
# Add all other environment variables...
```

#### Railway
1. Go to your project settings
2. Add environment variables in the "Variables" section
3. Deploy from GitHub

#### Render
1. Go to your service settings
2. Add environment variables in the "Environment" section
3. Set NODE_ENV=production

#### AWS/DigitalOcean/VPS
1. Create a `.env` file on your server
2. Add all production environment variables
3. Use PM2 or similar process manager

## Build Commands

### Development
```bash
npm run watch  # Uses nodemon for auto-restart
```

### Production
```bash
npm start  # Uses node directly
```

## Important Production Considerations

### 1. Environment Variables
- All URLs are now configurable via environment variables
- No hardcoded localhost URLs remain
- Debug logging is disabled in production (NODE_ENV=production)

### 2. Security
- CORS is configured to only allow your frontend domain
- JWT tokens are properly secured
- All sensitive data is in environment variables

### 3. Database
- MongoDB Atlas connection is configured
- Connection pooling is handled by Mongoose

### 4. File Uploads
- Cloudinary is configured for file storage
- Multer handles file uploads

### 5. Email Service
- Nodemailer with Gmail is configured
- Email templates are ready for verification and password reset

### 6. Real-time Features
- Socket.IO is configured with proper CORS
- Chat functionality is ready
- Server-Sent Events for notifications

### 7. OAuth
- Google OAuth is configured
- Callback URLs are environment-based

## Files Modified for Production

- `server/src/app.js` - CORS configuration
- `server/src/server.js` - Socket.IO CORS and PORT configuration
- `server/src/routes/user/user.controller.js` - Email verification URLs
- `server/src/routes/email/email.controller.js` - Email URLs and debug logging
- `server/src/auth/googleStrategy.js` - Google OAuth callback URL
- All controller files - Debug logging wrapped in NODE_ENV checks

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check FRONTEND_ORIGIN matches your frontend domain exactly
2. **Email verification not working**: Verify BACKEND_URL is correct
3. **Password reset not working**: Verify FRONTEND_URL is correct
4. **Google OAuth failing**: Check GOOGLE_CALLBACK_URL matches your backend domain
5. **File uploads failing**: Verify Cloudinary credentials
6. **Database connection issues**: Check MONGO_URI format and credentials

### Debug Environment Variables:
Add this temporarily to any controller to check if environment variables are loaded:
```javascript
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_URL: process.env.BACKEND_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN
});
```

## Health Check
Your backend includes a health check endpoint:
- `GET /test` - Returns "connection was ok"

Use this to verify your deployment is working.