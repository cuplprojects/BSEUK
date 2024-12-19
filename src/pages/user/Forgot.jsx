import React, { useState } from "react";
import { FiMail, FiCheckCircle, FiLock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Simulate checking if email exists in the database
    if (e.target.value.includes("@")) {
      // Replace this with actual API call to check email existence
      setEmailExists(true); // Simulate email exists
    } else {
      setEmailExists(false);
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOtpSent(true);
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      // Simulate password reset
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Password reset successfully!");
    } else {
      setErrors({ confirmPassword: "Passwords do not match" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-blue-500/50 blur-lg opacity-30 animate-pulse"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white rounded-2xl shadow-2xl flex h-[600px]"
        >
          {/* Left side with image and gradient overlay */}
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <div className="relative p-12 text-white z-10 flex flex-col justify-center h-full">
              <h1 className="text-4xl font-bold mb-6">Reset Password</h1>
              <p className="text-lg opacity-90">Enter your email address and we'll send you instructions to reset your password.</p>
            </div>
          </div>

          {/* Right side with form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white flex items-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                {otpSent ? 'VERIFY OTP' : 'FORGOT PASSWORD'}
              </h2>

              {!otpSent ? (
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div className="space-y-2">
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`w-full bg-gray-50 border ${
                          emailExists ? 'border-blue-500' : 'border-gray-200'
                        } rounded-lg py-3 px-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                        placeholder="Enter your email"
                      />
                      {emailExists && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"
                        >
                          <FiCheckCircle className="w-5 h-5" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end text-sm">
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                      Back to Login
                    </Link>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!emailExists || loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-3 px-6 font-semibold transform transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2">Sending OTP...</span>
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Enter OTP"
                      />
                    </div>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        placeholder="New Password"
                      />
                    </div>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-gray-50 border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                        } rounded-lg py-3 px-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                        placeholder="Confirm Password"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-3 px-6 font-semibold transform transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Reset Password
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Forgot;
