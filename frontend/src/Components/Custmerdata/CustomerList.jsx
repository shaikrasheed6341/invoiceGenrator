import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import tokenManager from "../../utils/tokenManager";
import { Edit, Trash2, User, Phone, MapPin, Building2, FileText } from "lucide-react";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = tokenManager.getToken();
      
      if (!token) {
        toast.error("Please login first");
        navigate('/login');
        return;
      }

      const response = await axios.get(`${BACKENDURL}/customer/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setCustomers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.response?.data?.message || "Failed to fetch customers");
      toast.error(err.response?.data?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const handleDelete = async (customerId, customerName) => {
    if (!window.confirm(`Are you sure you want to delete ${customerName}?`)) {
      return;
    }

    try {
      const token = tokenManager.getToken();
      const response = await axios.delete(`${BACKENDURL}/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success("Customer deleted successfully");
      fetchCustomers(); // Refresh the list
      
      // Refresh dashboard stats
      if (window.refreshDashboardStats) {
        window.refreshDashboardStats();
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
      toast.error(err.response?.data?.message || "Failed to delete customer");
    }
  };

  // Edit customer
  const handleEdit = (customer) => {
    // Navigate to update page with customer data
    navigate('/updatecustmer', { 
      state: { 
        customer,
        isEditing: true 
      } 
    });
  };

  // Function to refresh customer list (can be called from other components)
  const refreshCustomerList = () => {
    fetchCustomers();
  };

  // Expose refreshCustomerList to window for external access
  React.useEffect(() => {
    window.refreshCustomerList = refreshCustomerList;
    return () => {
      delete window.refreshCustomerList;
    };
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-zinc-600">{error}</p>
          <button 
            onClick={fetchCustomers}
            className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-6 sm:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-3">
                Customer Management 👥
              </h1>
              <p className="text-sm text-zinc-600 font-medium">
                {customers.length} customer{customers.length !== 1 ? 's' : ''} in your database
              </p>
            </div>
            <button
              onClick={() => navigate('/postcustmer')}
              className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white px-8 py-4 rounded-2xl hover:from-zinc-800 hover:to-zinc-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl font-semibold"
            >
              + Add Customer
            </button>
          </div>
        </div>

        {/* Customer Cards Grid */}
        {customers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">No Customers Found</h3>
            <p className="text-zinc-600 mb-6">Start by adding your first customer</p>
            <button
              onClick={() => navigate('/postcustmer')}
              className="bg-zinc-900 text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition-all duration-300"
            >
              Add Your First Customer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

// Customer Card Component
const CustomerCard = ({ customer, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden group">
      {/* Card Header */}
      <div className="900 text-white p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 flex   items-center justify-between">
          <div className="flex items-center  space-x-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-0.5">{customer.name}</h3>
              <p className="text-xs text-zinc-500 font-medium">ID: {customer.id}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(customer)}
              className="p-2 bg-zinc-900 backdrop-blur-sm rounded-lg hover:bg-white/25 transition-all duration-300 border border-white/20 group-hover:scale-105"
              title="Edit Customer"
            >
              <Edit className="w-3.5 h-3.5  text-white" />
            </button>
            <button
              onClick={() => onDelete(customer.id, customer.name)}
              className="p-2 bg-red-500 backdrop-blur-sm rounded-lg hover:bg-red-700 transition-all duration-300 border border-red-500/30 group-hover:scale-105"
              title="Delete Customer"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        

        {/* Phone, GST, PAN in a row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Phone Number */}
          <div className="group/item">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center group-hover/item:bg-zinc-100 transition-colors">
                <Phone className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="text-xs font-semibold text-gray-900 truncate">{customer.phone}</p>
              </div>
            </div>
          </div>

          {/* GST Number */}
          <div className="group/item">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center group-hover/item:bg-zinc-100 transition-colors">
                <Building2 className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">GST</p>
                <p className="text-xs font-semibold text-gray-900 font-mono truncate">{customer.gstnumber}</p>
              </div>
            </div>
          </div>

          {/* PAN Number */}
          <div className="group/item">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center group-hover/item:bg-zinc-100 transition-colors">
                <FileText className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">PAN</p>
                <p className="text-xs font-semibold text-gray-900 font-mono truncate">{customer.pannumber}</p>
              </div>
            </div>
          </div>
        </div>
{/* Address Details */}
<div className="flex items-start space-x-3 group/item mt-4">
          <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center group-hover/item:bg-zinc-100 transition-colors mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Address</p>
            <div className="text-sm font-semibold text-gray-900 leading-relaxed">
              {customer.recipientName && <p>{customer.recipientName}</p>}
              {customer.houseNumber && <p>{customer.houseNumber}</p>}
              {customer.streetName && <p>{customer.streetName}</p>}
              {customer.locality && <p>{customer.locality}</p>}
              {customer.city && customer.pinCode && <p>{customer.city} - {customer.pinCode}</p>}
              {customer.state && <p>{customer.state}</p>}
            </div>
          </div>
        </div>
        {/* Created Date */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">
              Created: {new Date(customer.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList; 