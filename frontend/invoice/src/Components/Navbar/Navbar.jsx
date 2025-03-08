import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Function to get cookie value
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function Navbar() {
  const [isLogin, setLogin] = useState(false);

  // Check if the login cookie exists when the component mounts
  useEffect(() => {
    const loginStatus = getCookie("isLogin") === "true";
    setLogin(loginStatus);
  }, []);

  // Function to handle login (set cookie)
  const handleLogin = () => {
    document.cookie = "isLogin=true; path=/"; // Cookie stored for login
    setLogin(true);
  };

  // Function to handle logout (remove cookie)
  const handleLogout = () => {
    document.cookie = "isLogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; // Delete cookie
    setLogin(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-100 to-gray-100 shadow-lg border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo on the left */}
          <Link to="/" className="mr-auto">
            <img src="./logo.svg" alt="logo" className="w-28 transition-transform transform hover:scale-110" />
          </Link>

          {/* Navigation Links (only visible when logged in) */}
        
            <div className="flex space-x-6 flex-1 justify-center">
              <NavItem to="/submitownerdata" label="Owner Data" />
              <NavItem to="/postcustmer" label="Customer" />
              <NavItem to="/getalliteams" label="Product Data" />
              <NavItem to="/fetch" label="Quotation" />
              <NavItem to="/bankdetails" label="Bank Details" />
            </div>
          

          {/* Signup and Login (only visible when not logged in) */}
         
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, label }) {
  return (
    <Link
      to={to}
      className="px-6 py-3 rounded-lg text-md font-semibold text-zinc-600 bg-opacity-80 hover:bg-opacity-100 hover:shadow-lg transition-all duration-300"
    >
      {label}
    </Link>
  );
}

export default Navbar;
