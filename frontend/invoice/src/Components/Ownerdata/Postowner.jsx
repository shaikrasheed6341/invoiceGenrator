import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubmitOwnerData = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    gstNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const result = await axios.post(
        "http://localhost:5000/owners/insertownerdata",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(result.data.message, {
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
        email: "",
        phone: "",
        companyName: "",
        address: "",
        gstNumber: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!", {
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

  const goToBankDetails = (e) => {
    e.preventDefault();
    navigate("/bankdetails");
  };

  const goToNextPage = (e) => {
    e.preventDefault();
    navigate("/postcustmer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#688ce0] via-[#16358b] to-[#9c63ca] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-112 h-112 bg-gradient-to-l from-[#6B21A8]/20 to-[#0F172A]/10 rounded-full blur-3xl animate-float delay-1000"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] w-full max-w-lg p-8 transition-all duration-500 hover:shadow-[0_30px_90px_rgba(139,92,246,0.35)]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-[#133594] via-[#2839ce] to-[#204aa5] bg-clip-text animate-fade-in">
            Owner Registration
          </h1>
          <p className="text-sm text-gray-600 mt-3 font-light tracking-wide">
            Provide your details for a seamless onboarding experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
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
            label="Company Name"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <InputField
            label="GST Number"
            name="gstNumber"
            type="text"
            value={formData.gstNumber}
            onChange={handleChange}
            required
          />
          <InputField
            label="Address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1E3A8A] via-[#6B21A8] to-[#8B5CF6] text-white font-semibold py-3.5 rounded-xl shadow-lg hover:from-[#1E3A8A]/90 hover:via-[#6B21A8]/90 hover:to-[#8B5CF6]/90 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#8B5CF6]/50"
          >
            Register Now
          </button>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={goToBankDetails}
              className="flex-1 bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-md text-white font-medium py-3 rounded-xl hover:from-gray-700/90 hover:to-gray-600/90 transition-all duration-300 transform hover:-translate-y-1"
            >
              Bank Details
            </button>
            <button
              onClick={goToNextPage}
              className="flex-1 bg-gradient-to-r from-[#8B5CF6]/90 to-[#6B21A8]/90 backdrop-blur-md text-white font-medium py-3 rounded-xl hover:from-[#7C3AED]/90 hover:to-[#5B1A8A]/90 transition-all duration-300 transform hover:-translate-y-1"
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

// Reusable Input Field Component
const InputField = ({ label, name, type, value, onChange, required }) => (
  <div className="relative group">
    <label className="absolute -top-2.5 left-3 px-2 bg-gradient-to-r from-white/95 to-gray-100/90 text-xs font-medium text-[#1E3A8A] transition-all duration-300 transform scale-95 origin-left group-focus-within:scale-100 group-focus-within:text-[#8B5CF6] shadow-sm rounded-md">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder=""
      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 shadow-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all duration-300 hover:border-[#6B21A8]/70"
    />
  </div>
);

export default SubmitOwnerData;