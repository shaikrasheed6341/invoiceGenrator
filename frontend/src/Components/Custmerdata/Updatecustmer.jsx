import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UpdateCustomer = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const response = await axios.put(`${BACKENDURL}/custmor/${phone}`, formData);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      setPhone("");
      setFormData({ name: "", address: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating customer.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      console.error("Error updating customer:", err);
    }
  };

  const goBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const goToAllCustomers = (e) => {
    e.preventDefault();
    navigate("/getallcustomers"); // Assuming there's a route for this
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
            Update Customer
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Modify customer details seamlessly
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-6">
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <InputField
            label="Customer Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            label="Address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white text-text font-semibold py-3.5 rounded-xl shadow-lg hover:bg-accent transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/50"
          >
            Update Customer
          </button>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={goBack}
              className="flex-1 bg-zinc-900 text-white text-text font-medium py-3 rounded-xl hover:bg-accent transition-all duration-300 transform hover:-translate-y-1"
            >
              Go Back
            </button>
            <button
              onClick={goToAllCustomers}
              className="flex-1 bg-zinc-900 text-white text-text font-medium py-3 rounded-xl hover:bg-accent transition-all duration-300 transform hover:-translate-y-1"
            >
              Get All Customers
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

export default UpdateCustomer;