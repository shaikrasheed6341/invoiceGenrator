import React, { useState, useEffect } from "react";
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
    rate: "",
  });
  const [existingProducts, setExistingProducts] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  // Fetch existing products to check for duplicates
  const fetchExistingProducts = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BACKENDURL}/iteam/getalliteamdata`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExistingProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching existing products:", error);
    }
  };

  useEffect(() => {
    fetchExistingProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, // ✅ Quantity remains null
    }));
  };

  // Check if product name already exists
  const checkProductExists = (productName) => {
    return existingProducts.some(product => 
      product.name.toLowerCase() === productName.toLowerCase()
    );
  };

  const handleSubmitRow = async (e) => {
    e.preventDefault();

    // Check if product already exists
    if (checkProductExists(formData.name)) {
      toast.error(`Product "${formData.name}" already exists! Please use a different name.`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    setIsChecking(true);
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

      setFormData({ name: "", brand: "", quantity: null, rate: "" }); // ✅ Reset to null
      // Refresh the existing products list
      await fetchExistingProducts();
      
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
    } finally {
      setIsChecking(false);
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
              label="Rate"
              name="rate"
              type="text"
              value={formData.rate}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Show warning if product name already exists */}
          {formData.name && checkProductExists(formData.name) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Product already exists
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      A product with the name "{formData.name}" already exists in your inventory. 
                      Please use a different name or update the existing product.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isChecking || (formData.name && checkProductExists(formData.name))}
              className="bg-zinc-900 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-1 hover:bg-zinc-800 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isChecking ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>

        {/* Show existing products */}
        {existingProducts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-zinc-800 mb-4">Existing Products</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {existingProducts.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-zinc-800">{product.name}</div>
                    <div className="text-sm text-zinc-600">Brand: {product.brand}</div>
                    <div className="text-sm text-zinc-600">Rate: ₹{product.rate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
