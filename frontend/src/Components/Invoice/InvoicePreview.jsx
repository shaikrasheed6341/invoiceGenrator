import React from "react";
import converter from 'number-to-words';

const InvoicePreview = ({ quotation }) => {
  if (!quotation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
        <div className="relative z-10 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] p-8 text-xl text-zinc-800">
          No Quotation Data!
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
        return total + (item.quantity * item.item.rate * (item.item.tax / 100));
      }, 0).toFixed(2) || "0.00"
    );
  };

  const calculateTotalAmount = (items) => {
    return (
      items?.reduce((total, item) => {
        return total + item.quantity * item.item.rate * (1 + item.item.tax / 100);
      }, 0).toFixed(2) || "0.00"
    );
  };

  const subtotal = calculateSubtotal(quotation.items);
  const totalTax = calculateTotalTax(quotation.items);
  const totalAmount = calculateTotalAmount(quotation.items);
  const totalAmountInWords = converter.toWords(totalAmount);

  return (
    <div className="min-h-screen flex items-center justify-center p-10 relative overflow-hidden bg-gray-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.2)_0%,_rgba(15,23,42,0)_70%)] pointer-events-none"></div>
      <div className="absolute top-[-15%] left-[-15%] w-96 h-96 bg-gradient-to-r from-[#8B5CF6]/20 to-[#1E3A8A]/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-112 h-112 bg-gradient-to-l from-[#6B21A8]/20 to-[#0F172A]/10 rounded-full blur-3xl animate-float delay-1000"></div>

      <div className="relative z-10 bg-white rounded-3xl shadow-[0_20px_60px_rgba(139,92,246,0.25)] w-full max-w-3xl p-6 transition-all duration-500 hover:shadow-[0_30px_90px_rgba(139,92,246,0.35)]">
        <div className="text-center mb-4 border-b border-gray-200 pt-2 pb-2">
          <h2 className="text-2xl font-extrabold text-transparent uppercase bg-zinc-800 bg-clip-text">
            {quotation.owner?.compneyname || "Company Name"}
          </h2>
          <p className="text-md text-zinc-600 mt-1">{quotation.owner?.address || "Address"}</p>
          <div className="flex justify-center mt-1 space-x-3 text-md text-zinc-800">
            <p><strong>Email:</strong> {quotation.owner?.email || "email@example.com"}</p>
            <p><strong>GST:</strong> {quotation.owner?.gstNumber || "GST Number"}</p>
            <p><strong>Phone:</strong> {quotation.owner?.phone || "Phone"}</p>
          </div>
        </div>

        {/* Quotation Info */}
        <div className="flex justify-between items-center bg-gradient-to-r from-gray-100 to-gray-50 p-2 rounded-xl mb-4">
          <h3 className="text-md font-semibold text-zinc-800">Quotation No: {quotation.number || "000"}</h3>
          <p className="text-md font-bold text-zinc-600">
            <strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>

        {/* Billing and Shipping Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-2 rounded-xl">
            <h4 className="text-sm font-semibold text-zinc-800 mb-1">Bill To</h4>
            <p className="font-medium text-md text-zinc-700">{quotation.customer?.name || "Customer Name"}</p>
            <p className="text-sm text-zinc-600 mt-1">
              {quotation.customer?.address || "Customer Address"}
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded-xl">
            <h4 className="text-sm font-semibold text-zinc-800 mb-1">Ship To</h4>
            <p className="font-medium text-md text-zinc-700">{quotation.customer?.name || "Customer Name"}</p>
            <p className="text-sm text-zinc-600 mt-1">
              {quotation.customer?.address || "Customer Address"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse bg-white rounded-xl shadow-sm">
            <thead className="bg-zinc-900 text-white">
              <tr>
                <th className="p-1 text-left text-md w-[40%]">Item</th>
                <th className="p-1 text-left text-md w-[10%]">Qty</th>
                <th className="p-1 text-left text-md w-[15%]">Rate</th>
                <th className="p-1 text-left text-md w-[15%]">Tax</th>
                <th className="p-1 text-left text-md w-[20%]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items?.length > 0 ? (
                quotation.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-2 text-md text-zinc-800 truncate">{item.item?.name || "N/A"}</td>
                    <td className="p-2 text-md text-zinc-800">{item.quantity || "0"}</td>
                    <td className="p-2 text-md text-zinc-800">₹ {Number(item.item?.rate || 0).toLocaleString('en-IN')}</td>
                    <td className="p-2 text-md text-zinc-800">{item.item?.tax || "0"}%</td>
                    <td className="p-2 text-md text-zinc-800">
                      ₹ {Number(item.quantity * item.item?.rate * (1 + item.item?.tax / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No items added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Amount */}
        <div className="text-right mb-4">
          <div className="space-y-1">
            <div className="flex justify-end items-center">
              <span className="text-sm text-zinc-600 mr-4">Subtotal (Before Tax):</span>
              <span className="text-sm font-medium">₹ {Number(subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-end items-center">
              <span className="text-sm text-zinc-600 mr-4">Total Tax:</span>
              <span className="text-sm font-medium text-blue-600">₹ {Number(totalTax).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-end items-center border-t border-gray-300 pt-1">
              <span className="text-sm font-semibold text-zinc-800 mr-4">Total Amount:</span>
              <span className="text-sm font-bold text-zinc-900">₹ {Number(totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <p className="text-xs mr-4 text-zinc-600 mt-2 capitalize leading-tight">
            <div className="flex justify-end text-xs text-black">{totalAmountInWords} Rupees </div>
          </p>
        </div>

        {/* Bank Details */}
        {quotation.bankdetails && (
          <div className="bg-gray-50 p-2 rounded-xl mb-4">
            <h4 className="text-md font-semibold text-zinc-800 mb-1">Bank Details</h4>
            <p className="text-sm my-0.5 text-zinc-700"><strong>Bank Name:</strong> {quotation.bankdetails.bank}</p>
            <p className="text-sm my-0.5 text-zinc-700"><strong>Account No:</strong> {quotation.bankdetails.accountno}</p>
            <p className="text-sm my-0.5 text-zinc-700"><strong>IFSC Code:</strong> {quotation.bankdetails.ifsccode}</p>
          </div>
        )}

        {/* Payment Details & QR Code */}
        <div className="bg-gray-50 p-2 rounded-xl flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-md font-semibold my-1 text-zinc-800">Payment Details</h3>
            <p className="text-sm mt-0.5 text-zinc-700"><strong>UPI ID:</strong> {quotation.bankdetails?.upid || "N/A"}</p>
            <p className="text-sm mt-0.5 text-zinc-700"><strong>UPI Name:</strong> {quotation.bankdetails?.upidname || "N/A"}</p>
          </div>
          <div className="flex mr-90">
            <img src="./qrcode.png" alt="QR Code" className="w-20 h-20" />
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-zinc-800 mb-2">Terms & Conditions</h3>
          <ul className="list-disc list-outside pl-4 text-sm text-zinc-600 space-y-1.5">
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

        {/* Footer */}
        <div className="text-center text-md font-semibold text-zinc-800 border-t border-gray-200 pt-2">
          Thank You
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview; 