import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);



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
            {/* Login/Signup buttons for unauthenticated users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-3"
            >
              <NavLink
                to="/login"
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:bg-gray-50 shadow-lg"
              >
                Login
              </NavLink>
            </motion.div>
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
            {/* Login for mobile */}
            <div className="space-y-3">
              <NavLink
                to="/login"
                className="block w-full text-center px-4 py-3 bg-white text-indigo-600 rounded-lg font-medium transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;