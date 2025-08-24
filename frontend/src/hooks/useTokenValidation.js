import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import tokenManager from '../utils/tokenManager';

export const useTokenValidation = () => {
  const { checkTokenExpiry, logout } = useAuth();

  // Check token validity on mount and set up periodic checks
  useEffect(() => {
    const checkToken = () => {
      if (tokenManager.isTokenExpired()) {
        console.log('⚠️ Token expired, logging out...');
        logout();
        return false;
      }
      
      if (tokenManager.needsRefresh()) {
        console.log('⚠️ Token needs refresh soon...');
        checkTokenExpiry();
        return false;
      }
      
      return true;
    };

    // Check immediately
    checkToken();

    // Set up periodic checks every hour
    const interval = setInterval(checkToken, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkTokenExpiry, logout]);

  // Function to validate token before API calls
  const validateToken = useCallback(() => {
    if (tokenManager.isTokenExpired()) {
      console.log('❌ Token expired during API call');
      logout();
      return false;
    }
    return true;
  }, [logout]);

  // Function to get token info
  const getTokenInfo = useCallback(() => {
    return tokenManager.getTokenInfo();
  }, []);

  return {
    validateToken,
    getTokenInfo,
    isTokenExpired: tokenManager.isTokenExpired,
    needsRefresh: tokenManager.needsRefresh
  };
};
