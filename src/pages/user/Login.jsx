import React, { useState, useEffect } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const DEV_MODE = import.meta.env.VITE_SKIP_VALIDATION === 'true';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [skipValidation] = useState(DEV_MODE);

  const domains = ["@gmail.com", "@outlook.com", "@yahoo.com", "@hotmail.com"];

  useEffect(() => {
    if (email && !email.includes("@")) {
      setSuggestions(domains.map((domain) => email + domain));
    } else {
      setSuggestions([]);
    }
  }, [email]);

  const validateForm = () => {
    if (skipValidation) return true;
    
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      navigate('/dashboard'); // Navigate to layout after successful login
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-30 animate-pulse"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-purple-500/20"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 text-center">
            EMS Login Interface
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-purple-900/20 border ${errors.email ? 'border-red-500 animate-shake' : 'border-purple-500/50'} rounded-lg py-3 px-10 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                  placeholder="User ID (Email)"
                  aria-label="Email"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-black/90 border border-purple-500/50 rounded-lg mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setEmail(suggestion)}
                      className="w-full text-left px-4 py-2 text-purple-300 hover:bg-purple-900/30 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-purple-900/20 border ${errors.password ? 'border-red-500 animate-shake' : 'border-purple-500/50'} rounded-lg py-3 px-10 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                  placeholder="Access Key (Password)"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg py-3 px-6 font-semibold transform transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Initialize Connection"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
              Reset Access Credentials?
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;