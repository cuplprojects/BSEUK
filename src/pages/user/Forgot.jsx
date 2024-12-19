import React, { useState } from "react";
import { FiMail, FiCheckCircle, FiLock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-30 animate-pulse"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-purple-500/20"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 text-center">
            Forgot Password
          </h2>

          {!otpSent ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full bg-purple-900/20 border ${emailExists ? 'border-green-500' : 'border-purple-500/50'} rounded-lg py-3 px-10 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
                    placeholder="Enter your email"
                    aria-label="Email"
                  />
                  {emailExists && (
                    <FiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSendOtp}
                disabled={!emailExists || loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg py-3 px-6 font-semibold transform transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-purple-900/20 border border-purple-500/50 rounded-lg py-3 px-10 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter OTP"
                    aria-label="OTP"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-purple-900/20 border border-purple-500/50 rounded-lg py-3 px-10 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="New Password"
                    aria-label="New Password"
                  />
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-purple-900/20 border border-purple-500/50 rounded-lg py-3 px-10 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Confirm New Password"
                    aria-label="Confirm New Password"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg py-3 px-6 font-semibold transform transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Reset Password
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Forgot;
