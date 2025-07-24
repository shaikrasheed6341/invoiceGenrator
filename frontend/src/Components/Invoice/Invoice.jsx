import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import converter from 'number-to-words'

// Utility function to convert number to words (Indian English)

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quotation = location.state?.quotation;

  if (!quotation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
        <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] p-8 text-xl text-zinc-800">
          No Quotation Found!
        </div>
      </div>
    );
  }

  const calculateTotalAmount = (items) => {
    return (
      items?.reduce((total, item) => {
        return total + item.quantity * item.item.rate * (1 + item.item.tax / 100);
      }, 0).toFixed(2) || "0.00"
    );
  };

  const totalAmount = calculateTotalAmount(quotation.items);
  const totalAmountInWords =converter.toWords(totalAmount)
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
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .invoice-container { max-width: 800px; margin: 0 auto; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .total { font-weight: bold; text-align: right; }
              .header { text-align: center; margin-bottom: 20px; }
              .footer { text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              ${invoiceContent.innerHTML}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      
      // Try to print, if it fails, just show the window
      try {
        printWindow.print();
      } catch (error) {
        console.log('Print failed, showing window instead');
      }
    } else {
      // Fallback: just print the current page
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-10 relative overflow-hidden bg-gray-50">

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-112 h-112 bg-gradient-to-l from-[#6B21A8]/20 to-[#0F172A]/10 rounded-full blur-3xl animate-float delay-1000"></div>


      <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-4xl p-8 transition-all duration-500 invoice-content">
        {/* Standard Template Header */}
        <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {quotation.owner.compneyname}
          </h2>
          <p className="text-lg text-gray-600 mb-3">{quotation.owner.address}</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-700">
            <span><strong>Email:</strong> {quotation.owner.email}</span>
            <span><strong>GST:</strong> {quotation.owner.gstNumber}</span>
            <span><strong>Phone:</strong> {quotation.owner.phone}</span>
          </div>
        </div>

        {/* Quotation Info */}
        <div className="flex justify-between items-center bg-gray-100 p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Quotation No: {quotation.number}</h3>
          <p className="text-lg font-semibold text-gray-700">
            <strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>

        {/* Billing and Shipping Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-300 p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Bill To</h4>
            <p className="font-semibold text-lg text-gray-900 mb-1">{quotation.customer?.name}</p>
            <p className="text-gray-700">
              {quotation.customer?.address || "No address provided"}
            </p>
          </div>
          <div className="border border-gray-300 p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">Ship To</h4>
            <p className="font-semibold text-lg text-gray-900 mb-1">{quotation.customer?.name}</p>
            <p className="text-gray-700">
              {quotation.customer?.address || "No address provided"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left text-lg font-semibold border border-gray-300">Item</th>
                <th className="p-3 text-left text-lg font-semibold border border-gray-300">Qty</th>
                <th className="p-3 text-left text-lg font-semibold border border-gray-300">Rate</th>
                <th className="p-3 text-left text-lg font-semibold border border-gray-300">Tax</th>
                <th className="p-3 text-left text-lg font-semibold border border-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-lg text-gray-900 border border-gray-300">{item.item?.name || "N/A"}</td>
                  <td className="p-3 text-lg text-gray-900 border border-gray-300">{item.quantity || "0"}</td>
                  <td className="p-3 text-lg text-gray-900 border border-gray-300">₹ {item.item?.rate || "0"}</td>
                  <td className="p-3 text-lg text-gray-900 border border-gray-300">{item.item?.tax || "0"}%</td>
                  <td className="p-3 text-lg text-gray-900 border border-gray-300 font-semibold">
                    ₹ {(item.quantity * item.item?.rate * (1 + item.item?.tax / 100)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="text-right mb-6 border-t-2 border-gray-300 pt-4">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">
            Total Amount: <span className="text-3xl font-bold text-gray-900">₹ {totalAmount}</span>
          </h4>
          <p className="text-lg text-gray-700 capitalize">
            <strong>In Words:</strong> {totalAmountInWords} Rupees
          </p>
        </div>

        {/* Bank Details */}
        {quotation.bankdetails && (
          <div className="border border-gray-300 p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Bank Details</h4>
            <div className="grid grid-cols-1 gap-2">
              <p className="text-lg text-gray-700"><strong>Bank Name:</strong> {quotation.bankdetails.bank}</p>
              <p className="text-lg text-gray-700"><strong>Account No:</strong> {quotation.bankdetails.accountno}</p>
              <p className="text-lg text-gray-700"><strong>IFSC Code:</strong> {quotation.bankdetails.ifsccode}</p>
            </div>
          </div>
        )}

        {/* Payment Details & QR Code */}
        <div className="border border-gray-300 p-4 mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
            <p className="text-lg text-gray-700"><strong>UPI ID:</strong> {quotation.bankdetails?.upid || "N/A"}</p>
            <p className="text-lg text-gray-700"><strong>UPI Name:</strong> {quotation.bankdetails?.upidname || "N/A"}</p>
          </div>
          <div className="flex">
            <img src="./qrcode.png" alt="QR Code" className="w-24 h-24 border border-gray-300" />
          </div>
        </div>
        <div className="border border-gray-300 p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Terms & Conditions</h3>
          <ul className="list-disc list-outside pl-6 text-lg text-gray-700 space-y-2">
            <li className="leading-relaxed">
              Goods once sold will not be taken back.
            </li>
            <li className="leading-relaxed">
              Bill hard copy is mandatory with the product in case of any warranty-related matter or replacement to the service centre.
            </li>
            <li className="leading-relaxed">
              No bank transfer will be accepted without prior intimation to us.
            </li>
            <li className="leading-relaxed">
              Service to product may take a minimum of 15 to 20 days, even for new products (CPU, Laptop, DVR/Cameras, or HDD).
            </li>
            <li className="leading-relaxed">
              An advance payment of 70% of the total project cost is required to initiate the work. The remaining 30% will be due upon completion or as per the agreed-upon payment schedule. Work will commence only after the advance payment has been received.
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-4 mt-6">
          <button
            onClick={handleGoToDashboard}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            🏠 Go to Dashboard
          </button>
          <button
            onClick={handleSaveInvoice}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            💾 Save Invoice
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-2xl font-bold text-gray-900 border-t-2 border-gray-300 pt-4">
          Thank You
        </div>
      </div>

    </div>
  );
};

export default Invoice;