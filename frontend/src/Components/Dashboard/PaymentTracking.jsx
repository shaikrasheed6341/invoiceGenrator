import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent } from "../ui/card";
import { 
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  Bell,
  Send,
  Eye,
  Filter
} from 'lucide-react';

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const PaymentTracking = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const token = Cookies.get('token');
      console.log("Fetching payment data...");
      
      const [paymentsRes, remindersRes] = await Promise.all([
        axios.get(`${BACKENDURL}/analytics/payments`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/analytics/reminders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      console.log("Payments response:", paymentsRes.data);
      console.log("Reminders response:", remindersRes.data);
      
      setPayments(paymentsRes.data.payments);
      setReminders(remindersRes.data.reminders);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      console.error("Error details:", error.response?.data);
      toast.error(`Failed to load payment data: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-orange-600 bg-orange-100';
      case 'OVERDUE':
        return 'text-red-600 bg-red-100';
      case 'PARTIAL':
        return 'text-blue-600 bg-blue-100';
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'OVERDUE':
        return <AlertTriangle className="w-4 h-4" />;
      case 'PARTIAL':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const sendReminder = async (paymentId) => {
    try {
      const token = Cookies.get('token');
      await axios.post(`${BACKENDURL}/analytics/send-reminder`, {
        paymentId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Payment reminder sent successfully");
      fetchPaymentData(); // Refresh data
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Failed to send reminder");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-zinc-900 mb-2">
            Payment Tracking
          </h1>
          <p className="text-md text-zinc-600">
            Monitor payment status, overdue payments, and automated reminders
          </p>
        </div>

        {payments.length === 0 && !loading && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">No Payment Data Available</h2>
            <p className="text-zinc-600 mb-4">No payment records found. This could be because:</p>
            <ul className="text-sm text-zinc-500 space-y-2 mb-6">
              <li>• No quotations have been created yet</li>
              <li>• No payments have been recorded</li>
              <li>• You need to create quotations first</li>
            </ul>
            <button
              onClick={() => window.location.href = '/live-quotation'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Quotation
            </button>
          </div>
        )}

        {payments.length > 0 && (
          <>
            {/* Payment Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Payments"
                value={payments.length}
                icon={<DollarSign className="w-5 h-5" />}
                color="blue"
              />
              <StatCard
                title="Paid"
                value={payments.filter(p => p.status === 'PAID').length}
                icon={<CheckCircle className="w-5 h-5" />}
                color="green"
              />
              <StatCard
                title="Pending"
                value={payments.filter(p => p.status === 'PENDING').length}
                icon={<Clock className="w-5 h-5" />}
                color="orange"
              />
              <StatCard
                title="Overdue"
                value={payments.filter(p => p.status === 'OVERDUE').length}
                icon={<AlertTriangle className="w-5 h-5" />}
                color="red"
              />
            </div>

        {/* Filter Controls */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-zinc-600" />
              <span className="text-sm font-medium text-zinc-600">Filter:</span>
            </div>
            <div className="flex space-x-2">
              {['all', 'PAID', 'PENDING', 'OVERDUE', 'PARTIAL'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-white text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payments */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-900">Payments</h3>
                <span className="text-sm text-zinc-600">{filteredPayments.length} payments</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="text-sm text-zinc-600">
                      Quotation #{payment.quotation.number} • {payment.quotation.customer.name}
                    </div>
                    {payment.dueDate && (
                      <div className="text-sm text-zinc-500 mt-1">
                        Due: {formatDate(payment.dueDate)}
                      </div>
                    )}
                    {payment.paidAt && (
                      <div className="text-sm text-green-600 mt-1">
                        Paid: {formatDate(payment.paidAt)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Payment Details</h3>
              {selectedPayment ? (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Quotation #{selectedPayment.quotation.number}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-600 mb-2">
                      Customer: {selectedPayment.quotation.customer.name}
                    </div>
                    <div className="text-lg font-bold text-zinc-900 mb-2">
                      {formatCurrency(selectedPayment.amount)}
                    </div>
                    {selectedPayment.dueDate && (
                      <div className="text-sm text-zinc-500">
                        Due Date: {formatDate(selectedPayment.dueDate)}
                      </div>
                    )}
                    {selectedPayment.paidAt && (
                      <div className="text-sm text-green-600">
                        Paid Date: {formatDate(selectedPayment.paidAt)}
                      </div>
                    )}
                    {selectedPayment.paymentMethod && (
                      <div className="text-sm text-zinc-500">
                        Method: {selectedPayment.paymentMethod}
                      </div>
                    )}
                  </div>

                  {/* Reminders */}
                  <div>
                    <h4 className="font-medium text-zinc-900 mb-2">Payment Reminders</h4>
                    <div className="space-y-2">
                      {selectedPayment.reminders?.map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between p-2 bg-zinc-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-4 h-4 text-zinc-400" />
                            <span className="text-sm">{reminder.type}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            reminder.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                            reminder.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {reminder.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {selectedPayment.status !== 'PAID' && (
                      <button
                        onClick={() => sendReminder(selectedPayment.id)}
                        className="mt-3 w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Reminder</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-zinc-500 py-8">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-zinc-300" />
                  <p>Select a payment to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reminders History */}
        <Card className="border-0 shadow-lg bg-white mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Reminders History</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="font-medium">
                        Quotation #{reminder.payment.quotation.number}
                      </div>
                      <div className="text-sm text-zinc-600">
                        {reminder.payment.quotation.customer.name} • {reminder.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(reminder.payment.amount)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      reminder.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                      reminder.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {reminder.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
            </Card>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200"
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
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTracking; 