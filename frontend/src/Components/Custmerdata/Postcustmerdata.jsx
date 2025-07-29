import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


const Postcustmer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gstnumber:"",
    pannumber:"",
    recipientName: "",
    houseNumber: "",
    streetName: "",
    locality: "",
    city: "",
    pinCode: "",
    state: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const Custmerhandledata = async (e) => {
    e.preventDefault();
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

      const res = await axios.post(`${BACKENDURL}/customer/custmor`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      setFormData({
        name: "",
        phone: "",
        pannumber:"",
        gstnumber:"",
        recipientName: "",
        houseNumber: "",
        streetName: "",
        locality: "",
        city: "",
        pinCode: "",
        state: ""
      });
      
      // Refresh dashboard stats
      if (window.refreshDashboardStats) {
        window.refreshDashboardStats();
      }
    } catch (err) {
      console.error("Customer registration error:", err);
      toast.error(err.response?.data?.message || "Submission failed", {
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

  const goToUpdatecustmer = (e) => {
    e.preventDefault();
    navigate("/updatecustmer");
  };

  const goToItems = (e) => {
    e.preventDefault();
    navigate("/selectiteams");
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
            Customer Registration
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Enter customer details to proceed
          </p>
        </div>

        {/* Form */}
        <form onSubmit={Custmerhandledata} className="space-y-6">
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
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
<InputField
            label="Gst Number"
            name="gstnumber"
            type="text"
            value={formData.gstnumber}
            onChange={handleChange}
            required
          />
          <InputField
            label="pan Number"
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
            Submit Customer
          </button>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={goToUpdatecustmer}
              className="flex-1 bg-zinc-900  text-zinc-100 font-medium py-3 rounded-xl hover: transition-all duration-300 transform hover:-translate-y-1"
            >
              Update Customer
            </button>
            <button
              onClick={goToItems}
              className="flex-1 bg-zinc-900  text-white font-medium py-3 rounded-xl hover: transition-all duration-300 transform hover:-translate-y-1"
            >
              Next
            </button>
          </div>
        </form>
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

export default Postcustmer;