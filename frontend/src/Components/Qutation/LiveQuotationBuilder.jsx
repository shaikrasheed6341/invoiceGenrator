import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import InvoicePreview from "../Invoice/InvoicePreview";
import TemplateTwoPreview from "../Invoice/TemplateTwoPreview";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const LiveQuotationBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [owner, setOwner] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    quotationNumber: "",
    selectedCustomer: null,
    selectedBankDetails: null,
    quotationItems: [{ itemId: "", quantity: 1, tax: 0, item: null }]
  });

  // Live preview data
  const [previewData, setPreviewData] = useState({
    owner: null,
    customer: null,
    bankdetails: null,
    items: [],
    number: "",
    totalAmount: 0
  });

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
    }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    updatePreview();
  }, [formData, owner, selectedTemplate]);

  const fetchInitialData = async () => {
    try {
      const token = Cookies.get('token');
      
      // Fetch owner data
      const ownerResponse = await axios.get(`${BACKENDURL}/owners/myowner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (ownerResponse.data.owner) {
        setOwner(ownerResponse.data.owner);
      }

      // Fetch customers
      const customersResponse = await axios.get(`${BACKENDURL}/customer/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(customersResponse.data);

      // Fetch items
      const itemsResponse = await axios.get(`${BACKENDURL}/iteam/viewproducts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(itemsResponse.data.data || []);

      // Fetch bank details
      const bankResponse = await axios.get(`${BACKENDURL}/bank/bankdetails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBankDetails(bankResponse.data || []);

      // Get next quotation number
      const numberResponse = await axios.get(`${BACKENDURL}/quotation/next-number`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(prev => ({ ...prev, quotationNumber: numberResponse.data.nextNumber }));

    } catch (error) {
      console.error("Error fetching initial data:", error);
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

  const updatePreview = () => {
    if (!owner || !selectedTemplate) return;

    const validItems = formData.quotationItems
      .filter(item => item.itemId && item.item)
      .map(item => ({
        item: item.item,
        quantity: item.quantity,
        tax: item.tax || 0
      }));

    // Calculate detailed breakdown
    const subtotal = validItems.reduce((total, item) => {
      return total + (item.quantity * item.item.rate);
    }, 0);

    const totalTax = validItems.reduce((total, item) => {
      return total + (item.quantity * item.item.rate * (item.tax / 100));
    }, 0);

    const totalAmount = subtotal + totalTax;

    setPreviewData({
      owner: owner,
      customer: formData.selectedCustomer,
      bankdetails: formData.selectedBankDetails,
      items: validItems,
      number: formData.quotationNumber,
      totalAmount: totalAmount,
      subtotal: subtotal,
      totalTax: totalTax
    });
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({ ...prev, selectedCustomer: customer }));
  };

  const handleBankDetailsSelect = (bankDetail) => {
    setFormData(prev => ({ ...prev, selectedBankDetails: bankDetail }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.quotationItems];
    
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
    
    setFormData(prev => ({ ...prev, quotationItems: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      quotationItems: [...prev.quotationItems, { itemId: "", quantity: 1, tax: 0, item: null }]
    }));
  };

  const removeItem = (index) => {
    if (formData.quotationItems.length > 1) {
      const updatedItems = formData.quotationItems.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, quotationItems: updatedItems }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!formData.selectedCustomer) {
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

    if (!formData.selectedBankDetails) {
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

    const validItems = formData.quotationItems.filter(item => item.itemId && item.quantity > 0);
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
        number: formData.quotationNumber,
        owneremail: owner.email,
        customerphone: formData.selectedCustomer.phone,
        bankdetailsaccountno: formData.selectedBankDetails.accountno,
        itemNames: validItems.map(item => item.item.name),
        itemQuantities: validItems.map(item => item.quantity),
        itemTaxes: validItems.map(item => item.tax || 0)
      };

      const response = await axios.post(`${BACKENDURL}/quotation/data`, quotationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Store quotation number in localStorage
      localStorage.setItem('lastQuotationNumber', formData.quotationNumber);

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
      if (selectedTemplate.component === "TemplateTwo") {
        navigate('/template', { state: { quotation: response.data } });
      } else {
        navigate('/invoice', { state: { quotation: response.data } });
      }

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
      console.error("Error creating quotation:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTemplatePreview = () => {
    if (!selectedTemplate || !owner) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">📄</span>
            </div>
            <p className="text-gray-500">Select a template to see preview</p>
          </div>
        </div>
      );
    }

    // Create mock quotation data for preview
    const mockQuotation = {
      ...previewData,
      items: previewData.items.map(item => ({
        item: item.item,
        quantity: item.quantity
      }))
    };

    if (selectedTemplate.component === "TemplateTwo") {
      return <TemplateTwoPreview quotation={mockQuotation} />;
    } else {
      return <InvoicePreview quotation={mockQuotation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Quotation Builder</h1>
            <p className="text-gray-600">Create quotations with real-time preview</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedTemplate}
              className={`px-6 py-2 rounded-lg font-medium ${
                loading || !selectedTemplate
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create Quotation"}
            </button>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      {!selectedTemplate && (
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Select Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 cursor-pointer transition-all"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Select Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Split Screen Layout */}
      {selectedTemplate && (
        <div className="flex h-[calc(100vh-120px)]">
          {/* Left Side - Form */}
          <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto p-6">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-6">Quotation Details</h2>
              
              {/* Template Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected Template:</strong> {selectedTemplate.name}
                </p>
              </div>

              {/* Quotation Number */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quotation Number
                </label>
                <input
                  type="number"
                  value={formData.quotationNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, quotationNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Customer Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Customer
                </label>
                <select
                  value={formData.selectedCustomer?.id || ""}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === e.target.value);
                    handleCustomerSelect(customer);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank Details Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank Details
                </label>
                <select
                  value={formData.selectedBankDetails?.id || ""}
                  onChange={(e) => {
                    const bankDetail = bankDetails.find(b => b.id === e.target.value);
                    handleBankDetailsSelect(bankDetail);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select bank details</option>
                  {bankDetails.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.bank} - {bank.accountno}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    + Add Item
                  </button>
                </div>
                
                {formData.quotationItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <select
                        value={item.itemId}
                        onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select item</option>
                        {items.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ₹{Number(product.rate).toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        min="1"
                        placeholder="Qty"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        value={item.tax}
                        onChange={(e) => handleItemChange(index, 'tax', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Tax %"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {formData.quotationItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Amount Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal (Before Tax):</span>
                    <span className="font-medium">₹ {Number(previewData.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Tax:</span>
                    <span className="font-medium text-blue-600">₹ {Number(previewData.totalTax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-gray-900">₹ {Number(previewData.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Template Preview */}
          <div className="w-1/2 bg-gray-100 overflow-y-auto p-6">
            <div className="bg-white rounded-lg shadow-lg min-h-full">
              {renderTemplatePreview()}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default LiveQuotationBuilder; 