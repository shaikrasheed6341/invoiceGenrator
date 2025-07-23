import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


const InsertItems = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    quantity: null, // ✅ Always null
    tax: "",
    rate: "",
  });



  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, // ✅ Quantity remains null
    }));
  };

  const handleSubmitRow = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get('token');
      await axios.post(`${BACKENDURL}/iteam/datas`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });



      setFormData({ name: "", brand: "", quantity: null, tax: "", rate: "" }); // ✅ Reset to null
      
  
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding item", {
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
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-lg w-full max-w-4xl p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-zinc-800 bg-clip-text">
            Add New Items
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Enter product details to build your inventory
          </p>
        </div>

        <form onSubmit={handleSubmitRow} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Product Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Brand"
              name="brand"
              type="text"
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Tax (%)"
              name="tax"
              type="text"
              value={formData.tax}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Rate"
              name="rate"
              type="text"
              value={formData.rate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-zinc-900 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-1 hover:bg-zinc-800"
            >
              Add Product
            </button>
          </div>
        </form>


      </div>
      <ToastContainer />
    </div>
  );
};

// ✅ Reusable Input Field Component
const InputField = ({ label, name, type, value, onChange, required, disabled }) => (
  <div className="relative">
    <label className="absolute -top-2.5 left-3 px-2 bg-white text-xs font-medium text-primary">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled} // ✅ Prevent user input
      className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none ${
        disabled ? "bg-gray-200 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

export default InsertItems;
