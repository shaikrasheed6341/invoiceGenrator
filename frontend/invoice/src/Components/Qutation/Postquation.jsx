import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostQuotation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        number: "",
        owneremail: "",
        customerphone: "",
        bankdetailsaccountno: "",
        items: [{ name: "", quantity: "" }], // Updated to store name & quantity
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;
        setFormData({ ...formData, items: updatedItems });
    };

    const addItemField = () => {
        setFormData({ ...formData, items: [...formData.items, { name: "", quantity: "" }] });
    };

    const removeItemField = (index) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        if (!formData.number || !formData.owneremail || !formData.customerphone || !formData.bankdetailsaccountno) {
            toast.error("All fields are required!");
            setLoading(false);
            return;
        }

        // Prepare item names & quantities
        const itemNames = formData.items.map((item) => item.name.trim()).filter(Boolean);
        const itemQuantities = formData.items.map((item) => parseInt(item.quantity, 10) || 1);

        if (itemNames.length === 0) {
            toast.error("At least one item is required.");
            setLoading(false);
            return;
        }

        try {
            await axios.post("http://localhost:5000/quation/data", {
                number: formData.number,
                owneremail: formData.owneremail,
                customerphone: formData.customerphone,
                bankdetailsaccountno: formData.bankdetailsaccountno,
                itemNames,
                itemQuantities,
            });

            toast.success("Quotation created successfully!");
            setFormData({
                number: "",
                owneremail: "",
                customerphone: "",
                bankdetailsaccountno: "",
                items: [{ name: "", quantity: "" }],
            });
            setLoading(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating quotation");
            console.log(error)
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded shadow">
            <h3 className="font-light text-gray-400">Note: Remeber your quation number</h3>
            <h2 className="text-2xl font-bold mb-4">Create Quotation</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="text" name="number" placeholder="Quotation Number" value={formData.number} onChange={handleChange} className="p-2 border rounded" required />
                <input type="email" name="owneremail" placeholder="Owner Email" value={formData.owneremail} onChange={handleChange} className="p-2 border rounded" required />
                <input type="text" name="customerphone" placeholder="Customer Phone" value={formData.customerphone} onChange={handleChange} className="p-2 border rounded" required />
                <input type="text" name="bankdetailsaccountno" placeholder="Bank Account Number" value={formData.bankdetailsaccountno} onChange={handleChange} className="p-2 border rounded" required />

                <label className="font-bold">Items</label>
                {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input type="text" placeholder={`Item Name ${index + 1}`} value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} className="p-2 border rounded w-full" required />
                        <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="p-2 border rounded w-24" required />
                        <button type="button" onClick={() => removeItemField(index)} className="bg-red-500 text-white px-3 py-2 rounded">X</button>
                    </div>
                ))}

                <button type="button" onClick={addItemField} className="bg-green-500 text-white px-3 py-2 rounded">+ Add Item</button>

                <button type="submit" className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"}`} disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            <button onClick={() => navigate("/fetch")} className="mt-3 text-blue-600 underline">
                Go to Fetch Page
            </button>

            <ToastContainer />
        </div>
    );
};

export default PostQuotation;
