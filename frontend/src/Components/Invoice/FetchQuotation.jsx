import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const BACKENDURL= import.meta.env.VITE_BACKEND_URL

const FetchQuotation = () => {
  const [quotationNumber, setQuotationNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchQuotation = async () => {
    if (!quotationNumber) {
      setError("Please enter a quotation number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKENDURL}/quotation/getdata/${quotationNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch quotation");
      }

      // Navigate to invoice page with fetched data
      navigate("/invoice", { state: { quotation: data } });
      navigate("/template", { state: { quotation: data } });
    } catch (err) {
      setError(err.message);
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
      <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] w-full max-w-md p-8 transition-all duration-500 hover:shadow-[0_30px_90px_rgba(139,92,246,0.35)]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-zinc-800 bg-clip-text animate-fade-in">
            Fetch Quotation
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Enter your quotation number to retrieve details
          </p>
        </div>

        {/* Input and Button */}
        <div className="space-y-6">
          <div className="relative group">
            <label className="absolute -top-2.5 left-3 px-2 bg-gradient-to-r from-white/95 to-gray-100/90 text-xs font-medium text-primary transition-all duration-300 transform scale-95 origin-left group-focus-within:scale-100 group-focus-within:text-accent shadow-sm rounded-md">
              Quotation Number
            </label>
            <input
              type="number"
              value={quotationNumber}
              onChange={(e) => setQuotationNumber(e.target.value)}
              placeholder=""
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70"
            />
          </div>

          <button
            onClick={fetchQuotation}
            disabled={loading}
            className={`w-full bg-zinc-900 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-300 transform ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1"
            } focus:outline-none focus:ring-4 focus:ring-accent/50`}
          >
            {loading ? "Fetching..." : "Fetch Quotation"}
          </button>

          {error && (
            <p className="text-red-600 text-center text-sm font-medium animate-fade-in">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FetchQuotation;