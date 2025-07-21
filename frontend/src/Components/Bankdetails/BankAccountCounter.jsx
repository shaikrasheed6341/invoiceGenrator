import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, CardContent } from '../ui/card';
import { Building2 } from 'lucide-react';

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const BankAccountCounter = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBankAccountCount();
  }, []);

  const fetchBankAccountCount = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BACKENDURL}/bank/bankdetails/count`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching bank account count:", error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Refresh count when called from parent
  const refreshCount = () => {
    fetchBankAccountCount();
  };

  // Expose refresh function to parent
  React.useEffect(() => {
    window.refreshBankAccountCount = refreshCount;
    return () => {
      delete window.refreshBankAccountCount;
    };
  }, []);

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-zinc-200 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-zinc-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Bank Accounts</p>
              <p className="text-2xl font-bold text-zinc-900">{count}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">
              {count === 0 ? 'No accounts' : 
               count === 1 ? '1 account' : 
               `${count} accounts`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankAccountCounter; 