import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostQuotation = () => {
    const navigate = useNavigate();
    const nextpage = ()=>{
        navigate("/quataion")
    }
    const [formData, setFormData] = useState({
        number: "", // Quotation Number
        ownerId: "",
        customerId: "",
        bankdetailsId: "",
        items: [""], // Array for item IDs
    });

    // Handle input changes (for all fields except items)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle item array changes
    const handleItemChange = (index, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = value;
        setFormData({ ...formData, items: updatedItems });
    };

    // Add a new item input field
    const addItemField = () => {
        setFormData({ ...formData, items: [...formData.items, ""] });
    };

    // Remove an item field
    const removeItemField = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/quation/data", {
                ...formData,
                itemIds: formData.items.filter((item) => item.trim() !== ""), // Remove empty items
            });

            console.log("Success:", response.data);
            toast.success("Quotation created successfully!");

            // Reset form after success
            setTimeout(() => {
                setFormData({
                    number: "",
                    ownerId: "",
                    customerId: "",
                    bankdetailsId: "",
                    items: [""],
                });
            }, 500);
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Error creating quotation");
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Create Quotation</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Quotation Number */}
                <input
                    type="text"
                    name="number"
                    placeholder="Quotation Number"
                    value={formData.number}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />

                {/* Owner ID */}
                <input
                    type="text"
                    name="ownerId"
                    placeholder="Owner ID"
                    value={formData.ownerId}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />

                {/* Customer ID */}
                <input
                    type="text"
                    name="customerId"
                    placeholder="Customer ID"
                    value={formData.customerId}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />

                {/* Bank Details ID */}
                <input
                    type="text"
                    name="bankdetailsId"
                    placeholder="Bank Details ID"
                    value={formData.bankdetailsId}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />

                {/* Dynamic Item Fields */}
                <label className="font-bold">Items</label>
                {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            placeholder={`Item ID ${index + 1}`}
                            value={item}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                            className="p-2 border rounded w-full"
                        />
                        <button
                            type="button"
                            onClick={() => removeItemField(index)}
                            className="bg-red-500 text-white px-3 py-2 rounded"
                        >
                            X
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItemField}
                    className="bg-green-500 text-white px-3 py-2 rounded"
                >
                    + Add Item
                </button>

                {/* Submit Button */}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Submit
                </button>
            </form>
            <button onClick={nextpage}>next</button>

            <ToastContainer />
        </div>
    );
};

export default PostQuotation;
