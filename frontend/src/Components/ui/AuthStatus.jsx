import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, CheckCircle, X, RefreshCw } from 'lucide-react';

const AuthStatus = () => {
  const { authError, clearAuthError, refreshOwnerData, hasOwnerData, user } = useAuth();

  // Don't show anything if everything is fine
  if (!authError && hasOwnerData) {
    return null;
  }

  // Don't show warning for missing business profile if user just logged in
  // This will be handled by the onboarding flow instead
  if (!authError && !hasOwnerData && user) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg mb-3">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-red-100 rounded-full flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-red-800">
                Authentication Issue
              </h3>
              <p className="text-sm text-red-700 mt-1 break-words">
                {authError}
              </p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={clearAuthError}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={refreshOwnerData}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition-colors flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            <button
              onClick={clearAuthError}
              className="p-1 hover:bg-red-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthStatus;
