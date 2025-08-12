import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const StreamlinedQuotation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(2); // Start directly at step 2 (template selection)
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [owner, setOwner] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [quotationNumber, setQuotationNumber] = useState("");
  const [bankDetails, setBankDetails] = useState([]);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [quotationItems, setQuotationItems] = useState([
    { itemId: "", quantity: 1, tax: 0, item: null }
  ]);

  const templates = [
    {
      id: 1,
      name: "Standard Template",
      description: "Clean and professional design",
      preview: "/invoice.png",
      component: "Invoice"
    },
    {
      id: 2,
      name: "Modern Template",
      description: "Contemporary design with enhanced styling",
      preview: "/page1.jpg",
      component: "TemplateTwo"
    },
    {
      id: 3,
      name: "Premium Template",
      description: "Beautiful international design with premium styling",
      preview: "/page2.jpg",
      component: "PremiumInvoice"
    }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Removed debugging logs

  const fetchInitialData = async () => {
    try {
      const token = Cookies.get('token');
      
      // Fetch owner data
      const ownerResponse = await axios.get(`${BACKENDURL}/owners/myowner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (ownerResponse.data.owner) {
        setOwner(ownerResponse.data.owner);
        console.log("Owner data loaded:", ownerResponse.data.owner);
      }

      // Fetch customers - returns array directly
      const customersResponse = await axios.get(`${BACKENDURL}/customer/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const customersData = Array.isArray(customersResponse.data) ? customersResponse.data : [];
      setCustomers(customersData);
      console.log("Customers data loaded:", customersData.length, "customers");

      // Fetch items - returns { success: true, data: [...], total: ... }
      const itemsResponse = await axios.get(`${BACKENDURL}/iteam/viewproducts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let itemsData = [];
      if (itemsResponse.data.success && Array.isArray(itemsResponse.data.data)) {
        itemsData = itemsResponse.data.data;
      } else if (Array.isArray(itemsResponse.data)) {
        itemsData = itemsResponse.data;
      }
      setItems(itemsData);
      console.log("Items data loaded:", itemsData.length, "items");

      // Fetch bank details - returns { message: "...", bankDetails: [...] }
      try {
        const bankResponse = await axios.get(`${BACKENDURL}/bank/bankdetails`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let bankData = [];
        if (bankResponse.data.bankDetails && Array.isArray(bankResponse.data.bankDetails)) {
          bankData = bankResponse.data.bankDetails;
        } else if (Array.isArray(bankResponse.data)) {
          bankData = bankResponse.data;
        }
        setBankDetails(bankData);
        console.log("Bank details loaded:", bankData.length, "bank details");
      } catch (bankError) {
        console.error("Error fetching bank details:", bankError);
        setBankDetails([]);
      }

      // Get next quotation number - returns { nextNumber: number }
      const numberResponse = await axios.get(`${BACKENDURL}/quotation/next-number`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const nextNumber = numberResponse.data.nextNumber || 1;
      setQuotationNumber(nextNumber);
      console.log("Quotation number loaded:", nextNumber);

    } catch (error) {
      console.error("Error fetching initial data:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed to load initial data", {
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

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentStep(3); // Go directly to the main form
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleBankDetailsSelect = (bankDetail) => {
    setSelectedBankDetails(bankDetail);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...quotationItems];
    
    if (field === 'itemId') {
      const selectedItem = items.find(item => item.id === value);
      updatedItems[index] = {
        ...updatedItems[index],
        itemId: value,
        item: selectedItem
      };
    } else {
      updatedItems[index][field] = value;
    }
    
    setQuotationItems(updatedItems);
  };

  const addItem = () => {
    setQuotationItems([...quotationItems, { itemId: "", quantity: 1, tax: 0, item: null }]);
  };

  const removeItem = (index) => {
    if (quotationItems.length > 1) {
      const updatedItems = quotationItems.filter((_, i) => i !== index);
      setQuotationItems(updatedItems);
    }
  };

  const calculateTotal = () => {
    return quotationItems.reduce((total, item) => {
      if (item.item) {
        const itemTax = item.tax || 0;
        const itemTotal = item.quantity * item.item.rate * (1 + itemTax / 100);
        return total + itemTotal;
      }
      return total;
    }, 0);
  };

  const calculateSubtotal = () => {
    return quotationItems.reduce((total, item) => {
      if (item.item) {
        return total + (item.quantity * item.item.rate);
      }
      return total;
    }, 0);
  };

  const calculateTotalTax = () => {
    return quotationItems.reduce((total, item) => {
      if (item.item) {
        const itemTax = item.tax || 0;
        return total + (item.quantity * item.item.rate * (itemTax / 100));
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!selectedTemplate) {
      toast.error("Please select a template first", {
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

    if (!selectedCustomer) {
      toast.error("Please select a customer", {
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

    if (!selectedBankDetails) {
      toast.error("Please select bank details", {
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

    const validItems = quotationItems.filter(item => item.itemId && item.quantity > 0);
    if (validItems.length === 0) {
      toast.error("Please add at least one item", {
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
      const token = Cookies.get('token');
      
      const quotationData = {
        number: quotationNumber,
        owneremail: owner.email,
        customerphone: selectedCustomer.phone,
        bankdetailsaccountno: selectedBankDetails.accountno,
        itemNames: validItems.map(item => item.item.name),
        itemQuantities: validItems.map(item => item.quantity),
        itemTaxes: validItems.map(item => item.tax || 0)
      };

      // Debug logging
      console.log("=== FRONTEND: SENDING QUOTATION DATA ===");
      console.log("quotationData:", quotationData);
      console.log("owner:", owner);
      console.log("selectedCustomer:", selectedCustomer);
      console.log("selectedBankDetails:", selectedBankDetails);
      console.log("validItems:", validItems);
      console.log("BACKENDURL:", BACKENDURL);
      console.log("token exists:", !!token);

      const response = await axios.post(`${BACKENDURL}/quotation/data`, quotationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Store quotation number in localStorage
      localStorage.setItem('lastQuotationNumber', quotationNumber);

      toast.success("Quotation created successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });

      // Navigate to the appropriate template
      if (selectedTemplate && selectedTemplate.component === "TemplateTwo") {
        navigate('/template', { state: { quotation: response.data } });
      } else if (selectedTemplate && selectedTemplate.component === "PremiumInvoice") {
        navigate('/premium-invoice', { state: { quotation: response.data } });
      } else {
        navigate('/invoice', { state: { quotation: response.data } });
      }

    } catch (error) {
      console.error("=== FRONTEND: ERROR DETAILS ===");
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.response?.data?.message);
      
      toast.error(error.response?.data?.message || "Error creating quotation", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      console.error("Error creating quotation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Removed step indicator for streamlined flow

  if (currentStep === 1) {
    return (
      <div className="relative">
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
                Select Invoice Template
              </h1>
              <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
                Choose a template for your quotation
              </p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg cursor-pointer group"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="text-center mb-4">
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="text-xl font-bold text-zinc-800 mb-2">{template.name}</h3>
                    <p className="text-sm text-zinc-600 mb-4">{template.description}</p>
                  </div>
                  
                  <button className="w-full bg-purple-600 text-white font-medium py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1">
                    Select Template
                  </button>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-zinc-600 font-medium py-3 px-6 rounded-xl border border-zinc-300 hover:bg-zinc-50 transition-all duration-300"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
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
              Create Quotation
            </h1>
            <p className="text-sm text-zinc-900 mt-3 font-light tracking-wide">
              Fill in the details to generate a quotation
            </p>
            
            {/* Selected Template and Owner Info */}
            <div className="mt-6 space-y-3">
              {selectedTemplate && (
                <div className="inline-block bg-purple-50 px-4 py-2 rounded-xl">
                  <p className="text-sm text-purple-800">
                    <strong>Template:</strong> {selectedTemplate.name}
                  </p>
                </div>
              )}
              {owner && (
                <div className="inline-block bg-blue-50 px-4 py-2 rounded-xl ml-2">
                  <p className="text-sm text-blue-800">
                    <strong>Owner:</strong> {owner.name} ({owner.compneyname})
                  </p>
                </div>
              )}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  Change Template
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quotation Number - Auto-generated */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="absolute -top-2.5 left-3 px-2 bg-gradient-to-r from-white/95 to-gray-100/90 text-xs font-medium text-primary transition-all duration-300 transform scale-95 origin-left group-focus-within:scale-100 group-focus-within:text-accent shadow-sm rounded-md">
                  Quotation Number (Auto)
                </label>
                <input
                  type="number"
                  value={quotationNumber}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-text shadow-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Customer Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="absolute -top-2.5 left-3 px-2 bg-gradient-to-r from-white/95 to-gray-100/90 text-xs font-medium text-primary transition-all duration-300 transform scale-95 origin-left group-focus-within:scale-100 group-focus-within:text-accent shadow-sm rounded-md">
                  Select Customer
                </label>
                <select
                  value={selectedCustomer?.id || ""}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === e.target.value);
                    setSelectedCustomer(customer);
                  }}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70"
                  required
                >
                  <option value="">Select a customer</option>
                  {Array.isArray(customers) && customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank Details Selection */}
              <div className="relative group">
                <label className="absolute -top-2.5 left-3 px-2 bg-gradient-to-r from-white/95 to-gray-100/90 text-xs font-medium text-primary transition-all duration-300 transform scale-95 origin-left group-focus-within:scale-100 group-focus-within:text-accent shadow-sm rounded-md">
                  Select Bank Details
                </label>
                <select
                  value={selectedBankDetails?.id || ""}
                  onChange={(e) => {
                    const bankDetail = bankDetails.find(b => b.id === e.target.value);
                    setSelectedBankDetails(bankDetail);
                  }}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70"
                  required
                >
                  <option value="">Select bank details</option>
                  {Array.isArray(bankDetails) && bankDetails.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bank} - {bank.accountno}
                    </option>
                  ))}

                </select>
              </div>
            </div>

            {/* Customer Details Display */}
            {selectedCustomer && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-zinc-800 mb-3">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-600"><strong>Name:</strong> {selectedCustomer.name}</p>
                    <p className="text-sm text-zinc-600"><strong>Phone:</strong> {selectedCustomer.phone}</p>
                    <p className="text-sm text-zinc-600"><strong>GST:</strong> {selectedCustomer.gstnumber || 'N/A'}</p>
                    <p className="text-sm text-zinc-600"><strong>PAN:</strong> {selectedCustomer.pannumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600">
                      <strong>Address:</strong> {
                        [
                          selectedCustomer.houseNumber,
                          selectedCustomer.streetName,
                          selectedCustomer.locality,
                          selectedCustomer.city,
                          selectedCustomer.pinCode,
                          selectedCustomer.state
                        ].filter(Boolean).join(', ') || 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Items Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-zinc-800">Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all duration-300"
                >
                  + Add Item
                </button>
              </div>
              
              {Array.isArray(quotationItems) && quotationItems.map((item, index) => (
                <div key={index} className="flex gap-4 mb-4 items-center">
                  <div className="flex-1">
                    <select
                      value={item.itemId}
                      onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70"
                      required
                    >
                      <option value="">Select item</option>
                      {Array.isArray(items) && items.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ₹{Number(product.rate).toLocaleString('en-IN')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      min="1"
                      placeholder="Qty"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70"
                      required
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={item.tax || 0}
                      onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Tax %"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-text shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-secondary/70"
                    />
                  </div>
                  {quotationItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-600 text-white px-3 py-2 rounded-xl hover:bg-red-700 transition-all duration-300"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total Calculation */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-zinc-800 mb-3">Amount Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal (Before Tax):</span>
                  <span className="font-medium">₹ {Number(calculateSubtotal()).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Tax:</span>
                  <span className="font-medium text-blue-600">₹ {Number(calculateTotalTax()).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-zinc-900">₹ {Number(calculateTotal()).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-zinc-900 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-300 transform ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1"
              } focus:outline-none focus:ring-4 focus:ring-accent/50`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Quotation...
                </div>
              ) : (
                "Create Quotation"
              )}
            </button>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 text-zinc-600 font-medium py-3 rounded-xl border border-zinc-300 hover:bg-zinc-50 transition-all duration-300"
              >
                ← Back to Template Selection
              </button>
              <button
                type="button"
                onClick={() => navigate("/fetch")}
                className="flex-1 text-zinc-900 font-medium py-3 rounded-xl border border-zinc-900 hover:bg-zinc-100 transition-all duration-300"
              >
                View All Quotations
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StreamlinedQuotation; 