import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('https://invoice-genrator-backend-five.vercel.app/register/signup', formData);
            toast.success("Registration Successful!");
            console.log(result.data);

            // Wait for 1 second before redirecting to login
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            toast.error("Something went wrong with registration.");
            console.error(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-[#020024] via-[#090979] to-[#00d4ff] p-6">
            <div className="bg-white/10 backdrop-blur-xl p-10 w-full max-w-lg rounded-3xl shadow-2xl border border-white/20">
                <h1 className="font-extrabold text-4xl text-center text-white mb-6 tracking-wide">
                    Create an Account
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="p-4 bg-white/20 border border-white/30 rounded-xl w-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                    />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="p-4 bg-white/20 border border-white/30 rounded-xl w-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-4 bg-white/20 border border-white/30 rounded-xl w-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="p-4 bg-white/20 border border-white/30 rounded-xl w-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                    />
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold p-4 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-gray-200 text-sm mt-4">
                    Already have an account? <a href="/login" className="text-blue-300 hover:underline">Login</a>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup