import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOwnersDropdownOpen, setOwnersDropdownOpen] = useState(false);
  const [isCustomersDropdownOpen, setCustomersDropdownOpen] = useState(false);
  const [isItemsDropdownOpen, setItemsDropdownOpen] = useState(false);
  const [isQuotationsDropdownOpen, setQuotationsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

  // Navigation items divided into separate groups
  const ownersItems = [
    { to: "/submitownerdata", label: "Insert Owner Data" },
    { to: "/updateowner", label: "Update Owner" },
  ];

  const customersItems = [
    { to: "/postcustmer", label: "Insert Customer Data" },
    { to: "/updatecustmer", label: "Update Customer" },
  ];

  const itemsItems = [
    { to: "/selectiteams", label: "Insert Items" },
    { to: "/getalliteams", label: "All Items" },
  ];

  const quotationsItems = [
    { to: "/bankdetails", label: "Bank Details" },
    { to: "/postquation", label: "Generate Quotation" },
    { to: "/fetch", label: "Fetch Quotation" },
    { to: "/invoice", label: "Invoice" },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl z-[9999] sticky top-0 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3"> 
            <Link to="/" className="flex-shrink-0">
              <img
                src="./logo.png"
                alt="Logo"
                className="w-12 h-12 md:w-16 md:h-16 transition-all duration-300 hover:scale-110 drop-shadow-lg"
              />
            </Link>
            <span className="text-white font-bold tracking-wider text-xl md:text-2xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              ITPARTNER
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 flex-1 justify-end">
            {isAuthenticated ? (
              <>
                {/* Owners Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setOwnersDropdownOpen(!isOwnersDropdownOpen)}
                    className="text-white px-4 py-2 hover:bg-white/20 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/10 hover:border-white/30"
                  >
                    Owners
                    <svg className="w-4 h-4 ml-1 inline-block transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isOwnersDropdownOpen && (
                    <div className="absolute mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl z-10 border border-gray-200/50 overflow-hidden">
                      {ownersItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white ${
                              isActive ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "text-gray-700"
                            }`
                          }
                          onClick={() => setOwnersDropdownOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customers Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setCustomersDropdownOpen(!isCustomersDropdownOpen)}
                    className="text-white px-4 py-2 hover:bg-white/20 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/10 hover:border-white/30"
                  >
                    Customers
                    <svg className="w-4 h-4 ml-1 inline-block transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isCustomersDropdownOpen && (
                    <div className="absolute mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl z-10 border border-gray-200/50 overflow-hidden">
                      {customersItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white ${
                              isActive ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "text-gray-700"
                            }`
                          }
                          onClick={() => setCustomersDropdownOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* Items Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setItemsDropdownOpen(!isItemsDropdownOpen)}
                    className="text-white px-4 py-2 hover:bg-white/20 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/10 hover:border-white/30"
                  >
                    Products
                    <svg className="w-4 h-4 ml-1 inline-block transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isItemsDropdownOpen && (
                    <div className="absolute mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl z-10 border border-gray-200/50 overflow-hidden">
                      {itemsItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white ${
                              isActive ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "text-gray-700"
                            }`
                          }
                          onClick={() => setItemsDropdownOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quotations Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setQuotationsDropdownOpen(!isQuotationsDropdownOpen)}
                    className="text-white px-4 py-2 hover:bg-white/20 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/10 hover:border-white/30"
                  >
                    Quotations
                    <svg className="w-4 h-4 ml-1 inline-block transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isQuotationsDropdownOpen && (
                    <div className="absolute mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl z-10 border border-gray-200/50 overflow-hidden">
                      {quotationsItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:text-white ${
                              isActive ? "bg-gradient-to-r from-green-500 to-blue-500 text-white" : "text-gray-700"
                            }`
                          }
                          onClick={() => setQuotationsDropdownOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 text-white px-4 py-2 hover:bg-white/20 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/10 hover:border-white/30"
                  >
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {user?.firstname?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span>{user?.firstname || 'User'}</span>
                    <svg className="w-4 h-4 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl z-10 border border-gray-200/50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.firstname} {user?.lastname}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login/Signup buttons for unauthenticated users */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-3"
                >
                  <NavLink
                    to="/login"
                    className="text-white px-4 py-2 hover:bg-white/20 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/10 hover:border-white/30"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:bg-gray-50 shadow-lg"
                  >
                    Sign Up
                  </NavLink>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/20 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 backdrop-blur-sm border border-white/10"
            >
              <span className="sr-only">Toggle Menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-md px-4 py-4 rounded-b-xl border-t border-white/20 animate-slide-down">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="mb-4 p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user?.firstname?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{user?.firstname} {user?.lastname}</p>
                      <p className="text-white/70 text-sm">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Owners Section */}
                <div className="space-y-2 mb-4">
                  <p className="text-white/80 font-semibold px-3 text-sm uppercase tracking-wider">Owners</p>
                  {ownersItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200 ${
                          isActive ? "bg-white/30 font-medium" : ""
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                {/* Customers Section */}
                <div className="space-y-2 mb-4">
                  <p className="text-white/80 font-semibold px-3 text-sm uppercase tracking-wider">Customers</p>
                  {customersItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200 ${
                          isActive ? "bg-white/30 font-medium" : ""
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                {/* Items Section */}
                <div className="space-y-2 mb-4">
                  <p className="text-white/80 font-semibold px-3 text-sm uppercase tracking-wider">Products</p>
                  {itemsItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200 ${
                          isActive ? "bg-white/30 font-medium" : ""
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                {/* Quotations Section */}
                <div className="space-y-2 mb-4">
                  <p className="text-white/80 font-semibold px-3 text-sm uppercase tracking-wider">Quotations</p>
                  {quotationsItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200 ${
                          isActive ? "bg-white/30 font-medium" : ""
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                {/* Logout Button */}
                <div className="pt-4 border-t border-white/20">
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login/Signup for mobile */}
                <div className="space-y-3">
                  <NavLink
                    to="/login"
                    className="block w-full text-center px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200 border border-white/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="block w-full text-center px-4 py-3 bg-white text-indigo-600 rounded-lg font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;