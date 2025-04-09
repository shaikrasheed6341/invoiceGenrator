import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BACKENDURL= import.meta.env.VITE_BACKEND_URL
const Bankdetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    ifsccode: "",
    accountno: "",
    bank: "",
    upid: "",
    upidname: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleForm = async (e) => {
    e.preventDefault();
 
    try {
      
      const result = await axios.post(`${BACKENDURL}/bank/bankdetails`, formData);
      toast.success(result.data.message || "Bank details submitted successfully!", {
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
        ifsccode: "",
        accountno: "",
        bank: "",
        upid: "",
        upidname: "",
      });
    } catch (err) {
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

  const custmerpage = (e) => {
    e.preventDefault();
    navigate("/postcustmer");
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
            Bank Details
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Enter your banking information to proceed
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleForm} className="space-y-6">
          <InputField
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <InputField
            label="IFSC Code"
            name="ifsccode"
            type="text"
            value={formData.ifsccode}
            onChange={handleChange}
            required
          />
          <InputField
            label="Account Number"
            name="accountno"
            type="text"
            value={formData.accountno}
            onChange={handleChange}
            required
          />
          <InputField
            label="Bank Name"
            name="bank"
            type="text"
            value={formData.bank}
            onChange={handleChange}
            required
          />
          <InputField
            label="UPI ID"
            name="upid"
            type="text"
            value={formData.upid}
            onChange={handleChange}
            required
          />
          <InputField
            label="UPI Name"
            name="upidname"
            type="text"
            value={formData.upidname}
            onChange={handleChange}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white text-text font-semibold py-3.5 rounded-xl shadow-lg hover: transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/50"
          >
            Submit Bank Details
          </button>

          {/* Navigation Button */}
          <div className="mt-6">
            <button
              onClick={custmerpage}
              className="w-full bg-zinc-900 text-white font-medium py-3 rounded-xl hover: transition-all duration-300 transform hover:-translate-y-1"
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

export default Bankdetails;