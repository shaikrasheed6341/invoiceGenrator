import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify"
// Ensure correct path to your logo
//import logo from "../public/logo.svg";

const Sudmitownerdata = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [success, setSuccess] = useState("");
    
     const updatepage = ()=>{
        navigate('/updateowner')
     }
     const  next = ()=>{
        navigate('/postcustmer')
     }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = { name, email, phone, gstNumber };
        try {
            const res = await axios.post("http://localhost:5000/owners/insertownerdata", formData);
            setSuccess(res.data.message);
            toast.success(res.data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            })
        } catch (err) {
            console.error(err);
            setSuccess("Submission failed. Please try again.");
            toast.error(err.response.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            })
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#091235] to-[#003B73]">

            {/* Container with Image & Form Side by Side */}
            <div className="flex bg-white rounded-xl shadow-lg overflow-hidden w-[1000px]">

                {/* Left Side - Logo and Business Name */}
                <div className="w-1/2 flex flex-col items-center justify-center border-r-8 border-[#003B73] p-5 bg-white-100">
                    {/* Business Name */}
                    <h1 className="text-5xl font-bold text-[#003B73] mb-15">ITPARTNER</h1>

                    {/* Logo */}
                    <img src="./logo.svg" alt="Company Logo" className="max-w-full h-auto mr-12 mb-16" />
                </div>

                {/* Right Side - Form */}
                <div className="w-1/2 p-12">
                    <h2 className=" text-[#003B73] text-center "><h3 className="text-4xl font-bold">Register Owner</h3></h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mt-6">
                            <label className="text-sm font-medium text-gray-700 ">Name</label>
                            <input
                                className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all p-2 w-full rounded-lg"
                                type="text"
                                placeholder="Enter your name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mt-5">
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

                        <div className="mt-5">
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

                        <div className="mt-5">
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
                        <ToastContainer />

                        <button
                            className="bg-blue-600 hover:bg-blue-700  text-white font-semibold text-lg p-3 w-full rounded-lg transition-all mt-6 shadow-md"
                            type="submit"
                        >
                            Submit
                        </button>
                        <div>
                            <button className="p-3 bg-[#1abb2d] text-white shadow-md  font-bold w-40 mr-20" onClick={updatepage}>
                                Update
                            </button>
                            <button className="p-3 bg-black text-white shadow-md  font-bold w-40"  onClick={next}>
                                Next
                            </button>
                        </div>


                    </form>

                </div>
            </div>
        </div>
    );
};

export default Sudmitownerdata;
