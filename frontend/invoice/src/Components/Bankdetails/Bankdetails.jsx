import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Bankdetails = () => {
    const [name, setName] = useState("");
    const [ifsccode, setIfsccode] = useState("");
    const [accountno, setAccountno] = useState("");
    const [bank, setBank] = useState("");
    const [upid, setUpid] = useState("");
    const [upidname, setUpidname] = useState("");
    const navigate = useNavigate();

    const custmerpage = () => {
        navigate('/postcustmer');
    };

    const handleform = async (e) => {
        e.preventDefault();
        const formData = { name, ifsccode, accountno, bank, upid, upidname };

        try {
            const result = await axios.post("http://localhost:5000/bank/bankdetails", formData);
            toast.success(result.data.message || "Success!", { transition: Bounce });
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!", { transition: Bounce });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#091235] to-[#003B73] p-10">
            <div className="flex bg-white rounded-lg shadow-lg w-[1000px] h-[700px] overflow-hidden">
                {/* Left Side */}
                <div className="w-2/3 flex flex-col justify-center items-center bg-white border-r-8 border-[#091235] p-6">
                    <h1 className="text-5xl font-bold text-[#003B73] mb-10">IT PARTNER</h1>
                    <img src="./logo.svg" alt="Bank Logo" className="h-auto w-80 mb-10" />
                </div>

                {/* Right Side - Form */}
                <div className="w-2/3 p-10">
                    <h2 className="text-4xl font-bold text-[#003B73] text-center mb-6">Enter Your Details</h2>
                    <form onSubmit={handleform} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Name</label>
                            <input type="text" className="border p-2 rounded-lg w-full shadow-sm" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">IFSC Code</label>
                            <input type="text" className="border p-2 rounded-lg w-full shadow-sm" placeholder="Enter IFSC Code" value={ifsccode} onChange={(e) => setIfsccode(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Account Number</label>
                            <input type="text" className="border p-2 rounded-lg w-full shadow-sm" placeholder="Enter Account Number" value={accountno} onChange={(e) => setAccountno(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Bank Name</label>
                            <input type="text" className="border p-2 rounded-lg w-full shadow-sm" placeholder="Enter Bank Name" value={bank} onChange={(e) => setBank(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">UPI ID</label>
                            <input type="text" className="border p-2 rounded-lg w-full shadow-sm" placeholder="Enter UPI ID" value={upid} onChange={(e) => setUpid(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">UPI Name</label>
                            <input type="text" className="border p-2 rounded-lg w-full shadow-sm" placeholder="Enter UPI Name" value={upidname} onChange={(e) => setUpidname(e.target.value)} required />
                        </div>
                        <ToastContainer />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg p-3 w-full rounded-lg transition-all shadow-md">Submit</button>
                    </form>
                    <button className="p-3 border-2 rounded-xl bg-black text-white w-100 mt-3 ml-2" onClick={custmerpage}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Bankdetails;
