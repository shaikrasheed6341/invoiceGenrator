import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import tokenManager from "../../utils/tokenManager";
import { useTokenValidation } from "../../hooks/useTokenValidation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent } from "../ui/card";
import LoadingSpinner from "../ui/LoadingSpinner";
import { 
  Users, 
  Package, 
  FileText, 
  Building2, 
  BarChart3,
  DollarSign,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import OnboardingFlow from "./OnboardingFlow";
import TokenInfo from "../ui/TokenInfo";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UserDashboard = () => {
  const { user, authError, clearAuthError, refreshOwnerData } = useAuth();
  const { validateToken } = useTokenValidation();
  const [ownerData, setOwnerData] = useState(null);
  const [stats, setStats] = useState({
    customers: 0,
    items: 0,
    quotations: 0,
    bankDetails: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.owner) {
        setOwnerData(user.owner);
        fetchStats();
        setLoading(false);
      } else {
        // No owner data in user context, try to fetch it
        fetchOwnerData();
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOwnerData = async () => {
    try {
      setError(null);
      
      // Validate token before making API calls
      if (!validateToken()) {
        return;
      }
      
      const token = tokenManager.getToken();
      const response = await axios.get(`${BACKENDURL}/owners/myowner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.owner) {
        setOwnerData(response.data.owner);
        // Update user context with owner data
        await refreshOwnerData();
        fetchStats();
      } else {
        // No owner data found - user needs to create owner profile
        console.log("No owner data found, redirecting to owner creation");
        navigate("/submitownerdata");
        return;
      }
    } catch (error) {
      console.error("Error fetching owner data:", error);
      if (error.response?.status === 401) {
        // Unauthorized - redirect to login
        navigate("/login");
        return;
      }
      setError("Failed to load business profile. Please try again.");
      // If error occurs, redirect to owner creation
      navigate("/submitownerdata");
      return;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Validate token before making API calls
      if (!validateToken()) {
        return;
      }
      
      const token = tokenManager.getToken();
      
      // Get owner first to ensure we have the owner ID
      const ownerResponse = await axios.get(`${BACKENDURL}/owners/myowner`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!ownerResponse.data.owner) {
        console.log("No owner found, setting stats to 0");
        setStats({
          customers: 0,
          items: 0,
          quotations: 0,
          bankDetails: 0
        });
        return;
      }

      const ownerId = ownerResponse.data.owner.id;

      // Fetch real statistics from backend with proper error handling
      const [customersRes, itemsRes, quotationsRes, bankDetailsRes] = await Promise.allSettled([
        axios.get(`${BACKENDURL}/customer/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/iteam/viewproducts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/quotation/getdata`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/bank/bankdetails/count`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Process results and handle errors gracefully
      const newStats = {
        customers: customersRes.status === 'fulfilled' ? customersRes.value.data.length : 0,
        items: itemsRes.status === 'fulfilled' ? (itemsRes.value.data.data ? itemsRes.value.data.data.length : 0) : 0,
        quotations: quotationsRes.status === 'fulfilled' ? quotationsRes.value.data.length : 0,
        bankDetails: bankDetailsRes.status === 'fulfilled' ? bankDetailsRes.value.data.count : 0
      };

      // Debug logging for troubleshooting
      console.log('API Responses:', {
        customers: customersRes.status === 'fulfilled' ? customersRes.value.data : 'failed',
        items: itemsRes.status === 'fulfilled' ? itemsRes.value.data : 'failed',
        quotations: quotationsRes.status === 'fulfilled' ? quotationsRes.value.data : 'failed',
        bankDetails: bankDetailsRes.status === 'fulfilled' ? bankDetailsRes.value.data : 'failed'
      });
      
      console.log('Processed Stats:', newStats);

      setStats(newStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Don't show error for stats, just set to 0
      setStats({
        customers: 0,
        items: 0,
        quotations: 0,
        bankDetails: 0
      });
    }
  };

  // Function to refresh stats (can be called from other components)
  const refreshStats = () => {
    fetchStats();
  };

  // Expose refreshStats to window for external access
  React.useEffect(() => {
    window.refreshDashboardStats = refreshStats;
    return () => {
      delete window.refreshDashboardStats;
    };
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  // If no owner data exists, show onboarding flow
  if (!ownerData) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl lg:text-4xl font-bold text-zinc-900 mb-2">
                Welcome back, {user?.firstname || 'User'}! 👋
              </h1>
              <p className="text-md text-zinc-600">
                Manage your business efficiently
              </p>
            </div>
            
          </div>
        </div>

        {/* Error Display */}
        {(authError || error) && (
          <div className="mb-6">
            <div className={`p-4 rounded-lg border ${
              authError ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded-full ${
                  authError ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {authError ? (
                    <AlertTriangle className={`w-5 h-5 ${
                      authError ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${
                    authError ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {authError ? 'Authentication Issue' : 'Business Profile Issue'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    authError ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {authError || error}
                  </p>
                  <div className="mt-3 flex space-x-2">
                    {authError && (
                      <button
                        onClick={clearAuthError}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
                      >
                        Dismiss
                      </button>
                    )}
                    {error && (
                      <button
                        onClick={() => setError(null)}
                        className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
                      >
                        Dismiss
                      </button>
                    )}
                    <button
                      onClick={refreshOwnerData}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                    >
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Profile Status */}
        {ownerData && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    Business Profile Complete
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    {ownerData.compneyname} • {ownerData.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Token Information (for debugging) */}
        <div className="mb-6">
          <TokenInfo />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Customers"
            value={stats.customers}
            icon={<Users className="w-5 h-5" />}
            color="blue"
            onClick={() => navigate('/customers')}
            clickable={true}
          />
          <StatCard
            title="Products"
            value={stats.items}
            icon={<Package className="w-5 h-5" />}
            color="green"
            onClick={() => navigate('/viewproducts')}
            clickable={true}
          />
          <StatCard
            title="Quotations"
            value={stats.quotations}
            icon={<FileText className="w-5 h-5" />}
            color="purple"
            onClick={() => navigate('/fetch')}
            clickable={true}
          />
          <StatCard
            title="Bank Accounts"
            value={stats.bankDetails}
            icon={<Building2 className="w-5 h-5" />}
            color="orange"
            onClick={() => navigate('/bankdetails/list')}
            clickable={true}
          />
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Analytics & Tracking</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="Owner Dashboard"
              description="Complete business overview with tracking"
              icon={<BarChart3 className="w-6 h-6" />}
              color="blue"
              onClick={() => navigate('/owner-dashboard')}
            />
            <ActionCard
              title="Payment Tracking"
              description="Monitor payments and send reminders"
              icon={<DollarSign className="w-6 h-6" />}
              color="green"
              onClick={() => navigate('/payment-tracking')}
            />
            <ActionCard
              title="Monthly Analytics"
              description="Detailed monthly performance breakdown"
              icon={<TrendingUp className="w-6 h-6" />}
              color="purple"
              onClick={() => navigate('/monthly-analytics')}
            />
            <ActionCard
              title="Revenue Tracking"
              description="Track revenue vs collected amounts"
              icon={<Activity className="w-6 h-6" />}
              color="orange"
              onClick={() => navigate('/revenue-tracking')}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              title="Live Quotation Builder"
              description="Create quotations with real-time preview"
              icon={<FileText className="w-6 h-6" />}
              color="purple"
              onClick={() => navigate('/live-quotation')}
            />
            <ActionCard
              title="Add Customer"
              description="Register a new customer"
              icon={<Users className="w-6 h-6" />}
              color="blue"
              onClick={() => navigate('/postcustmer')}
            />
            <ActionCard
              title="Add Product"
              description="Add a new product to your inventory"
              icon={<Package className="w-6 h-6" />}
              color="green"
              onClick={() => navigate('/selectiteams')}
            />
          </div>
        </div>


      </div>
      <ToastContainer />
    </div>
  );
};

const StatCard = ({ title, value, icon, color, onClick, clickable }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200"
  };

  return (
    <Card 
      className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200"
      onClick={onClick}
      style={{ cursor: clickable ? 'pointer' : 'default' }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-500 truncate mb-2">{title}</p>
            <p className="text-3xl font-bold text-zinc-900">
              {value}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ml-4 flex-shrink-0 border ${colorClasses[color]}`}>
            <div>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActionCard = ({ title, description, icon, color, onClick }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200"
  };

  return (
    <Card 
      className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">{title}</h3>
            <p className="text-sm text-zinc-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDashboard;