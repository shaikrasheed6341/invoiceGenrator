import Cookies from 'js-cookie';

const tokenManager = {
  // Get token from cookies
  getToken: () => {
    return Cookies.get('token');
  },

  // Set token in cookies with 120 days persistence
  setToken: (token) => {
    Cookies.set('token', token, { 
      expires: 120, // Expires in 120 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
  },

  // Remove token from cookies
  removeToken: () => {
    Cookies.remove('token', { 
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  },

  // Check if token exists
  hasToken: () => {
    return !!Cookies.get('token');
  },

  // Get token with Bearer prefix for API calls
  getAuthHeader: () => {
    const token = Cookies.get('token');
    return token ? `Bearer ${token}` : null;
  },

  // Check if token is expired (JWT tokens)
  isTokenExpired: () => {
    try {
      const token = Cookies.get('token');
      if (!token) return true;
      
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      
      return expirationDate.getTime() <= now.getTime();
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Check if token needs refresh (expires within 7 days)
  needsRefresh: () => {
    try {
      const token = Cookies.get('token');
      if (!token) return true;
      
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      const payload = JSON.parse(atob(parts[1]));
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      const timeUntilExpiry = expirationDate.getTime() - now.getTime();
      const daysUntilExpiry = Math.ceil(timeUntilExpiry / (1000 * 60 * 60 * 24));
      
      return daysUntilExpiry <= 7;
    } catch (error) {
      console.error('Error checking token refresh need:', error);
      return true;
    }
  },

  // Get token expiration info
  getTokenInfo: () => {
    try {
      const token = Cookies.get('token');
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      const timeUntilExpiry = expirationDate.getTime() - now.getTime();
      const daysUntilExpiry = Math.ceil(timeUntilExpiry / (1000 * 60 * 60 * 24));
      
      return {
        issuedAt: new Date(payload.iat * 1000),
        expiresAt: expirationDate,
        daysUntilExpiry,
        isExpired: timeUntilExpiry <= 0,
        userId: payload.id,
        email: payload.email
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};

export default tokenManager;
