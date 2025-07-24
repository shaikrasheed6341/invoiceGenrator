import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const OwnerSelection = ({ selectedTemplate, onOwnerSelect }) => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKENDURL}/owners/allownerdata`);
      setOwners(response.data);
    } catch (error) {
      toast.error("Failed to fetch owners", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      console.error("Error fetching owners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerSelect = (owner) => {
    setSelectedOwner(owner);
  };

  const handleContinue = () => {
    if (!selectedOwner) {
      toast.error("Please select an owner", {
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
    onOwnerSelect(selectedOwner);
  };

  const filteredOwners = owners.filter(owner =>
    owner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.compneyname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
        <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-zinc-800">Loading owners...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-112 h-112 bg-gradient-to-l from-[#6B21A8]/20 to-[#0F172A]/10 rounded-full blur-3xl animate-float delay-1000"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] w-full max-w-4xl p-8 transition-all duration-500 hover:shadow-[0_30px_90px_rgba(139,92,246,0.35)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-zinc-800 bg-clip-text animate-fade-in">
            Select Owner
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Choose the owner for your quotation
          </p>
          {selectedTemplate && (
            <div className="mt-4 p-3 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-800">
                <strong>Selected Template:</strong> {selectedTemplate.name}
              </p>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search owners by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-zinc-800 shadow-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Owners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-96 overflow-y-auto">
          {filteredOwners.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-zinc-600">No owners found matching your search.</p>
            </div>
          ) : (
            filteredOwners.map((owner) => (
              <div
                key={owner.id}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  selectedOwner?.id === owner.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => handleOwnerSelect(owner)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-zinc-800 mb-1">{owner.name}</h3>
                    <p className="text-sm text-zinc-600 mb-2">{owner.email}</p>
                    <p className="text-sm font-medium text-purple-600">{owner.compneyname}</p>
                  </div>
                  {selectedOwner?.id === owner.id && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1 text-xs text-zinc-600">
                  <p><strong>Phone:</strong> {owner.phone}</p>
                  <p><strong>GST:</strong> {owner.gstNumber}</p>
                  <p><strong>Address:</strong> {owner.address}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-zinc-600 font-medium py-3 px-6 rounded-xl border border-zinc-300 hover:bg-zinc-50 transition-all duration-300"
          >
            ← Back to Dashboard
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!selectedOwner}
            className={`font-medium py-3 px-8 rounded-xl transition-all duration-300 ${
              selectedOwner
                ? "bg-purple-600 text-white hover:bg-purple-700 transform hover:-translate-y-1"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue to Create Quotation →
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OwnerSelection; 