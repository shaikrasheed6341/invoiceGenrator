import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BusinessDetailsCard from "./BusinessDetailsCard";
import BankAccountCounter from "../Bankdetails/BankAccountCounter";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Users, 
  Package, 
  FileText, 
  Building2, 
  Plus, 
  AlertTriangle,
  Edit
} from 'lucide-react';

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UserDashboard = () => {
  const { user } = useAuth();
  const [ownerData, setOwnerData] = useState(null);
  const [stats, setStats] = useState({
    customers: 0,
    items: 0,
    quotations: 0,
    bankDetails: 0
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BACKENDURL}/owners/myowner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.owner) {
        setOwnerData(response.data.owner);
        fetchStats();
      }
    } catch (error) {
      console.error("Error fetching owner data:", error);
      // If owner not found, that's okay - user might not have registered yet
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const token = Cookies.get('token');
      
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
        axios.get(`${BACKENDURL}/items/getalliteamdata`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/quotation/getdata`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/bank/bankdetails`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log("Stats responses:", {
        customers: customersRes,
        items: itemsRes,
        quotations: quotationsRes,
        bankDetails: bankDetailsRes
      });

      setStats({
        customers: customersRes.status === 'fulfilled' ? customersRes.value.data.length : 0,
        items: itemsRes.status === 'fulfilled' ? itemsRes.value.data.length : 0,
        quotations: quotationsRes.status === 'fulfilled' ? quotationsRes.value.data.length : 0,
        bankDetails: bankDetailsRes.status === 'fulfilled' ? bankDetailsRes.value.bankDetails?.length || 0 : 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback to placeholder data
      setStats({
        customers: 0,
        items: 0,
        quotations: 0,
        bankDetails: 0
      });
    } finally {
      setStatsLoading(false);
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

  const handleEditOwner = () => {
    // Navigate to owner update page
    window.location.href = '/updateowner';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading your dashboard...</p>
        </div>
      </div>
    );
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



        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Customers"
            value={stats.customers}
            icon={<Users className="w-5 h-5" />}
            color="blue"
            loading={statsLoading}
          />
          <StatCard
            title="Products"
            value={stats.items}
            icon={<Package className="w-5 h-5" />}
            color="green"
            loading={statsLoading}
          />
          <StatCard
            title="Quotations"
            value={stats.quotations}
            icon={<FileText className="w-5 h-5" />}
            color="purple"
            loading={statsLoading}
          />
          <StatCard
            title="Bank Accounts"
            value={stats.bankDetails}
            icon={<Building2 className="w-5 h-5" />}
            color="orange"
            loading={statsLoading}
          />
        </div>


      </div>
      <ToastContainer />
    </div>
  );
};

const StatCard = ({ title, value, icon, color, loading }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200"
  };

  return (
    <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-500 truncate mb-2">{title}</p>
            <p className="text-3xl font-bold text-zinc-900">
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                value
              )}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ml-4 flex-shrink-0 border ${colorClasses[color]} ${loading ? 'animate-pulse' : ''}`}>
            <div>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDashboard;