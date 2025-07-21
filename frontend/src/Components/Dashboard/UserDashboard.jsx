import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BusinessDetailsCard from "./BusinessDetailsCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Users, 
  Package, 
  FileText, 
  Building2, 
  Plus, 
  Search, 
  ArrowRight,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Landmark,
  MapPin
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
      const token = Cookies.get('token');
      // Fetch real statistics from backend
      const [customersRes, itemsRes, quotationsRes, bankDetailsRes] = await Promise.allSettled([
        axios.get(`${BACKENDURL}/customer/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/items/items`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/quotation/quotations`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/bank/bankdetails`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats({
        customers: customersRes.status === 'fulfilled' ? customersRes.value.data.length : 0,
        items: itemsRes.status === 'fulfilled' ? itemsRes.value.data.length : 0,
        quotations: quotationsRes.status === 'fulfilled' ? quotationsRes.value.data.length : 0,
        bankDetails: bankDetailsRes.status === 'fulfilled' ? bankDetailsRes.value.data.length : 0
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
    }
  };

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
              <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-2">
                Welcome back, {user?.firstname || 'User'}! 👋
              </h1>
              <p className="text-lg text-zinc-600">
                Manage your business efficiently
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">
                  {user?.firstname?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-zinc-900 text-base truncate">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-sm text-zinc-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Details Card */}
        {ownerData ? (
          <div className="mb-8">
            <BusinessDetailsCard 
              ownerData={ownerData} 
              onEdit={handleEditOwner}
            />
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white mb-8">
            <CardContent className="p-8">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">Complete Your Profile</h3>
                  <p className="text-zinc-600 mb-4">
                    Please register your business details to get started with invoice generation.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-zinc-200 hover:bg-zinc-50"
                    onClick={() => window.location.href = '/submitownerdata'}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Register Business
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Customers"
            value={stats.customers}
            icon={<Users className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Products"
            value={stats.items}
            icon={<Package className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            title="Quotations"
            value={stats.quotations}
            icon={<FileText className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            title="Bank Accounts"
            value={stats.bankDetails}
            icon={<Building2 className="w-5 h-5" />}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Add Customer"
            description="Register a new customer"
            icon={<User className="w-5 h-5" />}
            link="/postcustmer"
          />
          <QuickActionCard
            title="Add Product"
            description="Add new product to inventory"
            icon={<Package className="w-5 h-5" />}
            link="/selectiteams"
          />
          <QuickActionCard
            title="Create Quotation"
            description="Generate a new quotation"
            icon={<FileText className="w-5 h-5" />}
            link="/postquation"
          />
          <QuickActionCard
            title="Bank Details"
            description="Manage bank account details"
            icon={<Building2 className="w-5 h-5" />}
            link="/bankdetails"
          />
          <QuickActionCard
            title="View All Items"
            description="Browse your product catalog"
            icon={<Package className="w-5 h-5" />}
            link="/getalliteams"
          />
          <QuickActionCard
            title="Fetch Quotations"
            description="View and manage quotations"
            icon={<Search className="w-5 h-5" />}
            link="/fetch"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
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
            <p className="text-3xl font-bold text-zinc-900">{value}</p>
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

const QuickActionCard = ({ title, description, icon, link }) => (
  <Card 
    className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200 cursor-pointer group"
    onClick={() => window.location.href = link}
  >
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-zinc-200 transition-colors duration-200 flex-shrink-0">
          <div className="text-zinc-600">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors duration-200 truncate">
            {title}
          </h3>
          <p className="text-sm text-zinc-500 mt-1 truncate">{description}</p>
        </div>
        <div className="text-zinc-400 group-hover:text-zinc-600 transition-colors duration-200 flex-shrink-0">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default UserDashboard; 