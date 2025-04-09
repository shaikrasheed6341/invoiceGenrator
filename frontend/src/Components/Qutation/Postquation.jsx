import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKENDURL= import.meta.env.VITE_BACKEND_URL

const PostQuotation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: "",
    owneremail: "",
    customerphone: "",
    bankdetailsaccountno: "",
    items: [{ name: "", quantity: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItemField = () => {
    setFormData({ ...formData, items: [...formData.items, { name: "", quantity: "" }] });
  };

  const removeItemField = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!formData.number || !formData.owneremail || !formData.customerphone || !formData.bankdetailsaccountno) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      setLoading(false);
      return;
    }

    const itemNames = formData.items.map((item) => item.name.trim()).filter(Boolean);
    const itemQuantities = formData.items.map((item) => parseInt(item.quantity, 10) || 1);

    if (itemNames.length === 0) {
      toast.error("At least one item is required.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${BACKENDURL}/quation/data`, {
        number: formData.number,
        owneremail: formData.owneremail,
        customerphone: formData.customerphone,
        bankdetailsaccountno: formData.bankdetailsaccountno,
        itemNames,
        itemQuantities,
      });

      toast.success("Quotation created successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      setFormData({
        number: "",
        owneremail: "",
        customerphone: "",
        bankdetailsaccountno: "",
        items: [{ name: "", quantity: "" }],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating quotation", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
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
            Create Quotation
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Fill in the details to generate a quotation
          </p>
          <p className="text-xs text-gray-500 mt-1">Note: Remember your quotation number</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Quotation Number"
            name="number"
            type="text"
            value={formData.number}
            onChange={handleChange}
            required
          />
          <InputField
            label="Owner Email"
            name="owneremail"
            type="email"
            value={formData.owneremail}
            onChange={handleChange}
            required
          />
          <InputField
            label="Customer Phone"
            name="customerphone"
            type="text"
            value={formData.customerphone}
            onChange={handleChange}
            required
          />
          <InputField
            label="Bank Account Number"
            name="bankdetailsaccountno"
            type="text"
            value={formData.bankdetailsaccountno}
            onChange={handleChange}
            required
          />

          {/* Items Section */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 mb-4">Items</h3>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4 items-center">
                <div className="flex-1">
                  <InputField
                    label={`Item Name ${index + 1}`}
                    name={`item-name-${index}`}
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div className="w-24">
                  <InputField
                    label="Qty"
                    name={`item-quantity-${index}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    required
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeItemField(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-xl hover:bg-red-700 transition-all duration-300"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItemField}
              className="w-full bg-green-600 text-white font-medium py-3 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              + Add Item
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-zinc-900 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-300 transform ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1"
            } focus:outline-none focus:ring-4 focus:ring-accent/50`}
          >
            {loading ? "Submitting..." : "Create Quotation"}
          </button>

          {/* Navigation Button */}
          <button
            onClick={() => navigate("/fetch")}
            className="w-full text-zinc-900 font-medium py-3 rounded-xl border border-zinc-900 hover:bg-zinc-100 transition-all duration-300"
          >
            Go to Fetch Page
          </button>
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

export default PostQuotation;