import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUsertoken";
import API from "../../services/api";
import Logo from "./../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, error, isLoading } = useUserStore();
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    
    const newErrors = {};
    
    if (!userName) {
      newErrors.userName = "Username is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await API.post('/Login', { userName, password });
        const data = response.data;
        if (response.status === 200) {
          await login(data.token, data.user);
          navigate('/dashboard');
        } else {
          setError({ message: data.message || 'Login failed' });
        }
      } catch (error) {
        setError({ message: error.response?.data?.message || 'An error occurred during login' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-100 to-blue-300 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-blue-500/50 blur-lg opacity-30 animate-pulse"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white rounded-2xl shadow-2xl flex h-[600px]"
        >
          {/* Left side with image and gradient overlay */}
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500">
              <div className="absolute inset-0 opacity-20">
                {/* Add your decorative elements here */}
                <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <div className="relative p-12 text-white z-10 flex flex-col justify-center h-full">
              <div className="">
                <img 
                src={Logo}
                alt="BSEUK Logo" 
                width="400"
                height="400"
                className=" mb-8 mx-auto bg-white rounded-lg"
              />
              </div>
            
              <h1 className="text-4xl font-bold mb-6">Welcome to UBSE Portal</h1>
              <p className="text-lg opacity-90">
                Log in to access your account and manage your Account, or sign up to create a new account.
              </p>
            </div>
          </div>

          {/* Right side with form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white flex items-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                LOGIN
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full bg-gray-50 border ${
                        validationErrors.userName ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg py-3 px-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                      placeholder="Username"
                    />
                  </div>
                  <AnimatePresence>
                    {validationErrors.userName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm"
                      >
                        {validationErrors.userName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-gray-50 border ${
                        validationErrors.password ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg py-3 px-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {validationErrors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm"
                      >
                        {validationErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Display API Error */}
                <AnimatePresence>
                  {error?.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 text-red-500 p-3 rounded-lg text-sm"
                    >
                      {error.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* <div className="flex justify-end text-sm">
                  <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    Forgot Password?
                  </Link>
                </div> */}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-3 px-6 font-semibold transform transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
