import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AnalyticsDebug = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint, name) => {
    try {
      const token = Cookies.get('token');
      console.log(`Testing ${name}...`);
      console.log('Token:', token);
      console.log('URL:', `${BACKENDURL}${endpoint}`);
      
      const response = await axios.get(`${BACKENDURL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`${name} response:`, response.data);
      setTestResults(prev => ({
        ...prev,
        [name]: { success: true, data: response.data }
      }));
    } catch (error) {
      console.error(`${name} error:`, error);
      setTestResults(prev => ({
        ...prev,
        [name]: { 
          success: false, 
          error: error.response?.data || error.message 
        }
      }));
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    
    await Promise.all([
      testEndpoint('/analytics/dashboard', 'Dashboard'),
      testEndpoint('/analytics/revenue', 'Revenue'),
      testEndpoint('/analytics/payments', 'Payments'),
      testEndpoint('/analytics/growth', 'Growth'),
      testEndpoint('/owners/myowner', 'Owner Data')
    ]);
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">Analytics Debug</h1>
        
        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run All Tests'}
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(testResults).map(([name, result]) => (
            <div key={name} className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-zinc-900 mb-2">{name}</h3>
              {result.success ? (
                <div className="text-green-600">
                  ✅ Success
                  <pre className="mt-2 text-xs bg-zinc-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-red-600">
                  ❌ Error: {result.error}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-zinc-900 mb-2">User Info</h3>
          <pre className="text-xs bg-zinc-100 p-2 rounded overflow-auto">
            {JSON.stringify({ user, token: Cookies.get('token') }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDebug; 