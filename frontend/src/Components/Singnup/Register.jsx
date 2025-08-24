import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords don't match", {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("❌ Password must be at least 6 characters long", {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    // Check password complexity requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("❌ Password must contain at least one uppercase letter, one lowercase letter, and one number", {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BACKENDURL}/register/signup`, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200) {
        toast.success("🎉 Successfully Registered! Please login.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-slate-950">
      <div className="relative z-10 flex justify-center items-center min-h-screen p-5">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl border border-violet-200/50 text-gray-800 rounded-3xl p-10 max-w-md w-full"
        >
          <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
            Create Account 🚀
          </h2>
          <p className="text-center text-slate-900 mb-6">
            Join ITPARTNER today!
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First name"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last name"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 placeholder-slate-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white py-3 rounded-lg text-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-slate-900 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-slate-600 hover:text-slate-800 font-semibold underline"
            >
              Login here
            </button>
          </p>
        </motion.div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
