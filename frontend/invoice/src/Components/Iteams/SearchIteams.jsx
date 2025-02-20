import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const AllItemsTable = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [selectedItems, setSelectedItems] = useState([]);

    // Fetch all items from backend
    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/iteam/getalliteamdata");
            setItems(response.data || []);
        } catch (error) {
            toast.error("Error fetching items");
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Filter items based on search query
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Handle checkbox selection
    const handleCheckboxChange = (item) => {
        setSelectedItems((prev) => {
            const isSelected = prev.some((i) => i.id === item.id);
            return isSelected ? prev.filter((i) => i.id !== item.id) : [...prev, item];
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">All Products</h2>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border rounded-md w-1/3"
                />
            </div>

            {loading && <p className="text-center">Loading...</p>}

            {/* Main Table */}
            {!loading && currentItems.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 shadow-lg">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Brand</th>
                                <th className="border px-4 py-2">Quantity</th>
                                <th className="border px-4 py-2">Tax</th>
                                <th className="border px-4 py-2">Rate</th>
                                <th className="border px-4 py-2">Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className="text-center border-b hover:bg-gray-100">
                                    <td className="border px-4 py-2">{indexOfFirstItem + index + 1}</td>
                                    <td className="border px-4 py-2">{item.name}</td>
                                    <td className="border px-4 py-2">{item.brand}</td>
                                    <td className="border px-4 py-2">{item.quantity}</td>
                                    <td className="border px-4 py-2">{item.tax}</td>
                                    <td className="border px-4 py-2">{item.rate}</td>
                                    <td className="border px-4 py-2">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-5"
                                            onChange={() => handleCheckboxChange(item)}
                                            checked={selectedItems.some((i) => i.id === item.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md bg-blue-600 text-white"
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 border rounded-md ${
                                currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md bg-blue-600 text-white"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Show Selected Items Table Only When Items Are Selected */}
            {selectedItems.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-2">Selected Items</h3>
                    <table className="w-full border-collapse border border-gray-300 shadow-lg">
                        <thead className="bg-green-500 text-white">
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Brand</th>
                                <th className="border px-4 py-2">Quantity</th>
                                <th className="border px-4 py-2">Tax</th>
                                <th className="border px-4 py-2">Rate</th>
                                <th className="border px-4 py-2">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map((item, index) => (
                                <tr key={index} className="text-center border-b hover:bg-gray-100">
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{item.name}</td>
                                    <td className="border px-4 py-2">{item.brand}</td>
                                    <td className="border px-4 py-2">{item.quantity}</td>
                                    <td className="border px-4 py-2">{item.tax}</td>
                                    <td className="border px-4 py-2">{item.rate}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleCheckboxChange(item)}
                                            className="text-red-500 hover:text-red-700"
                                        >
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

export default AllItemsTable;
