import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOwnersDropdownOpen, setOwnersDropdownOpen] = useState(false);
  const [isCustomersDropdownOpen, setCustomersDropdownOpen] = useState(false);
  const [isItemsDropdownOpen, setItemsDropdownOpen] = useState(false);
  const [isQuotationsDropdownOpen, setQuotationsDropdownOpen] = useState(false);

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
    <nav className="bg-gradient-to-tl from bg-accent text-text shadow-lg z-[9999] sticky ">
      <div className="max-w-7xl mx-auto px-10 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="./logo.png"
              alt="Logo"
              className="w-18 md:w-24 transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
            {/* Owners Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOwnersDropdownOpen(!isOwnersDropdownOpen)}
                className="text-white px-4 py-2 hover:bg-accent hover:text-text rounded-md font-medium transition duration-200"
              >
                Owners
              </button>
              {isOwnersDropdownOpen && (
                <div className="absolute mt-2 w-48 bg-blue text-text rounded-md shadow-lg z-10">
                  {ownersItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm hover:bg-secondary hover:text-text ${
                          isActive ? "bg-white text-text" : ""
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
                className="text-white px-4 py-2 hover:bg-accent hover:text-text rounded-md font-medium transition duration-200"
              >
                Customers
              </button>
              {isCustomersDropdownOpen && (
                <div className="absolute mt-2 w-48 bg-blue text-text rounded-md shadow-lg z-10">
                  {customersItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm hover:bg-secondary hover:text-text ${
                          isActive ? "bg-accent text-text" : ""
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
                className="text-white px-4 py-2 hover:bg-accent hover:text-text rounded-md font-medium transition duration-200"
              >
               Products
              </button>
              {isItemsDropdownOpen && (
                <div className="absolute mt-2 w-48 bg-blue text-text rounded-md shadow-lg z-10">
                  {itemsItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm hover:bg-secondary hover:text-text ${
                          isActive ? "bg-accent text-text" : ""
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
                className="text-white px-4 py-2 hover:bg-accent hover:text-text rounded-md font-medium transition duration-200"
              >
                Quotations
              </button>
              {isQuotationsDropdownOpen && (
                <div className="absolute mt-2 w-48 bg-blue text-text rounded-md shadow-lg z-10">
                  {quotationsItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm hover:bg-secondary hover:text-text ${
                          isActive ? "bg-accent text-text" : ""
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-secondary hover:bg-accent hover:text-text p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition duration-200"
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
          <div className="md:hidden bg-primary px-2 py-3 rounded-b-md animate-slide-down">
            {/* Owners Section */}
            <div className="space-y-2">
              <p className="text-secondary font-medium px-3">Owners</p>
              {ownersItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-text hover:bg-secondary hover:text-text rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Customers Section */}
            <div className="space-y-2 mt-2">
              <p className="text-secondary font-medium px-3">Customers</p>
              {customersItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-text hover:bg-secondary hover:text-text rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Items Section */}
            <div className="space-y-2 mt-2">
              <p className="text-secondary font-medium px-3">Items</p>
              {itemsItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-text hover:bg-secondary hover:text-text rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Quotations Section */}
            <div className="space-y-2 mt-2">
              <p className="text-secondary font-medium px-3">Quotations</p>
              {quotationsItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-text hover:bg-secondary hover:text-text rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;