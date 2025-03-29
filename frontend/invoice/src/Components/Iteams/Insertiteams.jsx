import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const InsertItems = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    quantity: "",
    tax: "",
    rate: "",
  });
  const [successRows, setSuccessRows] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRow = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5000/iteam/datas", formData);
      toast.success("Item added successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      setSuccessRows([...successRows, formData]);
      
      setFormData({ name: "", brand: "", quantity: "", tax: "", rate: "" });
      
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
  const updatePage = (e) => {
    navigate("/postquation");
  };
  const handleDeleteRow = (index) => {
    const updatedRows = successRows.filter((_, i) => i !== index);
    setSuccessRows(updatedRows);
    toast.info("Item removed", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Bounce,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-112 h-112 bg-gradient-to-l from-[#6B21A8]/20 to-[#0F172A]/10 rounded-full blur-3xl animate-float delay-1000"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] w-full max-w-4xl p-8 transition-all duration-500 hover:shadow-[0_30px_90px_rgba(139,92,246,0.35)]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-zinc-800 bg-clip-text animate-fade-in">
            Add New Items
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Enter product details to build your inventory
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitRow} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              label="Quantity"
              name="quantity"
              type="text"
              value={formData.quantity}
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

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-zinc-900 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/50"
            >
              Add Product
            </button>
            <button
              onClick={() => navigate("/getalliteams")}
              className="flex-1 bg-zinc-900 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Find Product
            </button>
            <button
              onClick={updatePage}
              className="bg-zinc-900 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Next
            </button>
          </div>
        </form>

        {/* Success Table */}
        {successRows.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-zinc-800 mb-4">Successfully Added Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
                <thead className="bg-zinc-900 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Product Name</th>
                    <th className="px-6 py-3 text-left">Brand</th>
                    <th className="px-6 py-3 text-left">Quantity</th>
                    <th className="px-6 py-3 text-left">Tax (%)</th>
                    <th className="px-6 py-3 text-left">Rate</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {successRows.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">{row.name}</td>
                      <td className="px-6 py-4">{row.brand}</td>
                      <td className="px-6 py-4">{row.quantity}</td>
                      <td className="px-6 py-4">{row.tax}</td>
                      <td className="px-6 py-4">{row.rate}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteRow(index)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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

export default InsertItems;