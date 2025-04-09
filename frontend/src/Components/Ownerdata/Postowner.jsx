import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BACKENDURL= import.meta.env.VITE_BACKEND_URL

const SubmitOwnerData = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    compneyname: "", // Change to camelCase
    address: "",
    gstNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending data:", formData); // Debugging
    try {
      const result = await axios.post(
        `${BACKENDURL}/owners/insertownerdata`,
        formData,
        
      );
      console.log("Response:", result.data); // Debugging
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
        companyname: "", // Change to camelCase
        address: "",
        gstNumber: "",
      });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message); // Exact error
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

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-lg p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-text">Owner Registration</h1>
          <p className="text-sm text-text mt-3">Provide your details</p>
        </div>

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
            name="compneyname" // Change to camelCase
            type="text"
            value={formData.compneyname} // Change to camelCase
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

          <button
            type="submit"
            className="w-full bg-primary text-text py-3.5 rounded-xl hover:bg-accent"
          >
            Register Now
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, required }) => (
  <div className="relative">
    <label className="absolute -top-2.5 left-3 px-2 bg-white text-xs text-primary">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-text focus:outline-none focus:border-accent"
    />
  </div>
);

export default SubmitOwnerData;