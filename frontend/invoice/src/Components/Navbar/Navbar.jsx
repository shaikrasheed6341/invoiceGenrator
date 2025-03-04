import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-gray-100 to-gray-100 shadow-lg border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo on the left with more spacing */}
          <Link to="/" className="mr-auto">
            <img src="./logo.svg" alt="logo" className="w-28 transition-transform transform hover:scale-110" />
          </Link>

          {/* Centered Navigation */}
          <div className="flex space-x-6 flex-1 justify-center">
            <NavItem to="/submitownerdata" label="Owner Data" />
            <NavItem to="/postcustmer" label="Customer" />
            <NavItem to="/getalliteams" label="Product Data" />
            <NavItem to="/fetch" label="Quotation" />
            <NavItem to="/bankdetails" label="Bank Details" />
          </div>

          {/* Signup and Login on the right with more spacing */}
          <div className="flex space-x-8 ml-auto">
            <NavItem to="/signup" label="Signup" />
            <NavItem to="/login" label="Login" />
          </div>
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