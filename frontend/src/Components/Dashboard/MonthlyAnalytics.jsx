import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent } from "../ui/card";
import { 
  TrendingUp,
  DollarSign,
  FileText,
  Users,
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const MonthlyAnalytics = () => {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchMonthlyData();
  }, [selectedYear, selectedMonth]);

  const fetchMonthlyData = async () => {
    try {
      const token = Cookies.get('token');
      console.log("Fetching monthly data for:", selectedYear, selectedMonth);
      
      const [monthlyRes, growthRes] = await Promise.all([
        axios.get(`${BACKENDURL}/analytics/monthly/${selectedYear}/${selectedMonth}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BACKENDURL}/analytics/growth`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      console.log("Monthly data response:", monthlyRes.data);
      console.log("Growth data response:", growthRes.data);
      
      setMonthlyData(monthlyRes.data);
      setGrowthData(growthRes.data);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
      console.error("Error details:", error.response?.data);
      toast.error(`Failed to load monthly analytics: ${error.response?.data?.message || error.message}`);
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

  const getMonthName = (month) => {
    return new Date(2024, month - 1).toLocaleDateString('en-US', { month: 'long' });
  };

  const getGrowthPercentage = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading monthly analytics...</p>
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
            Monthly Analytics
          </h1>
          <p className="text-md text-zinc-600">
            Detailed breakdown of your business performance
          </p>
        </div>

        {/* Month/Year Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-zinc-600" />
              <span className="text-sm font-medium text-zinc-600">Select Period:</span>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-zinc-300 rounded-md text-sm"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-zinc-300 rounded-md text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{getMonthName(month)}</option>
              ))}
            </select>
          </div>
        </div>

        {monthlyData && monthlyData.quotations.total > 0 ? (
          <>
            {/* Monthly Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Monthly Revenue"
                value={formatCurrency(monthlyData.quotations.revenue)}
                icon={<DollarSign className="w-5 h-5" />}
                color="green"
                trend="+12.5%"
                trendUp={true}
              />
              <MetricCard
                title="Quotations Created"
                value={monthlyData.quotations.total}
                icon={<FileText className="w-5 h-5" />}
                color="blue"
                trend="+8.2%"
                trendUp={true}
              />
              <MetricCard
                title="New Customers"
                value={monthlyData.growth.newCustomers}
                icon={<Users className="w-5 h-5" />}
                color="purple"
                trend="+15.3%"
                trendUp={true}
              />
              <MetricCard
                title="New Products"
                value={monthlyData.growth.newItems}
                icon={<Package className="w-5 h-5" />}
                color="orange"
                trend="+5.7%"
                trendUp={true}
              />
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Quotations Breakdown */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Quotations Breakdown</h3>
                    <FileText className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Total Quotations</span>
                      <span className="font-bold">{monthlyData.quotations.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Paid Quotations</span>
                      <span className="font-bold text-green-600">{monthlyData.quotations.paid}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Pending Quotations</span>
                      <span className="font-bold text-orange-600">{monthlyData.quotations.pending}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600">Payment Rate</span>
                        <span className="font-bold">
                          {monthlyData.quotations.total > 0 
                            ? `${((monthlyData.quotations.paid / monthlyData.quotations.total) * 100).toFixed(1)}%`
                            : '0%'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Payment Methods</h3>
                    <PieChart className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-3">
                    {Object.entries(monthlyData.payments.byMethod || {}).map(([method, amount]) => (
                      <div key={method} className="flex justify-between items-center">
                        <span className="text-zinc-600 capitalize">{method.replace('_', ' ')}</span>
                        <span className="font-semibold">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                    {Object.keys(monthlyData.payments.byMethod || {}).length === 0 && (
                      <div className="text-center text-zinc-500 py-4">
                        No payment data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Quotations */}
            <Card className="border-0 shadow-lg bg-white mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">Recent Quotations</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {monthlyData.details.quotations.slice(0, 10).map((quotation) => (
                    <div key={quotation.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                      <div>
                        <div className="font-medium">#{quotation.number}</div>
                        <div className="text-sm text-zinc-600">{quotation.customer.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(quotation.items.reduce((sum, qi) => 
                            sum + (qi.item.rate * qi.quantity * (1 + qi.item.tax / 100)), 0
                          ))}
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
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">No Monthly Data Available</h2>
            <p className="text-zinc-600 mb-4">No data found for {getMonthName(selectedMonth)} {selectedYear}. This could be because:</p>
            <ul className="text-sm text-zinc-500 space-y-2 mb-6">
              <li>• No quotations were created in this month</li>
              <li>• No revenue was generated in this period</li>
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

        {/* Growth Trends */}
        {growthData && (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Growth Trends (Last 12 Months)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-zinc-900 mb-3">Customer Growth</h4>
                  <div className="space-y-2">
                    {growthData.monthlyGrowth.slice(-6).map((month) => (
                      <div key={`${month.year}-${month.month}`} className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">
                          {new Date(month.year, month.month - 1).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="font-medium">{month.customers}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 mb-3">Product Growth</h4>
                  <div className="space-y-2">
                    {growthData.monthlyGrowth.slice(-6).map((month) => (
                      <div key={`${month.year}-${month.month}`} className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">
                          {new Date(month.year, month.month - 1).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="font-medium">{month.items}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 mb-3">Quotation Growth</h4>
                  <div className="space-y-2">
                    {growthData.monthlyGrowth.slice(-6).map((month) => (
                      <div key={`${month.year}-${month.month}`} className="flex justify-between items-center">
                        <span className="text-sm text-zinc-600">
                          {new Date(month.year, month.month - 1).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="font-medium">{month.quotations}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200"
  };

  return (
    <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-500 truncate mb-2">{title}</p>
            <p className="text-2xl font-bold text-zinc-900 mb-1">{value}</p>
            {trend && (
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
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ml-4 flex-shrink-0 border ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyAnalytics; 