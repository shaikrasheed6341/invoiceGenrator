import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-2  shadow-2xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center">
          {/* Clickable Logo (Navigates to Home) */}
          <div className="flex items-center">
            <Link to="/">
              <img src="./logo.svg" alt="logo" className="w-20 cursor-pointer" />
            </Link>
          </div>

          {/* Navigation Links (Aligned Left) */}
          <div className="ml-100     flex space-x-6">
            <Link to="/submitownerdata" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white">
              Owner Data
            </Link>
            <Link to="/postcustmer" className="rounded-md px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-700">
              Customer
            </Link>
            <Link to="/getalliteams" className="rounded-md px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-700">
              Item Data
            </Link>
            <Link to="/fetch" className="rounded-md px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-700">
              Quotation
            </Link>
            <Link to="/bankdetails" className="rounded-md px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-700">
              Bank Details
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
