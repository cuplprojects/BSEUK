import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useThemeStore } from "../../../../store/themeStore";
import { useLocation } from 'react-router-dom';
import API from "../../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const UserAccess = () => {
  const location = useLocation();
  const userData = location.state?.userData;
  const theme = useThemeStore((state) => state.theme);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAuth, setUserAuth] = useState({
    uaID: 0,
    userID: userData?.userID || 0,
    userName: userData?.name || '',
    password: ''
  });

  // Theme classes
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-blue-200 shadow-xl border';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&:not(:disabled)]:hover:bg-purple-900/30'
    : 'bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&:not(:disabled)]:hover:bg-blue-100';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  useEffect(() => {
    if (userData?.userID) {
      fetchUserAuth();
    }
  }, [userData]);

  const fetchUserAuth = async () => {
    try {
      const response = await API.get(`/UserAuths/${userData.userID}`);
      setUserAuth(response.data);
    } catch (error) {
      console.error("Error fetching user auth:", error);
      // If 404, it means no password set yet - that's okay
      if (error.response?.status !== 404) {
        toast.error("Failed to load user authentication details");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (userAuth.uaID) {
        // Update existing password
        await API.put(`/UserAuths/${userAuth.uaID}`, userAuth);
        toast.success("Password updated successfully");
      } else {
        // Create new password
        await API.post("/UserAuths", userAuth);
        toast.success("Password set successfully");
      }
    } catch (error) {
      console.error("Error setting password:", error);
      toast.error("Failed to set password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className={`p-6 rounded-lg ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 ${textClass}`}>
          Set Password for {userData?.name || 'User'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className={`block font-medium ${textClass}`}>
              Username
            </label>
            <input
              type="text"
              value={userAuth.userName}
              disabled
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${inputClass} disabled:opacity-50`}
            />
          </div>

          <div className="space-y-2">
            <label className={`block font-medium ${textClass}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={userAuth.password}
                onChange={(e) => setUserAuth({ ...userAuth, password: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${inputClass}`}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${textClass}`}
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg transition-colors ${buttonClass} disabled:opacity-50 flex items-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting Password...
                </>
              ) : (
                'Set Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UserAccess;