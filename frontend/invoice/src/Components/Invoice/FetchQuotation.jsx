import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
            const response = await fetch(`http://localhost:5000/quation/getdata/${quotationNumber}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch quotation");
            }

            // Navigate to invoice page with fetched data
            navigate("/invoice", { state: { quotation: data } });

        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
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
                        className={`bg-blue-600 text-white px-4 py-2 rounded ${
                            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Fetching..." : "Fetch"}
                    </button>
                </div>
                {error && <p className="text-red-600 text-center mt-3">{error}</p>}
            </div>
        </div>
    );
};

export default FetchQuotation;
