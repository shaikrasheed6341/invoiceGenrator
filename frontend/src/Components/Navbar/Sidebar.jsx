import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { 
  LayoutDashboard,
  User,
  Users,
  Package,
  FileText,
  Plus,
  Edit,
  Search,
  Building2,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,

} from 'lucide-react';

function Sidebar({ onCollapseChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Call parent when collapse state changes
  React.useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  // Navigation items with Lucide icons
  const ownersItems = [
    { 
      to: "/submitownerdata", 
      label: "📝 Register Business", 
      icon: <Plus className="w-4 h-4" />
    },
    { 
      to: "/updateowner", 
      label: "✏️ Edit Business", 
      icon: <Edit className="w-4 h-4" />
    },
    { 
      to: "/invoice-instructions", 
      label: "📋 Invoice Instructions", 
      icon: <FileText className="w-4 h-4" />
    },
  ];

  const customersItems = [
    { 
      to: "/postcustmer", 
      label: "👤 Add Customer", 
      icon: <Plus className="w-4 h-4" />
    },
    { 
      to: "/customers", 
      label: "👥 View Customers", 
      icon: <Users className="w-4 h-4" />
    },
  ];

  const itemsItems = [
    { 
      to: "/selectiteams", 
      label: "📦 Add Product", 
      icon: <Plus className="w-4 h-4" />
    },
    { 
      to: "/viewproducts", 
      label: "📊 View Products", 
      icon: <Package className="w-4 h-4" />
    },
  ];

  const quotationsItems = [
    { 
      to: "/streamlined-quotation", 
      label: "⚡ Live Builder", 
      icon: <FileText className="w-4 h-4" />
    },
    { 
      to: "/postquation", 
      label: "📄 Create Quote", 
      icon: <FileText className="w-4 h-4" />
    },
    { 
      to: "/fetch", 
      label: "🔍 View Quotes", 
      icon: <Search className="w-4 h-4" />
    },
    { 
      to: "/invoice", 
      label: "🧾 Generate Invoice", 
      icon: <FileText className="w-4 h-4" />
    },
  ];

  const bankDetailsItems = [
    { 
      to: "/bankdetails", 
      label: "🏦 Add Bank Details", 
      icon: <Plus className="w-4 h-4" />
    },
    { 
      to: "/bankdetails/list", 
      label: "✏️ Edit Bank Details", 
      icon: <Edit className="w-4 h-4" />
    },

  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-full bg-white border-r border-zinc-200 shadow-lg transition-all duration-300 z-50 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* User Profile */}
      <div className="p-4 border-b border-zinc-200 bg-zinc-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-zinc-200"
              />
            ) : (
              <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-zinc-200">
                <span className="text-sm font-bold text-white">
                  {user?.firstname?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-zinc-900 font-medium text-sm truncate">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-zinc-100"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-zinc-100 text-zinc-900 font-medium" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm">Dashboard</span>}
          </NavLink>

          {/* Owners */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => toggleDropdown('owners')}
              className={`w-full justify-between px-3 py-2.5 h-auto ${
                activeDropdown === 'owners' 
                  ? "bg-zinc-100 text-zinc-900 font-medium" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm">Owners</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'owners' ? 'rotate-180' : ''}`} />
              )}
            </Button>
            {activeDropdown === 'owners' && !isCollapsed && (
              <div className="mt-1 ml-6 space-y-1">
                {ownersItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-zinc-100 text-zinc-900 font-medium" 
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          
          {/* Bank Details */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => toggleDropdown('bankDetails')}
              className={`w-full justify-between px-3 py-2.5 h-auto ${
                activeDropdown === 'bankDetails' 
                  ? "bg-zinc-100 text-zinc-900 font-medium" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm">Bank Details</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'bankDetails' ? 'rotate-180' : ''}`} />
              )}
            </Button>
            {activeDropdown === 'bankDetails' && !isCollapsed && (
              <div className="mt-1 ml-6 space-y-1">
                {bankDetailsItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-zinc-100 text-zinc-900 font-medium" 
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          {/* Customers */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => toggleDropdown('customers')}
              className={`w-full justify-between px-3 py-2.5 h-auto ${
                activeDropdown === 'customers' 
                  ? "bg-zinc-100 text-zinc-900 font-medium" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm">Customers</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'customers' ? 'rotate-180' : ''}`} />
              )}
            </Button>
            {activeDropdown === 'customers' && !isCollapsed && (
              <div className="mt-1 ml-6 space-y-1">
                {customersItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-zinc-100 text-zinc-900 font-medium" 
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Products */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => toggleDropdown('products')}
              className={`w-full justify-between px-3 py-2.5 h-auto ${
                activeDropdown === 'products' 
                  ? "bg-zinc-100 text-zinc-900 font-medium" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm">Products</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
              )}
            </Button>
            {activeDropdown === 'products' && !isCollapsed && (
              <div className="mt-1 ml-6 space-y-1">
                {itemsItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-zinc-100 text-zinc-900 font-medium" 
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Quotations */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => toggleDropdown('quotations')}
              className={`w-full justify-between px-3 py-2.5 h-auto ${
                activeDropdown === 'quotations' 
                  ? "bg-zinc-100 text-zinc-900 font-medium" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm">Quotations</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'quotations' ? 'rotate-180' : ''}`} />
              )}
            </Button>
            {activeDropdown === 'quotations' && !isCollapsed && (
              <div className="mt-1 ml-6 space-y-1">
                {quotationsItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-zinc-100 text-zinc-900 font-medium" 
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>


        </nav>
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div className="absolute bottom-0 w-full p-3 border-t border-zinc-200 bg-zinc-50">
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </motion.div>
  );
}

export default Sidebar; 