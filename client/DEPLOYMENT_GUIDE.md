# Frontend Deployment Guide

## Environment Variables Setup

### 1. Local Development
The `.env` file is already configured for local development with these variables:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
VITE_SSE_URL=http://localhost:8000
VITE_NODE_ENV=development
VITE_APP_NAME=ProLancer
VITE_APP_VERSION=1.0.0
```

### 2. Production Deployment
For production, update your environment variables to point to your deployed backend:

```
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
VITE_SSE_URL=https://your-backend-domain.com
VITE_NODE_ENV=production
VITE_APP_NAME=ProLancer
VITE_APP_VERSION=1.0.0
```

### 3. Platform-Specific Instructions

#### Vercel
1. Go to your project settings
2. Add environment variables in the "Environment Variables" section
3. Add each variable with the production values

#### Netlify
1. Go to Site settings > Environment variables
2. Add each variable with the production values

#### Heroku
```bash
heroku config:set VITE_API_BASE_URL=https://your-backend-domain.com
heroku config:set VITE_SOCKET_URL=https://your-backend-domain.com
heroku config:set VITE_SSE_URL=https://your-backend-domain.com
heroku config:set VITE_NODE_ENV=production
```

#### AWS Amplify
1. Go to App settings > Environment variables
2. Add each variable with the production values

## Build Commands

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Important Notes

1. **Environment Variables**: All environment variables for Vite must start with `VITE_`
2. **HTTPS**: Make sure your production backend URLs use HTTPS
3. **CORS**: Ensure your backend is configured to accept requests from your frontend domain
4. **WebSocket**: Make sure your backend supports WebSocket connections for Socket.IO
5. **SSE**: Ensure Server-Sent Events are properly configured on your backend

## Files Modified for Environment Variables

- `client/src/config/api.js` - Main API configuration
- `client/src/services/socket/socketService.js` - Socket.IO configuration
- `client/src/services/sse/sseService.js` - Server-Sent Events configuration
- `client/src/pages/Auth/Login/Login.jsx` - Google OAuth URL
- `client/src/pages/Auth/SignUpChoice/SignUpChoice.jsx` - Google OAuth URL

## Troubleshooting

### Common Issues:
1. **API calls failing**: Check if `VITE_API_BASE_URL` is correctly set
2. **Socket connection issues**: Verify `VITE_SOCKET_URL` matches your backend
3. **Real-time notifications not working**: Check `VITE_SSE_URL` configuration
4. **Google OAuth not working**: Ensure the OAuth URLs are using the correct backend domain

### Debug Environment Variables:
Add this to any component to check if environment variables are loaded:
```javascript
console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);
console.log('SSE_URL:', import.meta.env.VITE_SSE_URL);
```