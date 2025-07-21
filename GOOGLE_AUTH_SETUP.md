# Google Authentication Setup Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install passport passport-google-oauth20 express-session
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/invoice_generator"

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Session Secret
SESSION_SECRET=your_session_secret_here

# Node Environment
NODE_ENV=development

# Port
PORT=5000
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

### 4. Database Migration
```bash
cd backend
npx prisma migrate dev --name add_google_auth
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install js-cookie
```

## Features Implemented

### ✅ Authentication Features
- Google OAuth authentication
- JWT token generation and verification
- Session management
- User profile with avatar support
- Secure logout functionality

### ✅ UI/UX Features
- Conditional navbar based on authentication status
- Beautiful Google login button with official branding
- User profile dropdown with avatar
- Loading states and smooth animations
- Mobile-responsive design

### ✅ Security Features
- Protected routes for authenticated users only
- Automatic redirect to login for unauthenticated users
- Secure token storage in cookies
- Session management with proper cleanup

### ✅ Navigation Features
- **Before Authentication**: Shows only Login/Signup buttons
- **After Authentication**: Shows all navigation items (Owners, Customers, Products, Quotations) plus user profile dropdown
- Mobile-responsive navigation with user info display
- Smooth transitions and animations

## How It Works

1. **Unauthenticated Users**: See only Login/Signup buttons in navbar
2. **Google Login**: Click "Continue with Google" to authenticate
3. **After Login**: All navigation items become available + user profile dropdown
4. **User Profile**: Shows user avatar, name, email, and logout option
5. **Protected Routes**: All main app routes require authentication
6. **Logout**: Clears session and redirects to login

## File Structure

```
frontend/src/
├── context/
│   └── AuthContext.jsx          # Authentication state management
├── Components/
│   ├── Singnup/
│   │   ├── Login.jsx            # Updated with Google auth
│   │   └── AuthCallback.jsx     # Handles OAuth redirect
│   ├── Navbar/
│   │   └── Navbar.jsx           # Conditional navigation
│   └── ProtectedRoute.jsx       # Route protection
└── App.jsx                      # Updated with auth routes

backend/
├── src/
│   ├── config/
│   │   └── googleAuth.js        # Google OAuth configuration
│   └── routes/
│       └── googleAuth.js        # Google auth routes
├── prisma/
│   └── schema.prisma            # Updated User model
└── index.js                     # Updated with auth middleware
```

## Testing the Implementation

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:5173`
4. You should be redirected to login page
5. Click "Continue with Google" to test authentication
6. After successful login, you should see all navigation items
7. Test the user profile dropdown and logout functionality 