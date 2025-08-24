import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import tokenManager from '../utils/tokenManager';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔄 Checking authentication on app load...');
      const token = tokenManager.getToken();
      console.log('🍪 Token from cookies:', token ? 'Present' : 'Not found');
      
      // Check if token is expired
      if (token && tokenManager.isTokenExpired()) {
        console.log('⚠️ Token is expired, removing...');
        tokenManager.removeToken();
        setUser(null);
        setAuthError('Session expired. Please login again.');
        setLoading(false);
        return;
      }
      
      if (token) {
        try {
          console.log('🔍 Verifying token with backend...');
          const response = await axios.get(`${BACKENDURL}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('✅ Token verified, user data:', response.data.user);
          
          // If the user data already includes owner data, use it
          if (response.data.user.owner) {
            setUser(response.data.user);
            setAuthError(null);
          } else {
            // Otherwise, fetch owner data separately
            console.log('🔍 Fetching owner data for existing session...');
            try {
              const ownerResponse = await axios.get(`${BACKENDURL}/owners/myowner`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              
              if (ownerResponse.data.owner) {
                const completeUserData = {
                  ...response.data.user,
                  owner: ownerResponse.data.owner
                };
                console.log('👤 Complete user data with owner:', completeUserData);
                setUser(completeUserData);
                setAuthError(null);
              } else {
                setUser(response.data.user);
                setAuthError('No business profile found. Please complete your business setup.');
              }
            } catch (ownerError) {
              console.log('⚠️ Could not fetch owner data, using basic user data:', ownerError.message);
              setUser(response.data.user);
              setAuthError('Could not load business profile. Please refresh or contact support.');
            }
          }
        } catch (error) {
          console.error('❌ Token verification failed:', error);
          if (error.response?.status === 401) {
            // Token expired or invalid
            tokenManager.removeToken();
            setUser(null);
            setAuthError('Session expired. Please login again.');
          } else if (error.response?.status === 404) {
            // User not found - this shouldn't happen with valid token
            tokenManager.removeToken();
            setUser(null);
            setAuthError('User account not found. Please login again.');
          } else {
            // Network or other errors - don't logout immediately, try to recover
            console.log('⚠️ Token verification failed but not due to auth issues:', error.message);
            setAuthError('Connection issue. Please check your internet and refresh the page.');
            // Don't remove token or user for network issues
          }
        }
      } else {
        console.log('ℹ️ No token found, user not authenticated');
        setAuthError(null);
      }
      
      setLoading(false);
      console.log('🏁 Authentication check complete');
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setAuthError(null);
      console.log('🔐 Attempting login for:', email);
      
      const response = await axios.post(`${BACKENDURL}/login/signin`, {
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      console.log('✅ Login successful, token received');
      
      // Store token in cookies with better persistence
      tokenManager.setToken(token);
      console.log('🍪 Token stored in cookies');
      
      // If the login response already includes owner data, use it
      if (userData.owner) {
        console.log('👤 User data with owner received:', userData);
        setUser(userData);
        setAuthError(null);
        return { success: true, hasOwner: true };
      }
      
      // Otherwise, fetch owner data separately
      console.log('🔍 Fetching owner data...');
      try {
        const ownerResponse = await axios.get(`${BACKENDURL}/owners/myowner`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (ownerResponse.data.owner) {
          const completeUserData = {
            ...userData,
            owner: ownerResponse.data.owner
          };
          console.log('👤 Complete user data with owner:', completeUserData);
          setUser(completeUserData);
          setAuthError(null);
          return { success: true, hasOwner: true };
        } else {
          console.log('👤 User data without owner:', userData);
          setUser(userData);
          // Don't set error for missing business profile - this is normal for new users
          return { success: true, hasOwner: false };
        }
      } catch (ownerError) {
        console.log('⚠️ Could not fetch owner data:', ownerError.message);
        // Check if it's a 404 (no business profile) vs other errors
        if (ownerError.response?.status === 404) {
          // No business profile exists - this is normal for new users
          setUser(userData);
          return { success: true, hasOwner: false };
        } else {
          // Real error occurred
          setUser(userData);
          setAuthError('Login successful but could not load business profile. Please try refreshing the page.');
          return { success: true, hasOwner: false, warning: 'Business profile not loaded' };
        }
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${BACKENDURL}/auth/google`;
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKENDURL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.removeToken();
      setUser(null);
      setAuthError(null);
    }
  };

  const refreshOwnerData = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        console.log('⚠️ No token available for refreshing owner data');
        return false;
      }

      console.log('🔄 Refreshing owner data...');
      const ownerResponse = await axios.get(`${BACKENDURL}/owners/myowner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (ownerResponse.data.owner && user) {
        const updatedUserData = {
          ...user,
          owner: ownerResponse.data.owner
        };
        setUser(updatedUserData);
        setAuthError(null);
        console.log('✅ Owner data refreshed:', updatedUserData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error refreshing owner data:', error);
      return false;
    }
  };

  const hasOwnerData = () => {
    return !!(user && user.owner);
  };

  // Check and refresh token if needed
  const checkTokenExpiry = () => {
    const tokenInfo = tokenManager.getTokenInfo();
    if (tokenInfo && tokenInfo.daysUntilExpiry <= 7) {
      console.log(`⚠️ Token expires in ${tokenInfo.daysUntilExpiry} days`);
      // You can implement automatic token refresh here if needed
      return false;
    }
    return true;
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const handleAuthCallback = (token) => {
    // Console log the token for easy copying
    console.log('🔑 AUTH CONTEXT TOKEN:', token);
    console.log('📋 Copy this token for Postman: Bearer ' + token);
    console.log('🎯 Use this in Postman Authorization header');
    
    tokenManager.setToken(token);
    // The user will be set when the component re-renders and useEffect runs
  };

  const value = {
    user,
    loading,
    authError,
    login,
    loginWithGoogle,
    logout,
    handleAuthCallback,
    isAuthenticated: !!user,
    refreshOwnerData,
    hasOwnerData,
    clearAuthError,
    checkTokenExpiry
  };

  // Debug logging whenever user state changes
  useEffect(() => {
    console.log('🔄 AuthContext - User state changed:', user);
    console.log('🔄 AuthContext - isAuthenticated:', !!user);
    console.log('🔄 AuthContext - Loading:', loading);
    console.log('🔄 AuthContext - Auth Error:', authError);
  }, [user, loading, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 