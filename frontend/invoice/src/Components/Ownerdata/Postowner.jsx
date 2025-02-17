import React, { useState } from "react";
import axios from "axios";
// Ensure correct path to your logo
//import logo from "../public/logo.svg";

const Sudmitownerdata = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = { name, email, phone, gstNumber };
        try {
            const res = await axios.post("http://localhost:5000/owners/insertownerdata", formData);
            setSuccess(res.data.message);
        } catch (err) {
            console.error(err);
            setSuccess("Submission failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600">
            {/* Container with Image & Form Side by Side */}
            <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden w-[700px]">
                
                {/* Left Side - Logo and Business Name */}
                <div className="w-1/2 flex flex-col items-center justify-center border-r-6 border-indigo-400 p-5 bg-white-100">
                    {/* Business Name */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">ITPARTNER</h1>
                    
                    {/* Logo */}
                    <img src="../public/logo.svg" alt="Company Logo" className="max-w-full h-auto mr-6" />
                </div>

                {/* Right Side - Form */}
                <div className="w-1/2 p-10">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Register Owner</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <input
                                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all p-2 w-full rounded-lg"
                                type="text"
                                placeholder="Enter your name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all p-2 w-full rounded-lg"
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Phone</label>
                            <input
                                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all p-2 w-full rounded-lg"
                                type="tel"
                                placeholder="Enter your phone number"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">GST Number</label>
                            <input
                                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all p-2 w-full rounded-lg"
                                type="text"
                                placeholder="Enter your GST Number"
                                required
                                value={gstNumber}
                                onChange={(e) => setGstNumber(e.target.value)}
                            />
                        </div>

                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg p-3 w-full rounded-lg transition-all shadow-md"
                            type="submit"
                        >
                            Submit
                        </button>
                    </form>

                    {success && <p className="text-green-600 text-center font-semibold mt-4">{success}</p>}
                </div>
            </div>
        </div>
    );
};

export default Sudmitownerdata;
