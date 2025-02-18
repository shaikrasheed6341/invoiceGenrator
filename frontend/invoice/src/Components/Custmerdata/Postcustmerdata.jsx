import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Postcustmer = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const Custmerhandledata = async (e) => {
        e.preventDefault();
        const formData = { name, address, phone };

        try {
            const res = await axios.post("http://localhost:5000/custmor/custmor", formData);
            console.log(res)
            toast.success(res.data.message, {position:"top-center",
                autoClose:5000,
                pauseOnHover:true,
                theme:"light",
                transition:Bounce
             });
        } catch (err) {
            toast.error(err.response?.data?.message || "Submission failed", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#091235] to-[#003B73] p-10">
            <div className="flex bg-white rounded-lg shadow-lg w-[1000px] h-[600px] overflow-hidden">

                {/* Left Side - Logo Section */}
                <div className="w-2/3 flex flex-col justify-center items-center bg-white border-r-8 border-[#091235] p-6">
                    <h1 className="text-5xl font-bold text-[#003B73] mb-18  ">ITPARTNER</h1>
                    <img src="./logo.svg" alt="Company Logo" className="h-auto w-100 mr-14 mb-14" />

                </div>

                {/* Right Side - Form Section */}
                <div className="w-2/3 p-10">
                    <h2 className="text-4xl font-bold text-[#003B73] text-center mb-6 m-6">Customer Data</h2>

                    <form onSubmit={Custmerhandledata} className="space-y-4">
                        <div className="mb-10 ">
                            <label className="block text-sm font-medium text-gray-600">Name</label>
                            <input
                                type="text"
                                className="border p-2 rounded-lg w-full shadow-sm"
                                placeholder="Enter Customer Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-10" >
                            <label className="block text-sm font-medium text-gray-600">Address</label>
                            <input
                                type="text"
                                className="border p-2 rounded-lg w-full shadow-sm"
                                placeholder="Enter Customer Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-15">
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <input
                                type="tel"
                                className="border p-2 rounded-lg w-full shadow-sm"
                                placeholder="Enter Customer Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <ToastContainer />

                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg p-3 w-full rounded-lg transition-all  shadow-md">
                        
                            Sudmit
                        </button>
                        <div>
                            <button className="p-3 bg-[#1abb2d] text-white shadow-md  font-bold w-40 mr-20">
                                <a href="www.youtbe.com">Update</a>
                            </button>
                            <button className="p-3 bg-black text-white shadow-md  font-bold w-40">
                                <a href="www.youtbe.com">CustmerData</a>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Postcustmer;
