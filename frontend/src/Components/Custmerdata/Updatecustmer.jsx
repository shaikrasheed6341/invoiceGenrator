import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gstnumber: "",
    pannumber: "",
    recipientName: "",
    houseNumber: "",
    streetName: "",
    locality: "",
    city: "",
    pinCode: "",
    state: ""
  });

  // Check if we're editing an existing customer
  useEffect(() => {
    if (location.state?.customer) {
      const customer = location.state.customer;
      setPhone(customer.phone);
      setSearchPhone(customer.phone);
      setCustomerFound(true);
      setFormData({
        name: customer.name,
        gstnumber: customer.gstnumber,
        pannumber: customer.pannumber,
        recipientName: customer.recipientName || "",
        houseNumber: customer.houseNumber || "",
        streetName: customer.streetName || "",
        locality: customer.locality || "",
        city: customer.city || "",
        pinCode: customer.pinCode || "",
        state: customer.state || ""
      });
    }
  }, [location.state]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Search for customer by phone number
  const handleSearchCustomer = async (e) => {
    e.preventDefault();
    if (!searchPhone) {
      toast.error("Please enter a phone number to search.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    setIsSearching(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error("Please login first", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      const response = await axios.get(`${BACKENDURL}/customer/get/${searchPhone}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const customer = response.data;
      setPhone(customer.phone);
      setCustomerFound(true);
      setFormData({
        name: customer.name,
        gstnumber: customer.gstnumber || "",
        pannumber: customer.pannumber || "",
        recipientName: customer.recipientName || "",
        houseNumber: customer.houseNumber || "",
        streetName: customer.streetName || "",
        locality: customer.locality || "",
        city: customer.city || "",
        pinCode: customer.pinCode || "",
        state: customer.state || ""
      });

      toast.success("Customer found! You can now update their details.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });

    } catch (err) {
      console.error("Error searching customer:", err);
      toast.error(err.response?.data?.message || "Customer not found.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      setCustomerFound(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Update Request
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Please enter your phone number.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error("Please login first", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
        return;
      }

      const response = await axios.put(`${BACKENDURL}/customer/update/${phone}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      
      // Navigate back to customer list if we came from there
      if (location.state?.isEditing) {
        navigate('/customers');
      } else {
      setPhone("");
        setFormData({ 
        name: "", 
        gstnumber: "", 
        pannumber: "",
        recipientName: "",
        houseNumber: "",
        streetName: "",
        locality: "",
        city: "",
        pinCode: "",
        state: ""
      });
      }
      
      // Refresh dashboard stats
      if (window.refreshDashboardStats) {
        window.refreshDashboardStats();
      }
    } catch (err) {
      console.error("Error updating customer:", err);
      toast.error(err.response?.data?.message || "Error updating customer.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const goBack = (e) => {
    e.preventDefault();
    if (location.state?.isEditing) {
      navigate('/customers');
    } else {
    navigate(-1);
    }
  };

  const goToAllCustomers = (e) => {
    e.preventDefault();
    navigate("/customers");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-112 h-112 bg-gradient-to-l from-[#6B21A8]/20 to-[#0F172A]/10 rounded-full blur-3xl animate-float delay-1000"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] w-full max-w-lg p-8 transition-all duration-500 hover:shadow-[0_30px_90px_rgba(139,92,246,0.35)]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-zinc-800 bg-clip-text animate-fade-in">
            {location.state?.isEditing ? 'Edit Customer' : 'Update Customer'}
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            {location.state?.isEditing ? 'Modify customer information' : 'Update customer details by phone number'}
          </p>
        </div>

        {/* Form */}
        {!location.state?.isEditing && !customerFound && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 mb-4">Search Customer</h3>
            <div className="flex gap-3">
              <input
                type="tel"
                placeholder="Enter phone number to search"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70"
              />
              <button
                type="button"
                onClick={handleSearchCustomer}
                disabled={isSearching}
                className="px-6 py-3 bg-zinc-900 text-white font-semibold rounded-xl shadow-lg hover:bg-zinc-800 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {customerFound && (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>Customer Found:</strong> {phone}
              </p>
            </div>
          <InputField
            label="Customer Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <InputField
            label="Recipient Name"
            name="recipientName"
            type="text"
            value={formData.recipientName}
            onChange={handleChange}
          />
          <InputField
            label="House/Flat Number"
            name="houseNumber"
            type="text"
            value={formData.houseNumber}
            onChange={handleChange}
          />
          <InputField
            label="Street Name"
            name="streetName"
            type="text"
            value={formData.streetName}
            onChange={handleChange}
          />
          <InputField
            label="Locality/Area"
            name="locality"
            type="text"
            value={formData.locality}
            onChange={handleChange}
          />
          <InputField
            label="City"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <InputField
            label="PIN Code"
            name="pinCode"
            type="text"
            value={formData.pinCode}
            onChange={handleChange}
          />
          <InputField
            label="State"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
          />
          <InputField
            label="GST Number"
            name="gstnumber"
            type="text"
            value={formData.gstnumber}
            onChange={handleChange}
            required
          />
          <InputField
            label="PAN Number"
            name="pannumber"
            type="text"
            value={formData.pannumber}
            onChange={handleChange}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white text-text font-semibold py-3.5 rounded-xl shadow-lg hover: transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/50"
          >
            {location.state?.isEditing ? 'Update Customer' : 'Update Customer'}
          </button>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={goBack}
              className="flex-1 bg-zinc-900 text-zinc-100 font-medium py-3 rounded-xl hover: transition-all duration-300 transform hover:-translate-y-1"
            >
              Back
            </button>
            <button
              onClick={goToAllCustomers}
              className="flex-1 bg-zinc-900 text-white font-medium py-3 rounded-xl hover: transition-all duration-300 transform hover:-translate-y-1"
            >
              View All Customers
            </button>
          </div>
        </form>
        )}

        {/* Show form for editing existing customer */}
        {location.state?.isEditing && (
          <form onSubmit={handleUpdate} className="space-y-6">
            <InputField
              label="Customer Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Recipient Name"
              name="recipientName"
              type="text"
              value={formData.recipientName}
              onChange={handleChange}
            />
            <InputField
              label="House/Flat Number"
              name="houseNumber"
              type="text"
              value={formData.houseNumber}
              onChange={handleChange}
            />
            <InputField
              label="Street Name"
              name="streetName"
              type="text"
              value={formData.streetName}
              onChange={handleChange}
            />
            <InputField
              label="Locality/Area"
              name="locality"
              type="text"
              value={formData.locality}
              onChange={handleChange}
            />
            <InputField
              label="City"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <InputField
              label="PIN Code"
              name="pinCode"
              type="text"
              value={formData.pinCode}
              onChange={handleChange}
            />
            <InputField
              label="State"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
            />
            <InputField
              label="GST Number"
              name="gstnumber"
              type="text"
              value={formData.gstnumber}
              onChange={handleChange}
              required
            />
            <InputField
              label="PAN Number"
              name="pannumber"
              type="text"
              value={formData.pannumber}
              onChange={handleChange}
              required
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-zinc-900 text-white text-text font-semibold py-3.5 rounded-xl shadow-lg hover: transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/50"
            >
              Update Customer
            </button>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={goBack}
                className="flex-1 bg-zinc-900 text-zinc-100 font-medium py-3 rounded-xl hover: transition-all duration-300 transform hover:-translate-y-1"
              >
                Back
              </button>
              <button
                onClick={goToAllCustomers}
                className="flex-1 bg-zinc-900 text-white font-medium py-3 rounded-xl hover: transition-all duration-300 transform hover:-translate-y-1"
              >
                View All Customers
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

// Reusable Input Field Component (Copied from SubmitOwnerData)
const InputField = ({ label, name, type, value, onChange, required }) => (
  <div className="relative group">
    <label className="absolute -top-2.5 left-3 px-2 bg-gradient-to-r from-white/95 to-gray-100/90 text-xs font-medium text-primary transition-all duration-300 transform scale-95 origin-left group-focus-within:scale-100 group-focus-within:text-accent shadow-sm rounded-md">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder=""
      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70"
    />
  </div>
);

export default UpdateCustomer;