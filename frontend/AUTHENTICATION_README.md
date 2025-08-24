# 🔐 Frontend Authentication System

This document explains the complete authentication flow implemented in the frontend.

## 🏗️ **Architecture Overview**

### **Components Structure**
```
AuthContext (Global State)
├── Login Component
├── Register Component  
├── ProtectedRoute Component
├── Layout Component
├── UserDashboard Component
└── AuthStatus Component
```

## 🔄 **Authentication Flow**

### **1. User Registration**
```
User fills form → POST /register/signup → Backend creates user → Redirect to login
```

### **2. User Login**
```
User enters credentials → POST /login/signin → Backend validates → Returns JWT + user data
```

### **3. Token Storage**
```
Frontend receives token → Stores in cookies → Token persists across sessions
```

### **4. Protected Route Access**
```
User visits protected route → Frontend checks cookies → Sends token in header → Backend verifies → Allows access
```

## 🧩 **Key Components**

### **AuthContext.jsx**
- **Purpose**: Global authentication state management
- **Features**:
  - User authentication status
  - Token management
  - Owner data fetching
  - Error handling
  - Loading states

### **Login.jsx**
- **Purpose**: User authentication interface
- **Features**:
  - Email/password form
  - Google OAuth integration
  - Error handling
  - Success redirects

### **Register.jsx**
- **Purpose**: User registration interface
- **Features**:
  - User registration form
  - Password validation
  - Success handling

### **ProtectedRoute.jsx**
- **Purpose**: Route protection middleware
- **Features**:
  - Authentication checks
  - Loading states
  - Redirect handling

### **UserDashboard.jsx**
- **Purpose**: Main dashboard for authenticated users
- **Features**:
  - Business statistics
  - Quick actions
  - Owner data display
  - Error handling

### **AuthStatus.jsx**
- **Purpose**: Global authentication status display
- **Features**:
  - Error notifications
  - Business profile status
  - Action buttons

## 🎯 **Key Features**

### **Smart Redirects**
- **With Owner Profile**: Redirects to `/dashboard`
- **Without Owner Profile**: Redirects to `/submitownerdata`
- **Authentication Failed**: Redirects to `/login`

### **Error Handling**
- **JWT Expired**: Automatic logout and redirect
- **Network Errors**: Graceful fallbacks
- **Business Profile Issues**: Clear guidance

### **Data Management**
- **Automatic Refresh**: Owner data updates
- **State Persistence**: Cookies for tokens
- **Real-time Updates**: Context-based state

## 🚀 **Usage Examples**

### **Login with Hook**
```javascript
import { useAuthActions } from '../hooks/useAuthActions';

const { handleLogin } = useAuthActions();

const onSubmit = async (e) => {
  e.preventDefault();
  await handleLogin(email, password);
};
```

### **Check Authentication**
```javascript
import { useAuth } from '../context/AuthContext';

const { isAuthenticated, user, hasOwnerData } = useAuth();

if (isAuthenticated && hasOwnerData()) {
  // User can access full features
}
```

### **Protected Route**
```javascript
import ProtectedRoute from '../Components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
VITE_BACKEND_URL=http://localhost:5000
```

### **Cookie Settings**
```javascript
Cookies.set('token', token, { 
  expires: 7,  // 7 days
  secure: process.env.NODE_ENV === 'production' 
});
```

## 🧪 **Testing**

### **Test Cases**
1. **New User Registration**
2. **User Login (No Business Profile)**
3. **User Login (With Business Profile)**
4. **Protected Route Access**
5. **Token Expiration Handling**
6. **Error State Management**

### **Manual Testing**
1. Register new user
2. Login with credentials
3. Check redirect behavior
4. Verify protected route access
5. Test error scenarios

## 🚨 **Common Issues**

### **Token Expired**
- **Symptom**: 401 errors on API calls
- **Solution**: Automatic logout and redirect to login

### **Missing Business Profile**
- **Symptom**: Owner data is null
- **Solution**: Redirect to business profile setup

### **Network Errors**
- **Symptom**: API calls fail
- **Solution**: Graceful error handling with retry options

## 📱 **Mobile Responsiveness**

All authentication components are fully responsive and work on:
- Desktop browsers
- Tablet devices
- Mobile phones
- Different screen sizes

## 🔒 **Security Features**

- **JWT Token Storage**: Secure cookie storage
- **Automatic Logout**: On token expiration
- **Route Protection**: Unauthorized access prevention
- **Error Sanitization**: Safe error messages

## 🚀 **Future Enhancements**

- [ ] Remember me functionality
- [ ] Multi-factor authentication
- [ ] Session management
- [ ] Role-based access control
- [ ] Audit logging

---

**Last Updated**: January 2024
**Version**: 1.0.0
