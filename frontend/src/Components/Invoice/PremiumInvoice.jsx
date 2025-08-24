import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import converter from 'number-to-words'
import axios from "axios";
import tokenManager from "../../utils/tokenManager";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const PremiumInvoice = () => {
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
      const token = tokenManager.getToken();
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
        <div className="absolute inset-0 bg-gray-50 pointer-events-none"></div>
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 text-xl text-gray-800">
          No Quotation Found!
        </div>
      </div>
    );
  }

  const calculateSubtotal = (items) => {
    return items?.reduce((total, item) => {
      return total + (item.quantity * item.item.rate);
    }, 0).toFixed(2) || "0.00";
  };

  const calculateTotalTax = (items) => {
    return items?.reduce((total, item) => {
      return total + (item.quantity * item.item.rate * (item.tax / 100));
    }, 0).toFixed(2) || "0.00";
  };

  const calculateTotalAmount = (items) => {
    return items?.reduce((total, item) => {
      return total + item.quantity * item.item.rate * (1 + item.tax / 100);
    }, 0).toFixed(2) || "0.00";
  };

  const subtotal = calculateSubtotal(quotation.items);
  const totalTax = calculateTotalTax(quotation.items);
  const totalAmount = calculateTotalAmount(quotation.items);
  const totalAmountInWords = converter.toWords(totalAmount);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSaveInvoice = () => {
    const printWindow = window.open('', '_blank');
    const invoiceContent = document.querySelector('.premium-invoice-content');
    
    if (printWindow && invoiceContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Premium Invoice - ${quotation.number}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { 
                  margin: 0; 
                  padding: 15px; 
                  font-size: 12px;
                  line-height: 1.3;
                }
                .no-print { display: none !important; }
                .premium-invoice-container { 
                  max-width: 100%; 
                  margin: 0; 
                  padding: 15px;
                  box-shadow: none;
                }
                table { 
                  margin: 15px 0; 
                  font-size: 11px;
                }
                th, td { 
                  padding: 8px; 
                }
                .header {

                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
                                .accent-border {
                  border-left: 4px solid #374151 !important;
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
                .total-card {

                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
                }
              }
              body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                margin: 20px; 
                background: #f9fafb;
              }
              .premium-invoice-container { 
                max-width: 900px; 
                margin: 0 auto; 
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              }
              .header {
               
                color: white;
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 30px;
              }
              .accent-border {
                border-left: 4px solid #374151;
              }
              .total-card {
               
                color: white;
                padding: 25px;
                border-radius: 15px;
                text-align: center;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 25px 0; 
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              th, td { 
                border: 1px solid #e5e7eb; 
                padding: 15px; 
                text-align: left; 
              }
              th { 
               
                color: white;
                font-weight: 600;
              }
              .button {
             
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                margin: 8px;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="premium-invoice-container">
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
      
      try {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      } catch (error) {
        console.log('Print failed, showing window instead');
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-white">
      {/* Simple white background */}
      <div className="absolute inset-0 bg-white"></div>

             <div className="relative z-10 bg-white rounded-3xl w-full max-w-5xl p-6 sm:p-8 lg:p-12 transition-all duration-500 premium-invoice-content border border-gray-200">
        {/* Premium Header */}
                 <div className="bg-white text-gray-800 rounded-2xl p-8 mb-8 ">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-gray-800">
                {quotation.owner.compneyname}
              </h1>
              <p className="text-gray-600 text-lg mb-4">{quotation.owner.address || "Business Address"}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span className="text-gray-600">{quotation.owner.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-600">GST: {quotation.owner.gstNumber || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7z"/>
                  </svg>
                  <span className="text-gray-600">{quotation.owner.phone || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-8 text-right">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">INVOICE</h2>
                <p className="text-gray-700 text-lg">#{quotation.number}</p>
                <p className="text-gray-600 text-sm mt-2">
                  {new Date().toLocaleDateString("en-US", { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Due Date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client and Business Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 rounded-2xl p-4  b-1  border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
              Bill To
            </h3>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-900">{quotation.customer?.name}</p>
              <p className="text-gray-600">
                {quotation.customer?.address || "No address provided"}
              </p>
              {quotation.customer?.gstnumber && (
                <p className="text-gray-600">GST: {quotation.customer.gstnumber}</p>
              )}
              {quotation.customer?.pannumber && (
                <p className="text-gray-600">PAN: {quotation.customer.pannumber}</p>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4  b-1  border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              Ship To
            </h3>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-900">{quotation.customer?.name}</p>
              <p className="text-gray-600">
                {quotation.customer?.address || "Same as billing address"}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
                 <div className="bg-white rounded-2xl overflow-hidden mb-8 border border-gray-200">
          <table className="w-full">
                         <thead className="bg-gray-100 text-gray-800 border-b-2 border-gray-300">
               <tr>
                 <th className="px-6 py-4 text-left font-semibold">Item Description</th>
                 <th className="px-6 py-4 text-center font-semibold">Quantity</th>
                 <th className="px-6 py-4 text-right font-semibold">Rate (₹)</th>
                 <th className="px-6 py-4 text-center font-semibold">Tax %</th>
                 <th className="px-6 py-4 text-right font-semibold">Amount (₹)</th>
               </tr>
             </thead>
            <tbody className="divide-y divide-gray-200">
              {quotation.items?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{item.item?.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">{item.item?.brand || "N/A"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium">
                    {item.quantity || "0"}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900 font-medium">
                    ₹{Number(item.item?.rate || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium">
                    {item.tax || "0"}%
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ₹{Number(item.quantity * item.item?.rate * (1 + item.tax / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals and Payment Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bank Details */}
          {quotation.bankdetails && (
            <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-gray-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
                Bank Details
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700"><span className="font-semibold">Bank:</span> {quotation.bankdetails.bank}</p>
                <p className="text-gray-700"><span className="font-semibold">Account:</span> {quotation.bankdetails.accountno}</p>
                <p className="text-gray-700"><span className="font-semibold">IFSC:</span> {quotation.bankdetails.ifsccode}</p>
                {quotation.bankdetails.upid && (
                  <p className="text-gray-700"><span className="font-semibold">UPI:</span> {quotation.bankdetails.upid}</p>
                )}
                

              </div>
            </div>
          )}

                     {/* Total Amount */}
           <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
             <h3 className="text-xl font-bold mb-4 text-gray-800">Amount Summary</h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-gray-700">Subtotal:</span>
                 <span className="font-semibold text-gray-800">₹{Number(subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-gray-700">Tax:</span>
                 <span className="font-semibold text-gray-800">₹{Number(totalTax).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
               </div>
               <div className="border-t border-gray-400 pt-3">
                 <div className="flex justify-between items-center">
                   <span className="text-xl font-bold text-gray-800">Total:</span>
                   <span className="text-2xl font-bold text-gray-800">₹{Number(totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                 </div>
                 <p className="text-gray-600 text-sm mt-2 text-center">
                   {totalAmountInWords} Rupees Only
                 </p>
               </div>
             </div>
           </div>
        </div>

        {/* Invoice Instructions */}
        {invoiceInstructions && (
          <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-gray-500 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              Instructions
            </h3>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {invoiceInstructions}
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-gray-500 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
            Terms & Conditions
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Payment is due within 30 days of invoice date</li>
            <li>Late payments may incur additional charges</li>
            <li>Goods once sold will not be taken back</li>
            <li>Warranty terms apply as per manufacturer guidelines</li>
            <li>All disputes are subject to local jurisdiction</li>
          </ul>
        </div>

        {/* Signature Section */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex-1">
            <div className="border-t-2 border-gray-300 pt-4 w-48">
              <p className="text-center text-gray-600 font-semibold">Customer Signature</p>
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="border-t-2 border-gray-300 pt-4 w-48 ml-auto">
              <p className="text-center text-gray-600 font-semibold">Authorized Signature</p>
              <p className="text-center text-gray-500 text-sm mt-2">{quotation.owner.compneyname}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                     <button
             onClick={handleGoToDashboard}
             className="bg-gray-600 text-white px-8 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 font-semibold border border-gray-500"
           >
             🏠 Back to Dashboard
           </button>
           <button
             onClick={handleSaveInvoice}
             className="bg-gray-800 text-white px-8 py-3 rounded-xl hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-1 font-semibold border border-gray-600"
           >
             💾 Save & Print Invoice
           </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-2xl font-bold text-gray-800 mb-2">Thank You!</p>
          <p className="text-gray-600">We appreciate your business</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumInvoice;
