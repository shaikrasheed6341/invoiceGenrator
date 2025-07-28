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
      toast.error('❌ Authentication failed. Please try again.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (token) {
      // Console log the token for easy copying
      console.log('🔑 GOOGLE AUTH TOKEN:', token);
      console.log('📋 Copy this token for Postman: Bearer ' + token);
      console.log('🎯 Use this in Postman Authorization header');
      
      // Store the token and update auth context
      handleAuthCallback(token);
      
      toast.success('🎉 Successfully logged in with Google!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to root route
      setTimeout(() => navigate('/'), 3000);
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, handleAuthCallback]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-3xl p-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 