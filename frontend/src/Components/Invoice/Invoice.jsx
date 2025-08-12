import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import converter from 'number-to-words'
import axios from "axios";
import Cookies from "js-cookie";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Utility function to convert number to words (Indian English)

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quotation = location.state?.quotation;
  const [invoiceInstructions, setInvoiceInstructions] = useState("");

  useEffect(() => {
    if (quotation) {
      fetchInvoiceInstructions();
    }
  }, [quotation]);

  const fetchInvoiceInstructions = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BACKENDURL}/owners/invoice-instructions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setInvoiceInstructions(response.data.invoiceInstructions || "");
      }
    } catch (error) {
      console.error("Error fetching invoice instructions:", error);
    }
  };

  if (!quotation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
        <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] p-4 sm:p-8 text-lg sm:text-xl text-zinc-800">
          No Quotation Found!
        </div>
      </div>
    );
  }

  const calculateSubtotal = (items) => {
    return (
      items?.reduce((total, item) => {
        return total + (item.quantity * item.item.rate);
      }, 0).toFixed(2) || "0.00"
    );
  };

  const calculateTotalTax = (items) => {
    return (
      items?.reduce((total, item) => {
        return total + (item.quantity * item.item.rate * (item.tax / 100));
      }, 0).toFixed(2) || "0.00"
    );
  };

  const calculateTotalAmount = (items) => {
    return (
      items?.reduce((total, item) => {
        return total + item.quantity * item.item.rate * (1 + item.tax / 100);
      }, 0).toFixed(2) || "0.00"
    );
  };

  const subtotal = calculateSubtotal(quotation.items);
  const totalTax = calculateTotalTax(quotation.items);
  const totalAmount = calculateTotalAmount(quotation.items);
  const totalAmountInWords = converter.toWords(totalAmount);
  // console.log(totalAmountInWords)

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSaveInvoice = () => {
    // Create a new window with the invoice content for printing/saving
    const printWindow = window.open('', '_blank');
    const invoiceContent = document.querySelector('.invoice-content');
    
    if (printWindow && invoiceContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${quotation.number}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { 
                  margin: 0; 
                  padding: 10px; 
                  font-size: 12px;
                  line-height: 1.2;
                }
                .no-print { display: none !important; }
                .invoice-container { 
                  max-width: 100%; 
                  margin: 0; 
                  padding: 10px;
                  box-shadow: none;
                }
                table { 
                  margin: 10px 0; 
                  font-size: 11px;
                }
                th, td { 
                  padding: 6px; 
                }
                .card {
                  padding: 8px;
                  margin-bottom: 8px;
                }
                .info-section {
                  padding: 8px;
                  margin-bottom: 8px;
                }
                h2 { font-size: 18px; margin-bottom: 8px; }
                h3 { font-size: 14px; margin-bottom: 6px; }
                h4 { font-size: 12px; margin-bottom: 4px; }
                p { margin-bottom: 4px; }
                ul { margin-bottom: 8px; }
                li { margin-bottom: 2px; }
                .mb-6 { margin-bottom: 6px !important; }
                .mb-4 { margin-bottom: 4px !important; }
                .p-4 { padding: 6px !important; }
                .p-3 { padding: 4px !important; }
                .pt-4 { padding-top: 6px !important; }
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                background-color: #f9fafb;
              }
              .invoice-container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 20px 0; 
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              th, td { 
                border: 1px solid #e5e7eb; 
                padding: 12px; 
                text-align: left; 
              }
              th { 
                background-color: #374151; 
                color: white;
                font-weight: bold;
              }
              .total { 
                font-weight: bold; 
                text-align: right; 
              }
              .header { 
                text-align: center; 
                margin-bottom: 20px; 
                border-bottom: 2px solid #d1d5db;
                padding-bottom: 20px;
              }
              .footer { 
                text-align: center; 
                margin-top: 20px; 
                border-top: 2px solid #d1d5db; 
                padding-top: 10px; 
                font-weight: bold;
                font-size: 18px;
              }
              .card {
                background: white;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                margin-bottom: 16px;
                border: 1px solid #e5e7eb;
              }
              .info-section {
                background: #f3f4f6;
                padding: 16px;
                border-radius: 8px;
                margin-bottom: 16px;
              }
              .button {
                background: #374151;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                margin: 8px;
                font-weight: bold;
              }
              .button:hover {
                background: #4b5563;
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              ${invoiceContent.innerHTML}
            </div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button class="button" onclick="window.print()">Print Invoice</button>
              <button class="button" onclick="window.close()">Close</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      
      // Try to print, if it fails, just show the window
      try {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      } catch (error) {
        console.log('Print failed, showing window instead');
      }
    } else {
      // Fallback: just print the current page
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-gray-50">

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-112 h-112 bg-gradient-to-l from-[#6B21A8]/20 to-[#0F172A]/10 rounded-full blur-3xl animate-float delay-1000"></div>

      <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-4xl p-4 sm:p-6 lg:p-8 transition-all duration-500 invoice-content">
        {/* Standard Template Header */}
        <div className="text-center mb-4 sm:mb-6 border-b-2 border-gray-300 pb-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {quotation.owner.compneyname}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3">{quotation.owner.address}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm text-gray-700">
            <span><strong>Email:</strong> {quotation.owner.email}</span>
            <span><strong>GST:</strong> {quotation.owner.gstNumber}</span>
            <span><strong>Phone:</strong> {quotation.owner.phone}</span>
          </div>
        </div>

        {/* Quotation Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-2 sm:p-3 mb-3 sm:mb-4 rounded">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-0">Quotation No: {quotation.number}</h3>
          <p className="text-xs sm:text-sm font-semibold text-gray-700">
            <strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>

        {/* Billing and Shipping Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="border border-gray-300 p-2 sm:p-3 rounded">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 border-b border-gray-300 pb-1">Bill To</h4>
            <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-1">{quotation.customer?.name}</p>
            <p className="text-xs text-gray-700">
              {quotation.customer?.address || "No address provided"}
            </p>
          </div>
          <div className="border border-gray-300 p-2 sm:p-3 rounded">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 border-b border-gray-300 pb-1">Ship To</h4>
            <p className="font-semibold text-xs sm:text-sm text-gray-900 mb-1">{quotation.customer?.name}</p>
            <p className="text-xs text-gray-700">
              {quotation.customer?.address || "No address provided"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-4 sm:mb-6">
          <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm lg:text-base">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-2 sm:p-3 text-left font-semibold border border-gray-300">Item</th>
                <th className="p-2 sm:p-3 text-left font-semibold border border-gray-300">Qty</th>
                <th className="p-2 sm:p-3 text-left font-semibold border border-gray-300">Rate</th>
                <th className="p-2 sm:p-3 text-left font-semibold border border-gray-300">Tax</th>
                <th className="p-2 sm:p-3 text-left font-semibold border border-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                  <td className="p-2 sm:p-3 text-gray-900 border border-gray-300">{item.item?.name || "N/A"}</td>
                  <td className="p-2 sm:p-3 text-gray-900 border border-gray-300">{item.quantity || "0"}</td>
                  <td className="p-2 sm:p-3 text-gray-900 border border-gray-300">₹ {Number(item.item?.rate || 0).toLocaleString('en-IN')}</td>
                  <td className="p-2 sm:p-3 text-gray-900 border border-gray-300">{item.tax || "0"}%</td>
                  <td className="p-2 sm:p-3 text-gray-900 border border-gray-300 font-semibold">
                    ₹ {Number(item.quantity * item.item?.rate * (1 + item.tax / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="text-right mb-4 sm:mb-6 mr-4 sm:mr-8 lg:mx-28  ">
          <div className="space-y-1 mb-2">
            <div className="flex justify-end items-center">
              <span className="text-sm sm:text-base text-gray-600 mr-4">Subtotal :</span>
              <span className="text-sm sm:text-base font-medium">₹ {Number(subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-end items-center">
              <span className="text-sm sm:text-base text-gray-600 mr-8">Total Tax :</span>
              <span className="text-sm sm:text-base font-medium text-red-600">₹ {Number(totalTax).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-end items-center border-t-2 border-black  pt-2">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mr-4">Total Amount:</span>
              <span className="text-base sm:text-lg lg:text-lg font-bold text-gray-900">₹ {Number(totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <p className="text-sm sm:text-sm lg:text-sm text-gray-700 capitalize leading-tight">
             {totalAmountInWords} Rupees
          </p>
        </div>

        {/* Bank Details */}
        {quotation.bankdetails && (
          <div className="border border-gray-300 p-2 sm:p-3 mb-3 sm:mb-4 rounded">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2 border-b border-gray-300 pb-1">Bank Details</h4>
            <div className="grid grid-cols-1 gap-1">
              <p className="text-xs text-gray-700"><strong>Bank Name:</strong> {quotation.bankdetails.bank}</p>
              <p className="text-xs text-gray-700"><strong>Account No:</strong> {quotation.bankdetails.accountno}</p>
              <p className="text-xs text-gray-700"><strong>IFSC Code:</strong> {quotation.bankdetails.ifsccode}</p>
            </div>
          </div>
        )}

        {/* Payment Details */}
        <div className="border border-gray-300 p-2 sm:p-3 mb-3 sm:mb-4 rounded">
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Payment Details</h3>
            <p className="text-xs text-gray-700"><strong>UPI ID:</strong> {quotation.bankdetails?.upid || "N/A"}</p>
            <p className="text-xs text-gray-700"><strong>UPI Name:</strong> {quotation.bankdetails?.upidname || "N/A"}</p>
          </div>
        </div>



        {/* Terms & Conditions */}
        
        {/* Invoice Instructions */}
        {invoiceInstructions && (
          <div className="border border-gray-300 p-2 sm:p-3 mb-3 sm:mb-4 rounded">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2 border-b border-gray-300 pb-1">Instructions</h3>
            <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
              {invoiceInstructions}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 mt-4 sm:mt-6">
          <button
            onClick={handleGoToDashboard}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg text-sm sm:text-base"
          >
            🏠 Go to Dashboard
          </button>
          <button
            onClick={handleSaveInvoice}
            className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg text-sm sm:text-base"
          >
            💾 Save Invoice
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 border-t-2 border-gray-300 pt-4">
          Thank You
        </div>
      </div>

    </div>
  );
};

export default Invoice;