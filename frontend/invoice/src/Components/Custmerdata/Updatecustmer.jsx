import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateCustomer = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        address: "",
    });

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Update Request
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!phone) {
            toast.error("Please enter your phone number.");
            return;
        }
        try {
            const response = await axios.put(`http://localhost:5000/custmor/${phone}`, formData);
            toast.success(response.data.message, { transition: Bounce });
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating customer.");
            console.error("Error updating customer:", err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#091235] to-[#003B73]">
            <div className="flex bg-white rounded-xl shadow-lg overflow-hidden w-[1000px]">

                {/* Left Side - Branding */}
                <div className="w-1/2 flex flex-col items-center justify-center border-r-8 border-[#003B73] p-5">
                    <h1 className="text-5xl font-bold text-[#003B73] mb-10">IT PARTNER</h1>
                    <img src="./logo.svg" alt="Company Logo" className="max-w-full h-auto" />
                </div>

                {/* Right Side - Form */}
                <div className="w-1/2 p-12">
                    <h3 className="text-4xl font-bold text-center text-[#003B73] mb-6">Update Customer</h3>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all p-2 w-full rounded-lg"
                                placeholder="Enter your phone number"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all p-2 w-full rounded-lg"
                                placeholder="Enter new name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all p-2 w-full rounded-lg"
                                placeholder="Enter new address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg p-3 w-full rounded-lg transition-all mt-4 shadow-md"
                        >
                            Update Customer
                        </button>

                        <div className="flex justify-between mt-4">
                            <button className="p-3 bg-black text-white shadow-md font-bold w-40" onClick={() => navigate(-1)}>
                                Go Back
                            </button>
                            <button className="p-3 bg-[#000000] text-white shadow-md font-bold w-40">
                                Get All Customers
                            </button>
                        </div>
                    </form>

                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default UpdateCustomer;
