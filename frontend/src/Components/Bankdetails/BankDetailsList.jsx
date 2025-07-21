import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building2, Plus, Edit, Trash2, CreditCard, User, MapPin, Landmark } from 'lucide-react';

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const BankDetailsList = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BACKENDURL}/bank/bankdetails`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.bankDetails) {
        setBankAccounts(response.data.bankDetails);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      toast.error("Failed to fetch bank accounts", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBankAccount = () => {
    navigate('/bankdetails');
  };

  const handleEditBankAccount = (accountId) => {
    navigate(`/bankdetails/edit/${accountId}`);
  };

  const handleDeleteBankAccount = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      try {
        const token = Cookies.get('token');
        await axios.delete(`${BACKENDURL}/bank/bankdetails/${accountId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        toast.success("Bank account deleted successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
        
        fetchBankAccounts(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete bank account", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading bank accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl lg:text-4xl font-bold text-zinc-900 mb-2">
                Bank Details Management
              </h1>
              <p className="text-md text-zinc-600">
                Manage your business bank accounts
              </p>
            </div>
            <Button
              onClick={handleAddBankAccount}
              className="bg-zinc-900 hover:bg-zinc-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </Button>
          </div>
        </div>

        {/* Bank Accounts List */}
        {bankAccounts.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">No Bank Accounts</h3>
              <p className="text-zinc-500 mb-6">You haven't added any bank accounts yet.</p>
              <Button
                onClick={handleAddBankAccount}
                className="bg-zinc-900 hover:bg-zinc-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Bank Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankAccounts.map((account) => (
              <BankAccountCard
                key={account.id}
                account={account}
                onEdit={handleEditBankAccount}
                onDelete={handleDeleteBankAccount}
              />
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

const BankAccountCard = ({ account, onEdit, onDelete }) => (
  <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-zinc-900">{account.bank}</CardTitle>
            <p className="text-xs text-zinc-500 mt-1">{account.name}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">Active</Badge>
      </div>
    </CardHeader>
    
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-600 font-mono">
            **** **** **** {account.accountno.slice(-4)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-600">IFSC: {account.ifsccode}</span>
        </div>
        
        {account.upid && (
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-600">UPI: {account.upid}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(account.id)}
            className="flex-1 border-zinc-200 hover:bg-zinc-50"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(account.id)}
            className="border-red-200 hover:bg-red-50 text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default BankDetailsList; 