import React from "react";
import { useLocation } from "react-router-dom";

const Invoice = () => {
    const location = useLocation();
    const quotation = location.state?.quotation;

    if (!quotation) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl">
                No Quotation Found!
            </div>
        );
    }

    const calculateTotalAmount = (items) => {
        return items?.reduce((total, item) => {
            return total + item.quantity * item.item.rate * (1 + item.item.tax / 100);
        }, 0).toFixed(2) || "0.00";
    };

    return (
        <div className="invoice-container min-h-screen bg-gray-50 py-10">
            <div className="invoice max-w-4xl mx-auto bg-white p-5 rounded-lg shadow-lg">
                {/* Business Info */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold uppercase">{quotation.owner.compneyname}</h2>
                    <p className="text-sm mt-1">{quotation.owner.address}</p>
                    <div className="flex justify-center mt-2 space-x-4">
                        <p className="text-sm font-bold">{quotation.owner.email}</p>
                        <p className="text-sm font-bold">{quotation.owner.gstNumber}</p>
                        <p className="text-sm font-bold">{quotation.owner.phone}</p>
                    </div>
                </div>

                {/* Quotation Info */}
                <div className="flex justify-between bg-gray-100 p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-semibold">Quotation No: {quotation.number}</h3>
                    <p className="text-gray-700"><b>Date:</b> {new Date().toLocaleDateString("en-IN")}</p>
                </div>

                {/* Billing and Shipping Info */}
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
                <table className="w-full mt-6 border-collapse">
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
                        {quotation.items?.map((item, index) => (
                            <tr key={index} className="text-center bg-white border-b">
                                <td className="p-3">{item.item?.name || "N/A"}</td>
                                <td className="p-2">{item.quantity || "0"}</td>
                                <td className="p-2">₹ {item.item?.rate || "0"}</td>
                                <td className="p-2">{item.item?.tax || "0"}%</td>
                                <td className="p-2">
                                    ₹ {(item.quantity * item.item?.rate * (1 + item.item?.tax / 100)).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total Amount */}
                <h4 className="text-md font-bold mt-4 text-right mr-14">
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

                {/* Payment Details & QR Code */}
                <div className="mt-6 p-4 border-t bg-gray-50 rounded-md flex items-center gap-4">
                    <div className="space-y-2">
                        <h3 className="pb-2 font-bold text-lg">Payment Details</h3>
                        <p><strong>UPI ID:</strong> {quotation.bankdetails?.upid || "N/A"}</p>
                        <p><strong>UPI Name:</strong> {quotation.bankdetails?.upidname || "N/A"}</p>
                    </div>
                    <img src="./qrcode.png" alt="QR Code" className="w-24 h-24 ml-6" />
                </div>

                {/* Terms & Conditions */}
                <div className="mt-6 p-4 border-t bg-gray-50 rounded-md">
                    <h3 className="font-semibold text-lg mb-2">Terms & Conditions</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        <li>Goods once sold will not be taken back.</li>
                        <li>Goods should be checked at the time of delivery. The company will not be responsible for any damage after delivery.</li>
                        <li>Any bank charges will be borne by the client.</li>
                        <li>Delayed payments (10-20 days) for non-product items (CPU, Laptop, etc.) will incur a 2% interest charge.</li>
                        <li>A card copy is mandatory with the product.</li>
                    </ul>
                </div>
                <div className="mt-2 border-t-2  font-semibold text-2xl flex justify-center " >Thank You </div>
            </div>

            {/* CSS for Printing */}
            <style>
                {`
                    @media print {
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .invoice {
                            width: 100%;
                            max-width: 800px;
                            padding: 20px;
                            background: white;
                            box-shadow: none;
                        }
                        .invoice-container {
                            background: white;
                        }
                        table {
                            width: 100%;
                            font-size: 12px;
                            border-collapse: collapse;
                        }
                        th, td {
                            padding: 5px;
                            border-top: 1px solid black;
                            border-left: none;
                            border-right: none;
                            border-bottom: none;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Invoice;
