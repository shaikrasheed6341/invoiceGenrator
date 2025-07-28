import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import converter from 'number-to-words'

// Utility function to convert number to words (Indian English)

const TemplateTwo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const quotation = location.state?.quotation;

    if (!quotation) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-100 pointer-events-none"></div>
                <div className="relative z-10 bg-white rounded-3xl shadow-lg p-4 sm:p-8 text-lg sm:text-xl text-gray-800">
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
    const totalAmountInWords = converter.toWords(totalAmount)
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
                                .total-card {
                                    padding: 12px;
                                }
                                .grid-2 {
                                    gap: 8px;
                                }
                                .signature-box {
                                    height: 50px;
                                    margin-bottom: 8px;
                                }
                                h2 { font-size: 18px; margin-bottom: 8px; }
                                h3 { font-size: 14px; margin-bottom: 6px; }
                                h4 { font-size: 12px; margin-bottom: 4px; }
                                p { margin-bottom: 4px; }
                                ul { margin-bottom: 8px; }
                                li { margin-bottom: 2px; }
                                .mb-8 { margin-bottom: 8px !important; }
                                .mb-6 { margin-bottom: 6px !important; }
                                .mb-4 { margin-bottom: 4px !important; }
                                .p-6 { padding: 8px !important; }
                                .p-4 { padding: 6px !important; }
                                .p-3 { padding: 4px !important; }
                                .pt-6 { padding-top: 8px !important; }
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
                                background-color: #111827; 
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
                                background: #111827;
                                color: white;
                                padding: 20px;
                                border-radius: 8px;
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
                                border-left: 4px solid #374151;
                            }
                            .total-card {
                                background: #111827;
                                color: white;
                                padding: 20px;
                                border-radius: 8px;
                                text-align: center;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            }
                            .grid-2 {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 16px;
                            }
                            @media (max-width: 768px) {
                                .grid-2 {
                                    grid-template-columns: 1fr;
                                }
                            }
                            .signature-box {
                                border: 2px solid #d1d5db;
                                height: 80px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin-bottom: 16px;
                                color: #6b7280;
                            }
                            .button {
                                background: #111827;
                                color: white;
                                padding: 12px 24px;
                                border-radius: 8px;
                                border: none;
                                cursor: pointer;
                                margin: 8px;
                                font-weight: bold;
                            }
                            .button:hover {
                                background: #374151;
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
        <div className="min-h-screen flex items-center justify-center p-1 sm:p-2 lg:p-4 relative overflow-hidden bg-gray-50">

            <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-2xl p-2 sm:p-3 lg:p-4 transition-all duration-500 invoice-content">
                {/* Modern Template Header */}
                <div className="text-center mb-2 sm:mb-3 lg:mb-4 bg-gray-900 text-white rounded-lg p-2 sm:p-3 shadow-lg">
                    <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold mb-1">
                        {quotation.owner.compneyname}
                    </h2>
                    <p className="text-xs sm:text-xs lg:text-sm xl:text-base text-gray-300 mb-1 sm:mb-2">{quotation.owner.address}</p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-0.5 sm:space-y-0 sm:space-x-2 lg:space-x-4 text-xs text-gray-300">
                        <span><strong>Email:</strong> {quotation.owner.email}</span>
                        <span><strong>GST:</strong> {quotation.owner.gstNumber}</span>
                        <span><strong>Phone:</strong> {quotation.owner.phone}</span>
                    </div>
                </div>

                {/* Quotation Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800 text-white p-1.5 sm:p-2 rounded-lg mb-2 sm:mb-3 lg:mb-4 shadow-lg">
                    <h3 className="text-xs sm:text-xs lg:text-sm xl:text-base font-bold mb-0.5 sm:mb-0">Quotation No: {quotation.number}</h3>
                    <p className="text-xs sm:text-xs lg:text-sm xl:text-base font-bold">
                        <strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}
                    </p>
                </div>

                {/* Billing and Shipping Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
                    <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-lg border-l-4 border-gray-800">
                        <h4 className="text-xs sm:text-xs lg:text-sm font-bold text-gray-800 mb-0.5 sm:mb-1">Bill To</h4>
                        <p className="font-bold text-xs sm:text-xs lg:text-sm text-gray-900 mb-0.5">{quotation.customer?.name}</p>
                        <p className="text-xs text-gray-700 mb-0.5">
                            {quotation.customer?.address || "No address provided"}
                        </p>
                        <p className="text-xs text-gray-700 mb-0.5">
                            <strong>GST:</strong> {quotation.customer?.gstNumber || "No GST provided"}
                        </p>
                        <p className="text-xs text-gray-700">
                            <strong>PAN:</strong> {quotation.customer?.pannumber || "No Pan number provided"}
                        </p>
                    </div>
                    <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-lg border-l-4 border-gray-600">
                        <h4 className="text-xs sm:text-xs lg:text-sm font-bold text-gray-700 mb-0.5 sm:mb-1">Ship To</h4>
                        <p className="font-bold text-xs sm:text-xs lg:text-sm text-gray-900 mb-0.5">{quotation.customer?.name}</p>
                        <p className="text-xs text-gray-700">
                            {quotation.customer?.address || "No address provided"}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto mb-2 sm:mb-3 lg:mb-4">
                    <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden text-xs">
                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="p-1 sm:p-1.5 lg:p-2 text-left font-bold">Item</th>
                                <th className="p-1 sm:p-1.5 lg:p-2 text-left font-bold">Qty</th>
                                <th className="p-1 sm:p-1.5 lg:p-2 text-left font-bold">Rate</th>
                                <th className="p-1 sm:p-1.5 lg:p-2 text-left font-bold">Tax</th>
                                <th className="p-1 sm:p-1.5 lg:p-2 text-left font-bold">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotation.items?.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="p-1 sm:p-1.5 lg:p-2 text-gray-900 font-medium">{item.item?.name || "N/A"}</td>
                                    <td className="p-1 sm:p-1.5 lg:p-2 text-gray-900">{item.quantity || "0"}</td>
                                    <td className="p-1 sm:p-1.5 lg:p-2 text-gray-900">₹ {item.item?.rate || "0"}</td>
                                    <td className="p-1 sm:p-1.5 lg:p-2 text-gray-900">{item.item?.tax || "0"}%</td>
                                    <td className="p-1 sm:p-1.5 lg:p-2 text-gray-900 font-bold">
                                        ₹ {(item.quantity * item.item?.rate * (1 + item.item?.tax / 100)).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
                    {/* Bank Details */}
                    {quotation.bankdetails && (
                        <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-lg border-l-4 border-gray-700">
                            <h4 className="text-xs sm:text-xs lg:text-sm font-bold text-gray-700 mb-0.5 sm:mb-1">Bank Details</h4>
                            <div className="space-y-0.5">
                                <p className="text-xs text-gray-700"><strong>Bank Name:</strong> {quotation.bankdetails.bank}</p>
                                <p className="text-xs text-gray-700"><strong>Account No:</strong> {quotation.bankdetails.accountno}</p>
                                <p className="text-xs text-gray-700"><strong>IFSC Code:</strong> {quotation.bankdetails.ifsccode}</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Total Amount*/} 
                    <div className="bg-gray-900 text-white p-2 sm:p-3 rounded-lg shadow-lg">
                        <div className="text-center">
                            <h4 className="text-xs sm:text-xs lg:text-sm xl:text-base font-bold mb-0.5">
                                TOTAL AMOUNT
                            </h4>
                            <h4 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold mb-0.5 sm:mb-1">
                                ₹ {totalAmount}
                            </h4>
                            <div className="text-center">
                                <p className="text-xs font-medium leading-tight">
                                    {totalAmountInWords} Rupees
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="bg-white p-1.5 sm:p-2 lg:p-3 rounded-lg shadow-lg border-l-4 border-gray-600 mb-2 sm:mb-3 lg:mb-4">
                    <div className="space-y-0.5 sm:space-y-1">
                        <h3 className="text-xs sm:text-xs lg:text-sm xl:text-base font-bold text-gray-800">Payment Details</h3>
                        <p className="text-xs text-gray-700"><strong>UPI ID:</strong> {quotation.bankdetails?.upid || "N/A"}</p>
                        <p className="text-xs text-gray-700"><strong>UPI Name:</strong> {quotation.bankdetails?.upidname || "N/A"}</p>
                    </div>
                </div>

                {/* Signature */}
                <div className="flex justify-end mb-2 sm:mb-3 lg:mb-4">
                    <div className="bg-white p-1 sm:p-2 lg:p-3 rounded-lg shadow-lg border-l-4 border-gray-400 w-full sm:w-36 lg:w-1/2  ">
                        <div className="text-center">
                            <div className="border-2 border-gray-300 h-8 sm:h-10 lg:h-12 w-full mb-1 sm:mb-2 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">Signature</span>
                            </div>
                            <p className="text-xs font-bold text-gray-700 mb-0.5">AUTHORISED SIGNATORY FOR</p>
                            <p className="text-xs sm:text-xs lg:text-sm xl:text-base font-bold text-gray-900">{quotation.owner.compneyname}</p>
                        </div>
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-white p-1 sm:p-1.5 lg:p-2 rounded-lg shadow-lg border-l-4 border-gray-500 mb-2 sm:mb-3 lg:mb-4">
                    <h3 className="text-xs font-bold text-gray-700 mb-0.5 sm:mb-1">Terms & Conditions</h3>
                    <ul className="list-disc list-outside pl-1.5 sm:pl-2 text-xs text-gray-700 space-y-0.5">
                        <li className="leading-tight text-xs">
                            Goods once sold will not be taken back.
                        </li>
                        <li className="leading-tight text-xs">
                            Bill hard copy is mandatory with the product in case of any warranty-related matter or replacement to the service centre.
                        </li>
                        <li className="leading-tight text-xs">
                            No bank transfer will be accepted without prior intimation to us.
                        </li>
                        <li className="leading-tight text-xs">
                            Service to product may take a minimum of 15 to 20 days, even for new products (CPU, Laptop, DVR/Cameras, or HDD).
                        </li>
                        <li className="leading-tight text-xs">
                            An advance payment of 70% of the total project cost is required to initiate the work. The remaining 30% will be due upon completion or as per the agreed-upon payment schedule. Work will commence only after the advance payment has been received.
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center space-y-1.5 sm:space-y-0 sm:space-x-3 mb-2 mt-2 sm:mt-3 lg:mt-4">
                    <button
                        onClick={handleGoToDashboard}
                        className="bg-gray-900 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg text-xs sm:text-xs lg:text-sm"
                    >
                        🏠 Go to Dashboard
                    </button>
                    <button
                        onClick={handleSaveInvoice}
                        className="bg-gray-700 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg text-xs sm:text-xs lg:text-sm"
                    >
                        💾 Save Invoice
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center text-xs sm:text-xs lg:text-sm xl:text-base font-bold text-gray-900 border-t-2 border-gray-300 pt-2 sm:pt-3 lg:pt-4">
                    Thank You
                </div>
            </div>

        </div>
    );
};

export default TemplateTwo;