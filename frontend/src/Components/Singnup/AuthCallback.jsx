import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Authentication failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token) {
      // Store the token and update auth context
      handleAuthCallback(token);
      
      toast.success('🎉 Successfully logged in with Google!', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      });

      // Redirect to root route
      setTimeout(() => navigate('/'), 2000);
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, handleAuthCallback]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div className="bg-white/20 backdrop-blur-xl shadow-2xl border border-white/30 rounded-3xl p-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 