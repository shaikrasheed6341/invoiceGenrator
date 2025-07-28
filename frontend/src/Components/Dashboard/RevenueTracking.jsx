import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent } from "../ui/card";
import { 
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  ArrowLeft
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const RevenueTracking = () => {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [chartPeriod, setChartPeriod] = useState('monthly');

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const token = Cookies.get('token');
      console.log("Fetching revenue data...");
      
      const response = await axios.get(`${BACKENDURL}/analytics/revenue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Revenue response:", response.data);
      setRevenueData(response.data);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      console.error("Error details:", error.response?.data);
      toast.error(`Failed to load revenue data: ${error.response?.data?.message || error.message}`);
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

  const filteredRevenue = revenueData?.details?.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  }) || [];

  // Prepare chart data
  const prepareChartData = () => {
    if (!revenueData?.details) return null;

    const monthlyData = {};
    const statusData = {
      PAID: 0,
      PENDING: 0,
      OVERDUE: 0,
      PARTIAL: 0
    };

    revenueData.details.forEach(item => {
      const date = new Date(item.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          total: 0,
          collected: 0,
          pending: 0
        };
      }
      
      monthlyData[monthYear].total += item.totalAmount;
      monthlyData[monthYear].collected += item.collectedAmount;
      monthlyData[monthYear].pending += item.pendingAmount;
      
      statusData[item.status] += 1;
    });

    return { monthlyData, statusData };
  };

  const chartData = prepareChartData();

  // Revenue Trend Chart
  const revenueTrendData = chartData ? {
    labels: Object.keys(chartData.monthlyData).slice(-6),
    datasets: [
      {
        label: 'Total Revenue',
        data: Object.values(chartData.monthlyData).slice(-6).map(d => d.total),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Collected',
        data: Object.values(chartData.monthlyData).slice(-6).map(d => d.collected),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Pending',
        data: Object.values(chartData.monthlyData).slice(-6).map(d => d.pending),
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  } : null;

  // Payment Status Doughnut Chart
  const paymentStatusData = chartData ? {
    labels: ['Paid', 'Pending', 'Overdue', 'Partial'],
    datasets: [{
      data: [
        chartData.statusData.PAID,
        chartData.statusData.PENDING,
        chartData.statusData.OVERDUE,
        chartData.statusData.PARTIAL
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(59, 130, 246, 1)'
      ],
      borderWidth: 2,
    }]
  } : null;

  // Collection Rate Line Chart
  const collectionRateData = chartData ? {
    labels: Object.keys(chartData.monthlyData).slice(-6),
    datasets: [{
      label: 'Collection Rate (%)',
      data: Object.values(chartData.monthlyData).slice(-6).map(d => 
        d.total > 0 ? ((d.collected / d.total) * 100).toFixed(1) : 0
      ),
      borderColor: 'rgba(147, 51, 234, 1)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgba(147, 51, 234, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Analytics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value).replace('₹', '₹');
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Payment Status Distribution',
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Collection Rate Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-zinc-900 mb-2">
                Revenue Tracking
              </h1>
              <p className="text-md text-zinc-600">
                Monitor total revenue vs collected amounts and payment status
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {revenueData && revenueData.summary.totalQuotations > 0 ? (
          <>
            {/* Revenue Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(revenueData.summary.totalRevenue)}
                icon={<DollarSign className="w-5 h-5" />}
                color="green"
                trend="+12.5%"
                trendUp={true}
              />
              <MetricCard
                title="Amount Collected"
                value={formatCurrency(revenueData.summary.totalCollected)}
                icon={<CheckCircle className="w-5 h-5" />}
                color="blue"
                trend="+8.2%"
                trendUp={true}
              />
              <MetricCard
                title="Pending Amount"
                value={formatCurrency(revenueData.summary.totalPending)}
                icon={<Clock className="w-5 h-5" />}
                color="orange"
                trend="-3.1%"
                trendUp={false}
              />
              <MetricCard
                title="Collection Rate"
                value={`${revenueData.summary.totalRevenue > 0 
                  ? ((revenueData.summary.totalCollected / revenueData.summary.totalRevenue) * 100).toFixed(1)
                  : 0}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                color="purple"
                trend="+2.3%"
                trendUp={true}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Trend Chart */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Revenue Trend</h3>
                    <BarChart3 className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="h-80">
                    {revenueTrendData ? (
                      <Bar data={revenueTrendData} options={chartOptions} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-500">
                        No data available for chart
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Status Distribution */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Payment Status</h3>
                    <PieChart className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="h-80">
                    {paymentStatusData ? (
                      <Doughnut data={paymentStatusData} options={doughnutOptions} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-500">
                        No data available for chart
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Collection Rate Trend */}
            <Card className="border-0 shadow-lg bg-white mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-zinc-900">Collection Rate Trend</h3>
                  <Target className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="h-80">
                  {collectionRateData ? (
                    <Line data={collectionRateData} options={lineOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500">
                      No data available for chart
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Revenue Summary</h3>
                    <BarChart3 className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Total Quotations</span>
                      <span className="font-bold">{revenueData.summary.totalQuotations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Paid Quotations</span>
                      <span className="font-bold text-green-600">{revenueData.summary.paidQuotations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Pending Quotations</span>
                      <span className="font-bold text-orange-600">{revenueData.summary.pendingQuotations}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600">Average Revenue</span>
                        <span className="font-bold">
                          {revenueData.summary.totalQuotations > 0 
                            ? formatCurrency(revenueData.summary.totalRevenue / revenueData.summary.totalQuotations)
                            : formatCurrency(0)
                          }
                        </span>
                      </div>
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
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Paid</span>
                      <span className="font-bold text-green-600">
                        {revenueData.details.filter(r => r.status === 'PAID').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Pending</span>
                      <span className="font-bold text-orange-600">
                        {revenueData.details.filter(r => r.status === 'PENDING').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Overdue</span>
                      <span className="font-bold text-red-600">
                        {revenueData.details.filter(r => r.status === 'OVERDUE').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Partial</span>
                      <span className="font-bold text-blue-600">
                        {revenueData.details.filter(r => r.status === 'PARTIAL').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Collection Metrics</h3>
                    <Activity className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Collection Rate</span>
                      <span className="font-bold">
                        {revenueData.summary.totalRevenue > 0 
                          ? `${((revenueData.summary.totalCollected / revenueData.summary.totalRevenue) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Pending Rate</span>
                      <span className="font-bold">
                        {revenueData.summary.totalRevenue > 0 
                          ? `${((revenueData.summary.totalPending / revenueData.summary.totalRevenue) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600">Avg Collection Time</span>
                        <span className="font-bold">15 days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Controls */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
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

            {/* Revenue Details */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">Revenue Details</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredRevenue.map((item) => (
                    <div key={item.quotationId} className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="font-medium">#{item.quotationNumber}</div>
                          <div className="text-sm text-zinc-600">{item.customerName}</div>
                          <div className="text-sm text-zinc-500">{formatDate(item.createdAt)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-zinc-600">Total: </span>
                            <span className="font-semibold">{formatCurrency(item.totalAmount)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-zinc-600">Collected: </span>
                            <span className="font-semibold text-green-600">{formatCurrency(item.collectedAmount)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-zinc-600">Pending: </span>
                            <span className="font-semibold text-orange-600">{formatCurrency(item.pendingAmount)}</span>
                          </div>
                        </div>
                        {item.dueDate && (
                          <div className="text-xs text-zinc-500 mt-1">
                            Due: {formatDate(item.dueDate)}
                          </div>
                        )}
                        {item.paidAt && (
                          <div className="text-xs text-green-600 mt-1">
                            Paid: {formatDate(item.paidAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : revenueData && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">No Revenue Data Available</h2>
            <p className="text-zinc-600 mb-4">No revenue data found. This could be because:</p>
            <ul className="text-sm text-zinc-500 space-y-2 mb-6">
              <li>• No quotations have been created yet</li>
              <li>• No revenue has been generated</li>
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

export default RevenueTracking; 