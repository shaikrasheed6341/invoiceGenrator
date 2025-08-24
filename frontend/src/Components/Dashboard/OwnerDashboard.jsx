import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import tokenManager from "../../utils/tokenManager";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent } from "../ui/card";
import { 
  Users, 
  Package, 
  FileText, 
  Building2, 
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Check
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStatusDropdown && !event.target.closest('.status-dropdown')) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  const fetchDashboardData = async () => {
    try {
      const token = tokenManager.getToken();
      console.log("Fetching dashboard data...");
      console.log("Token:", token);
      console.log("Backend URL:", BACKENDURL);
      
      const response = await axios.get(`${BACKENDURL}/analytics/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Dashboard response:", response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      console.error("Error details:", error.response?.data);
      toast.error(`Failed to load dashboard data: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (quotationId, newStatus) => {
    try {
      setUpdatingStatus(quotationId);
      const token = tokenManager.getToken();
      
      const response = await axios.patch(`${BACKENDURL}/analytics/update-payment-status`, {
        quotationId,
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success(`Payment status updated to ${newStatus}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error(`Failed to update payment status: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingStatus(null);
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

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-900 mb-4">Owner Dashboard</h1>
            <p className="text-zinc-600 mb-4">No analytics data available yet.</p>
            <div className="space-y-4">
              <p className="text-sm text-zinc-500">To see analytics data, you need to:</p>
              <ul className="text-sm text-zinc-500 space-y-2">
                <li>• Create your first quotation</li>
                <li>• Add some customers</li>
                <li>• Add some products</li>
                <li>• Generate some revenue</li>
              </ul>
              <div className="mt-6">
                <button
                  onClick={() => window.location.href = '/live-quotation'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Quotation
                </button>
              </div>
            </div>
          </div>
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
                Welcome back, {dashboardData.owner.name}! 
              </h1>
              <p className="text-md text-zinc-600">
                {dashboardData.owner.companyName} • Complete Business Overview
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/live-quotation')}
                className="bg-slate-900 text-white px-4 py-4 mx-6 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Create Quotation
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'revenue', label: 'Revenue', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'payments', label: 'Payments', icon: <Clock className="w-4 h-4" /> },
              { id: 'growth', label: 'Growth', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(dashboardData.overview.totalRevenue)}
                icon={<DollarSign className="w-5 h-5" />}
                color="green"
                trend="+12.5%"
                trendUp={true}
              />
              <MetricCard
                title="Amount Collected"
                value={formatCurrency(dashboardData.overview.totalCollected)}
                icon={<CheckCircle className="w-5 h-5" />}
                color="blue"
                trend="+8.2%"
                trendUp={true}
              />
              <MetricCard
                title="Pending Amount"
                value={formatCurrency(dashboardData.overview.totalPending)}
                icon={<Clock className="w-5 h-5" />}
                color="orange"
                trend="-3.1%"
                trendUp={false}
              />
              <MetricCard
                title="Total Quotations"
                value={dashboardData.overview.totalQuotations}
                icon={<FileText className="w-5 h-5" />}
                color="purple"
                trend="+15.3%"
                trendUp={true}
              />
            </div>

            {/* Business Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Business Stats</h3>
                    <Users className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Total Customers</span>
                      <span className="font-semibold">{dashboardData.overview.totalCustomers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Total Products</span>
                      <span className="font-semibold">{dashboardData.overview.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Bank Accounts</span>
                      <span className="font-semibold">{dashboardData.overview.totalBankAccounts || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Payment Status</h3>
                    <PieChart className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Paid</span>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{dashboardData.paymentStatus.paid.count}</div>
                        <div className="text-xs text-green-500">{formatCurrency(dashboardData.paymentStatus.paid.amount)}</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Pending</span>
                      <div className="text-right">
                        <div className="font-semibold text-orange-600">{dashboardData.paymentStatus.pending.count}</div>
                        <div className="text-xs text-orange-500">{formatCurrency(dashboardData.paymentStatus.pending.amount)}</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Overdue</span>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">{dashboardData.paymentStatus.overdue.count}</div>
                        <div className="text-xs text-red-500">{formatCurrency(dashboardData.paymentStatus.overdue.amount)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Recent Activity</h3>
                    <Activity className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Last Quotation</span>
                      <span className="font-semibold text-sm">
                        {dashboardData.recentActivity.quotations[0] 
                          ? `#${dashboardData.recentActivity.quotations[0].number}`
                          : 'None'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Overdue Payments</span>
                      <span className="font-semibold text-red-600">
                        {dashboardData.recentActivity.overduePayments.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Quotations */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-zinc-900">Recent Quotations</h3>
                  <div className="flex items-center space-x-4">
                    {/* Status Filter Dropdown */}
                    <div className="relative status-dropdown">
                      <button
                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="flex items-center space-x-2 px-3 py-2 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
                      >
                        <span className="text-sm font-medium">
                          {statusFilter === 'PENDING' ? 'Pending' : 'Completed'}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {showStatusDropdown && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          <button
                            onClick={() => {
                              setStatusFilter('PENDING');
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                              statusFilter === 'PENDING' ? 'bg-blue-50 text-blue-700' : 'text-zinc-700'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => {
                              setStatusFilter('PAID');
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                              statusFilter === 'PAID' ? 'bg-blue-50 text-blue-700' : 'text-zinc-700'
                            }`}
                          >
                            Completed
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => navigate('/fetch')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {dashboardData.recentActivity.quotations
                    .filter(quotation => {
                      const paymentStatus = quotation.payment?.status || 'PENDING';
                      return statusFilter === 'PENDING' ? paymentStatus === 'PENDING' : paymentStatus === 'PAID';
                    })
                    .slice(0, 5)
                    .map((quotation) => (
                    <div key={quotation.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                      <div>
                        <button
                          onClick={() => navigate('/fetch', { state: { quotationNumber: quotation.number } })}
                          className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          #{quotation.number}
                        </button>
                        <div className="text-sm text-zinc-600">{quotation.customer.name}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(quotation.items.reduce((sum, qi) => 
                              sum + (qi.item.rate * qi.quantity * (1 + qi.tax / 100)), 0
                            ))}
                          </div>
                          <div className={`text-sm ${
                            quotation.payment?.status === 'PAID' ? 'text-green-600' : 
                            quotation.payment?.status === 'OVERDUE' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {quotation.payment?.status || 'PENDING'}
                          </div>
                        </div>
                        
                        {/* Mark as Completed Button */}
                        {quotation.payment?.status !== 'PAID' && (
                          <button
                            onClick={() => updatePaymentStatus(quotation.id, 'PAID')}
                            disabled={updatingStatus === quotation.id}
                            className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                          >
                            {updatingStatus === quotation.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-green-600"></div>
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            <span className="text-xs">Mark Complete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {dashboardData.recentActivity.quotations
                    .filter(quotation => {
                      const paymentStatus = quotation.payment?.status || 'PENDING';
                      return statusFilter === 'PENDING' ? paymentStatus === 'PENDING' : paymentStatus === 'PAID';
                    }).length === 0 && (
                    <div className="text-center py-4 text-zinc-500">
                      No {statusFilter === 'PENDING' ? 'pending' : 'completed'} quotations found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <RevenueTab dashboardData={dashboardData} formatCurrency={formatCurrency} />
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <PaymentsTab dashboardData={dashboardData} formatCurrency={formatCurrency} formatDate={formatDate} />
        )}

        {/* Growth Tab */}
        {activeTab === 'growth' && (
          <GrowthTab dashboardData={dashboardData} />
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <ActivityTab dashboardData={dashboardData} formatDate={formatDate} />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

const MetricCard = ({ title, value, icon, color, trend, trendUp }) => {
  const colorClasses = {
    green: "bg-green-50 text-green-600 border-green-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  };

  return (
    <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-500 truncate mb-2">{title}</p>
            <p className="text-2xl font-bold text-zinc-900 mb-1">{value}</p>
            <div className="flex items-center space-x-1">
              {trendUp ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend}
              </span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ml-4 flex-shrink-0 border ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RevenueTab = ({ dashboardData, formatCurrency }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Revenue Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Total Revenue</span>
                <span className="font-bold text-lg">{formatCurrency(dashboardData.overview.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Collected</span>
                <span className="font-bold text-green-600">{formatCurrency(dashboardData.overview.totalCollected)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Pending</span>
                <span className="font-bold text-orange-600">{formatCurrency(dashboardData.overview.totalPending)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Collection Rate</span>
                  <span className="font-bold">
                    {dashboardData.overview.totalRevenue > 0 
                      ? `${((dashboardData.overview.totalCollected / dashboardData.overview.totalRevenue) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Monthly Breakdown</h3>
            <div className="space-y-3">
              {dashboardData.monthlyBreakdown.slice(0, 6).map((month) => (
                <div key={`${month.year}-${month.month}`} className="flex justify-between items-center">
                  <span className="text-zinc-600">
                    {new Date(month.year, month.month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <span className="font-semibold">{formatCurrency(month.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PaymentsTab = ({ dashboardData, formatCurrency, formatDate }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Payment Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Paid</span>
                <div className="text-right">
                  <div className="font-bold text-green-600">{dashboardData.paymentStatus.paid.count}</div>
                  <div className="text-xs text-green-500">{formatCurrency(dashboardData.paymentStatus.paid.amount)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Pending</span>
                <div className="text-right">
                  <div className="font-bold text-orange-600">{dashboardData.paymentStatus.pending.count}</div>
                  <div className="text-xs text-orange-500">{formatCurrency(dashboardData.paymentStatus.pending.amount)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Overdue</span>
                <div className="text-right">
                  <div className="font-bold text-red-600">{dashboardData.paymentStatus.overdue.count}</div>
                  <div className="text-xs text-red-500">{formatCurrency(dashboardData.paymentStatus.overdue.amount)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Partial</span>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{dashboardData.paymentStatus.partial.count}</div>
                  <div className="text-xs text-blue-500">{formatCurrency(dashboardData.paymentStatus.partial.amount)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Overdue Payments</h3>
            <div className="space-y-3">
              {dashboardData.recentActivity.overduePayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium">#{payment.quotation.number}</div>
                    <div className="text-sm text-zinc-600">{payment.quotation.customer.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">{formatCurrency(payment.amount)}</div>
                    <div className="text-sm text-red-600">
                      Due: {formatDate(payment.dueDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const GrowthTab = ({ dashboardData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900">Customer Growth</h3>
              <Users className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 mb-2">
              {dashboardData.overview.totalCustomers}
            </div>
            <p className="text-sm text-zinc-600">Total customers registered</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900">Product Growth</h3>
              <Package className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 mb-2">
              {dashboardData.overview.totalItems}
            </div>
            <p className="text-sm text-zinc-600">Total products in inventory</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900">Quotation Growth</h3>
              <FileText className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="text-3xl font-bold text-zinc-900 mb-2">
              {dashboardData.overview.totalQuotations}
            </div>
            <p className="text-sm text-zinc-600">Total quotations created</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ActivityTab = ({ dashboardData, formatDate }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {dashboardData.recentActivity.quotations.slice(0, 10).map((quotation) => (
              <div key={quotation.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <button
                      onClick={() => navigate('/fetch', { state: { quotationNumber: quotation.number } })}
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Quotation #{quotation.number}
                    </button>
                    <div className="text-sm text-zinc-600">
                      {quotation.customer.name} • {formatDate(quotation.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ₹{quotation.items.reduce((sum, qi) => 
                      sum + (qi.item.rate * qi.quantity * (1 + qi.tax / 100)), 0
                    ).toFixed(0)}
                  </div>
                  <div className={`text-sm ${
                    quotation.payment?.status === 'PAID' ? 'text-green-600' : 
                    quotation.payment?.status === 'OVERDUE' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {quotation.payment?.status || 'PENDING'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard; 