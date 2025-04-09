import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://invoice-genrator-backend-five.vercel.app/login/signin", {
        email,
        password,
      });

      toast.success("🎉 Successfully Logged In!", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });

      Cookies.set("token", res.data.token, { expires: 7, secure: true });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      toast.error("❌ Invalid Credentials", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-5">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/20 backdrop-blur-xl shadow-2xl border border-white/30 text-gray-800 dark:text-white rounded-3xl p-10 max-w-md w-full"
      >
        <h2 className="text-4xl font-extrabold text-center text-white mb-4">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-200 mb-6">
          Sign in to continue your journey 🚀
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg text-lg font-semibold transition-all shadow-lg"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center text-gray-200 mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-white font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default Login;
