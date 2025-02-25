import React, { useState } from "react";

const QuotationFetcher = () => {
    const [quotationNumber, setQuotationNumber] = useState("");
    const [quotation, setQuotation] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showInput, setShowInput] = useState(true); // Controls input visibility

    const fetchQuotation = async () => {
        if (!quotationNumber) {
            setError("Please enter a quotation number.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`http://localhost:5000/quation/getdata/${quotationNumber}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch quotation");
            }

            setQuotation(data);
            setShowInput(false); // Hide input and fetch button
        } catch (err) {
            setError(err.message);
            setQuotation(null);
        }

        setLoading(false);
    };

    // Calculate total amount dynamically
    const calculateTotalAmount = (items) => {
        return items?.reduce((total, item) => {
            return total + item.quantity * item.item.rate * (1 + item.item.tax / 100);
        }, 0).toFixed(2) || "0.00";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            {/* Input Section - Hidden After Fetch */}
            {showInput && (
                <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-center mb-4">Fetch Quotation</h3>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="Enter Quotation Number"
                            value={quotationNumber}
                            onChange={(e) => setQuotationNumber(e.target.value)}
                            className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={fetchQuotation}
                            className={`bg-blue-600 text-white px-4 py-2 rounded transition-all ${
                                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Fetching..." : "Fetch"}
                        </button>
                    </div>
                    {error && <p className="text-red-600 text-center mt-3">{error}</p>}
                </div>
            )}

            {/* Quotation Display */}
            {quotation && (
                <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
                    {/* Company Details */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold uppercase">{quotation.owner.compneyname}</h2>
                        <p className="text-sm mt-1">{quotation.owner.address}</p>

                        {/* Contact Info */}
                        <div className="flex justify-center mt-2 space-x-4">
                            <p className="text-sm font-bold">{quotation.owner.email}</p>
                            <p className="text-sm font-bold">{quotation.owner.gstNumber}</p>
                            <p className="text-sm font-bold">{quotation.owner.phone}</p>
                        </div>
                    </div>

                    {/* Quotation Info */}
                    <div className="flex justify-between bg-gray-100 p-4 rounded-md shadow-sm">
                        <h3 className="text-lg"><strong>Quotation No:</strong> {quotation.number}</h3>
                        <p className="text-gray-700"><strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}</p>
                    </div>

                    {/* Billing & Shipping Details */}
                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-lg font-bold mb-2">BILL TO</h4>
                            <p className="font-semibold">{quotation.customer?.name}</p>
                            <p className="text-sm text-gray-700 mt-1">{quotation.customer?.address || "No address provided"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-lg font-bold mb-2">SHIP TO</h4>
                            <p className="font-semibold">{quotation.customer?.name}</p>
                            <p className="text-sm text-gray-700 mt-1">{quotation.customer?.address || "No address provided"}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full mt-6 border-collapse shadow-lg">
                        <thead className="border-b">
                            <tr>
                                <th className="p-2">Item</th>
                                <th className="p-2">Qty</th>
                                <th className="p-2">Rate</th>
                                <th className="p-2">Tax</th>
                                <th className="p-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotation.items && quotation.items.length > 0 ? (
                                quotation.items.map((item) => (
                                    <tr key={item.id} className="text-center bg-white border-b">
                                        <td className="p-3">{item.item.name || "N/A"}</td>
                                        <td className="p-2">{item.quantity || "0"}</td>
                                        <td className="p-2">₹ {item.item.rate || "0"}</td>
                                        <td className="p-2">{item.item.tax || "0"}%</td>
                                        <td className="p-2">
                                            ₹ {(item.quantity * item.item.rate * (1 + item.item.tax / 100)).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-500 p-2">No items available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Total Amount */}
                    <h4 className="text-lg font-bold mt-6 text-right">
                        Total: <span className="font-bold">₹ {calculateTotalAmount(quotation.items)}</span>
                    </h4>

                    {/* Bank Details */}
                    {quotation.bankdetails && (
                        <div className="mt-6 p-4 border-t bg-gray-50 rounded-md">
                            <h4 className="text-lg font-bold mb-2">Bank Details</h4>
                            <p><strong>Bank Name:</strong> {quotation.bankdetails.bank}</p>
                            <p><strong>Account No:</strong> {quotation.bankdetails.accountno}</p>
                            <p><strong>IFSC Code:</strong> {quotation.bankdetails.ifsccode}</p>
                        </div>
                    )}

                    {/* Payment Details */}
                    <div className="mt-6 p-4 border-t bg-gray-50 rounded-md">
                        <h3 className="pb-2 font-bold text-lg">Payment Details</h3>
                        <p><strong>UPI ID:</strong> {quotation.bankdetails.upid}</p>
                        <p><strong>UPI Name:</strong> {quotation.bankdetails.upidname}</p>
                    </div>

                    {/* Button to Fetch Another Quotation */}
                    <button
                        onClick={() => {
                            setQuotation(null);
                            setShowInput(true); // Show input again
                            setQuotationNumber(""); // Clear input field
                        }}
                        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Fetch Another Quotation
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuotationFetcher;
