import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const InvoiceInstructions = () => {
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      const response = await axios.get(`${BACKENDURL}/owners/invoice-instructions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setInstructions(response.data.invoiceInstructions || "");
      }
    } catch (error) {
      console.error("Error fetching instructions:", error);
      toast.error("Failed to load invoice instructions", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = Cookies.get('token');
      const response = await axios.put(`${BACKENDURL}/owners/invoice-instructions`, 
        { invoiceInstructions: instructions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Invoice instructions saved successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error saving instructions:", error);
      toast.error(error.response?.data?.message || "Failed to save invoice instructions", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
            Invoice Instructions
          </h1>
          <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
            Customize the instructions that will appear on your invoices
          </p>
        </div>

        {/* Instructions Form */}
        <div className="space-y-6">
          <div className="relative group">
            <label className="absolute -top-2.5 left-3 px-2 bg-gradient-to-r from-white/95 to-gray-100/90 text-xs font-medium text-primary transition-all duration-300 transform scale-95 origin-left group-focus-within:scale-100 group-focus-within:text-accent shadow-sm rounded-md">
              Invoice Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter your invoice instructions here... (e.g., Payment terms, delivery information, etc.)"
              className="w-full h-64 px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70 resize-none"
              rows="10"
            />
          </div>

          {/* Instructions Preview */}
          {instructions && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-zinc-800 mb-3">Preview</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-zinc-800 mb-2">Instructions:</h4>
                <div className="text-sm text-zinc-600 whitespace-pre-wrap">
                  {instructions}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`bg-zinc-900 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg transition-all duration-300 transform ${
                saving ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1"
              } focus:outline-none focus:ring-4 focus:ring-accent/50`}
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                "Save Instructions"
              )}
            </button>
          </div>

          {/* Instructions Tips */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Tips for Invoice Instructions</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Include payment terms and due dates</li>
              <li>• Specify delivery or pickup information</li>
              <li>• Add any special conditions or notes</li>
              <li>• Include contact information for questions</li>
              <li>• Mention any discounts or late payment fees</li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default InvoiceInstructions;
