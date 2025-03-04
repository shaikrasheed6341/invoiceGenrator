import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const InsertItems = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [successRows, setSuccessRows] = useState([]);
    const [newRow, setNewRow] = useState({ name: "", brand: "", quantity: "", tax: "", rate: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRow((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitRow = async () => {
        try {
            const response = await axios.post("http://localhost:5000/iteam/datas", newRow);

            if (response.status === 200) {
                toast.success("Item added successfully");
                setSuccessRows([...successRows, newRow]); // Add to the success table
                setNewRow({ name: "", brand: "", quantity: "", tax: "", rate: "" }); // Reset form
            }
        } catch (error) {
            toast.error("Error adding item");
            console.error("Error adding item:", error);
        }
    };

    const handleDeleteRow = (index) => {
        const updatedRows = successRows.filter((_, i) => i !== index);
        setSuccessRows(updatedRows);
    };

    return (
        <div className="p-6">
            <button
                onClick={() => navigate("/getalliteams")}
                className="bg-green-600 text-white font-semibold p-3 rounded-lg transition-all shadow-md mb-8"
            >
                Find Product
            </button>

            <div className="flex space-x-4 mb-6">
                <input type="text" name="name" value={newRow.name} onChange={handleInputChange} className="p-2 border rounded w-1/5" placeholder="Enter item name" />
                <input type="text" name="brand" value={newRow.brand} onChange={handleInputChange} className="p-2 border rounded w-1/5" placeholder="Enter brand" />
                <input type="text" name="quantity" value={newRow.quantity} onChange={handleInputChange} className="p-2 border rounded w-1/5" placeholder="Enter quantity" />
                <input type="text" name="tax" value={newRow.tax} onChange={handleInputChange} className="p-2 border rounded w-1/5" placeholder="Enter tax" />
                <input type="text" name="rate" value={newRow.rate} onChange={handleInputChange} className="p-2 border rounded w-1/5" placeholder="Enter price" />
                <button onClick={handleSubmitRow} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-all shadow-md">
                    Add Product
                </button>
            </div>

            {successRows.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Successfully Added Items</h2>
                    <table className="w-full border-collapse border border-gray-300 shadow-lg">
                        <thead className="bg-green-500 text-white">
                            <tr>
                                <th className="border px-4 py-2">Product Name</th>
                                <th className="border px-4 py-2">Brand</th>
                                <th className="border px-4 py-2">Quantity</th>
                                <th className="border px-4 py-2">Tax</th>
                                <th className="border px-4 py-2">Price</th>
                                
                                <th className="border px-4 py-2">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {successRows.map((row, index) => (
                                <tr key={index} className="text-center border-b border-gray-300">
                                    <td className="border px-4 py-2">{row.name}</td>
                                    <td className="border px-4 py-2">{row.brand}</td>
                                    <td className="border px-4 py-2">{row.quantity}</td>
                                    <td className="border px-4 py-2">{row.tax}</td>
                                    <td className="border px-4 py-2">{row.rate}</td>

                                    <td className="border px-4 py-2">
                                        <button onClick={() => handleDeleteRow(index)} className="bg-red-500 hover:bg-red-700 text-white p-2 rounded">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default InsertItems;
