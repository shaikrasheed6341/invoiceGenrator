import React, { useState } from "react";

const QuotationFetcher = () => {
    const [quotationNumber, setQuotationNumber] = useState("");
    const [quotation, setQuotation] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

            if (data.message) {
                setError(data.message);
                setQuotation(null);
            } else {
                setQuotation(data);
            }
        } catch (err) {
            setError("Failed to fetch data");
            setQuotation(null);
        }

        setLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Fetch Quotation</h2>

            {/* Input Box Outside */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="text-lg font-bold mb-2">Enter Quotation Number</h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Enter Quotation Number"
                        value={quotationNumber}
                        onChange={(e) => setQuotationNumber(e.target.value)}
                        className="p-2 border rounded w-full"
                    />
                    <button
                        onClick={fetchQuotation}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Fetch
                    </button>
                </div>
            </div>
            <div className="p-6 max-w-3xl mx-auto bg-gray-100 min-h-screen">


                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {/* Invoice Display */}
                {quotation && (
                    <div className="border p-6 rounded shadow bg-white ">
                        <div className="flex justify-between align-middle  border-t-6 bg-gray-100">
                            <h3 className="text-xl font-bold text-center mb-4 mr-3 mt-2">
                                Quotation No: {quotation.number}
                            </h3>


                            <p className="text-center m-2"><strong>Date:</strong> {new Date(quotation.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex justify-center  border-t-1 border-b-4 ">
                            {/* Owner Details */}
                            <div className="  mt-4 mr-35">
                                <h4 className="text-lg font-bold ">BILL TO</h4>
                                <p className="font-bold text-xl"><strong></strong> {quotation.customer.name}</p>
                                <p><strong></strong> {quotation.customer.address}</p>
                                <p><strong></strong> {quotation.customer.phone}</p>
                            </div>
                           

                            {/* Customer Details */}            
                            <div className="  ml-35 mt-4 mb-6">
                                <h4 className="text-lg font-bold ">SHIP TO</h4>
                                <p className="font-bold text-xl"><strong></strong> {quotation.customer.name}</p>
                                <p><strong></strong> {quotation.customer.address}</p>
                                <p><strong></strong> {quotation.customer.phone}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        
                        <table className="w-full border-collapse border mt-2">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Item</th>
                                    <th className="border p-2">Qty</th>
                                    <th className="border p-2">Rate</th>
                                    <th className="border p-2">Tax</th>
                                    <th className="border p-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(quotation.item) ? quotation.item : [quotation.item]).map((item, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border p-2">{item.name}</td>
                                        <td className="border p-2">{item.quantity}</td>
                                        <td className="border p-2">₹ {item.rate}</td>
                                        <td className="border p-2">{item.tax}%</td>
                                        <td className="border p-2">₹ {parseFloat(item.rate) + parseFloat(item.tax)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Total Amount */}
                        <h4 className="text-lg font-bold mt-4 text-right">
                            Total Amount: ₹ {quotation.totalAmount || "N/A"}
                        </h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotationFetcher;
