import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await axios.get(`${BACKENDURL}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data.user);
        } catch (error) {
          Cookies.remove('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BACKENDURL}/login/signin`, {
        email,
        password,
      });
      
      const { token } = response.data;
      Cookies.set('token', token, { expires: 7, secure: true });
      
      // Get user info
      const userResponse = await axios.get(`${BACKENDURL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(userResponse.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
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
      Cookies.remove('token');
      setUser(null);
    }
  };

  const handleAuthCallback = (token) => {
    Cookies.set('token', token, { expires: 7, secure: true });
    // The user will be set when the component re-renders and useEffect runs
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    handleAuthCallback,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 