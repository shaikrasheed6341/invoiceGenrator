import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AllItemsTable = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 10;
  const BACKENDURL= import.meta.env.VITE_BACKEND_URL

  // Fetch all items from backend
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKENDURL}/iteams/getalliteamdata`);
      setItems(response.data || []);
    } catch (error) {
      toast.error("Error fetching items", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Handle checkbox selection
  const handleCheckboxChange = (item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((i) => i.id === item.id);
      return isSelected ? prev.filter((i) => i.id !== item.id) : [...prev, item];
    });
  };

  const updatePage = (e) => {
    e.preventDefault();
    navigate("/postquation");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-112 h-112 bg-gradient-to-l from-[#6B21A8]/20 to-[#0F172A]/10 rounded-full blur-3xl animate-float delay-1000"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] w-full max-w-5xl p-8 transition-all duration-500 hover:shadow-[0_30px_90px_rgba(139,92,246,0.35)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-zinc-800 bg-clip-text animate-fade-in">
              All Products
            </h1>
            <p className="text-sm text-zinc-900 mt-2 font-light tracking-wide">
              Browse and select items from your inventory
            </p>
          </div>
          <button
            onClick={updatePage}
            className="bg-zinc-900 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Next
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group mb-8">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70"
          />
          <label className="absolute -top-2.5 left-3 px-2 bg-gradient-to-r from-white/95 to-gray-100/90 text-xs font-medium text-primary transition-all duration-300 transform scale-95 origin-left group-focus-within:scale-100 group-focus-within:text-accent shadow-sm rounded-md">
            Search Products
          </label>
        </div>

        {/* Loading State */}
        {loading && <p className="text-center text-zinc-600">Loading...</p>}

        {/* Main Table */}
        {!loading && currentItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
              <thead className="bg-zinc-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">S.No</th>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Brand</th>
                  <th className="px-6 py-3 text-left">Quantity</th>
                  <th className="px-6 py-3 text-left">Tax (%)</th>
                  <th className="px-6 py-3 text-left">Rate</th>
                  <th className="px-6 py-3 text-left">Select</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">{indexOfFirstItem + index + 1}</td>
                    <td className="px-6 py-4">{item.id}</td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.brand}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">{item.tax}</td>
                    <td className="px-6 py-4">{item.rate}</td>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-zinc-900"
                        onChange={() => handleCheckboxChange(item)}
                        checked={selectedItems.some((i) => i.id === item.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-zinc-900 text-white rounded-xl disabled:opacity-50 transition-all duration-300 hover:-translate-y-1"
            >
              Previous
            </button>
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentPage === index + 1
                      ? "bg-zinc-900 text-white"
                      : "bg-gray-200 text-zinc-800 hover:-translate-y-1"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-zinc-900 text-white rounded-xl disabled:opacity-50 transition-all duration-300 hover:-translate-y-1"
            >
              Next
            </button>
          </div>
        )}

        {/* Selected Items Table */}
        {selectedItems.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-zinc-800 mb-4">Selected Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
                <thead className="bg-zinc-900 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">S.No</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Brand</th>
                    <th className="px-6 py-3 text-left">Quantity</th>
                    <th className="px-6 py-3 text-left">Tax (%)</th>
                    <th className="px-6 py-3 text-left">Rate</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.brand}</td>
                      <td className="px-6 py-4">{item.quantity}</td>
                      <td className="px-6 py-4">{item.tax}</td>
                      <td className="px-6 py-4">{item.rate}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleCheckboxChange(item)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
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

export default AllItemsTable;