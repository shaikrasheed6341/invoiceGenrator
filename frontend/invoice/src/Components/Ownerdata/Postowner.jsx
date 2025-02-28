import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubmitOwnerData = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [compneyname, setCompneyname] = useState("");
    const [address, setAddress] = useState("");
    const [gstNumber, setGstNumber] = useState("");

    const updatePage = (event) => {
        event.preventDefault();
        navigate('/bankdetails');
    };

    const nextPage = (event) => {
        event.preventDefault();
        navigate('/postcustmer');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = { name, email, phone, gstNumber, compneyname, address };

        try {
            const result = await axios.post('http://localhost:5000/owners/insertownerdata', formData);
            toast.success(result.data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
            console.log(result);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Submission failed. Please try again.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#091235] to-[#003B73]">
            <div className="flex bg-white rounded-xl shadow-lg overflow-hidden w-[1000px]">
                <div className="w-1/2 flex flex-col items-center justify-center border-r-8 border-[#003B73] p-5">
                    <h1 className="text-5xl font-bold text-[#003B73] mb-10">ITPARTNER</h1>
                    <img src="/logo.svg" alt="Company Logo" className="max-w-full h-auto mb-16" />
                </div>
                <div className="w-1/2 p-12">
                    <h2 className="text-4xl font-bold text-[#003B73] text-center mb-6">Register Owner</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className=" flex-col ">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Name</label></div>
                            <div>
                                <input className="input-field border-2 p-2 w-full rounded-md bg-gray-50 " type="text" placeholder="Enter your name" required value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <div><label className="text-sm font-medium text-gray-700">Email</label></div>
                            <div><input className="input-field input-field border-2 p-2 w-full rounded-md bg-gray-50" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div> </div>
                        <div>
                            <div><label className="text-sm font-medium text-gray-700">Phone</label></div>
                            <div><input className="input-field input-field border-2 p-2 w-full rounded-md bg-gray-50" type="tel" placeholder="Enter your phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>                         </div>
                        <div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Company Name</label>
                            </div>                            <div><input className="input-field input-field border-2  bg-gray-50 p-2 w-full rounded-md" type="text" placeholder="Enter your company name" required value={compneyname} onChange={(e) => setCompneyname(e.target.value)} />
                            </div> </div>
                        <div>
                            <div><label className="text-sm font-medium text-gray-700">GST Number</label></div>
                            <div><input className="input-field input-field border-2 p-2 w-full bg-gray-50 rounded-md" type="text" placeholder="Enter your GST Number" required value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} /></div>
                        </div>
                        <div>
                            <div><label className="text-sm font-medium text-gray-700">Address</label>
                            </div>                             <div><input className="input-field bg-gray-50 input-field border-2 p-2 w-full rounded-md" type="text" placeholder="Enter your address" required value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div> </div>
                        <ToastContainer />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg p-3 w-full rounded-lg transition-all mt-6 shadow-md" type="submit">Submit</button>
                        <div className="flex justify-between mt-4">
                            <button className="p-3 bg-[#1abb2d] text-white shadow-md font-bold w-40" onClick={updatePage}>Bank Deteails</button>
                            <button className="p-3 bg-black text-white shadow-md font-bold w-40" onClick={nextPage}>Next</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitOwnerData;
