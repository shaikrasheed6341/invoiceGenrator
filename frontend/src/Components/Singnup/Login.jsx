import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import Landingpage from "../Landingpage/Landingpage";
import { useAuth } from "../../context/AuthContext";
import { useAuthActions } from "../../hooks/useAuthActions";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const { handleLogin } = useAuthActions();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await handleLogin(email, password);
      
      if (result.success) {
        if (result.hasOwner) {
          // User has complete business profile - redirect to dashboard
          navigate("/dashboard");
        } else {
          // User logged in but needs to complete business profile - redirect to setup
          navigate("/submitownerdata");
        }
      }
      // Error handling is done in the useAuthActions hook
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="relative  w-full bg-slate-950">
      
      
      <div className="relative z-10 flex justify-center items-center min-h-screen p-5">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl border border-violet-200/50 text-gray-800 rounded-3xl p-10 max-w-md w-full"
        >
          <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
            Welcome Back 👋
          </h2>
          <p className="text-center text-slate-900 mb-6">
            Sign in to continue your journey 🚀
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-slate-900">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-800 py-3 rounded-lg text-lg font-semibold transition-all shadow-lg flex items-center justify-center space-x-2 hover:bg-gray-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </motion.button>

            <p className="text-center text-slate-900 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-slate-600 hover:text-slate-800 font-semibold underline"
            >
              Create account
            </button>
          </p>
          
          <p className="text-center text-slate-900 mt-4 text-sm">
            Welcome to ITPARTNER - Your Invoice Management Solution
          </p>
        </motion.div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
