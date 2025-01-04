import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useThemeStore } from "../../../../store/themeStore";
import API from "../../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUsers = () => {
  const theme = useThemeStore((state) => state.theme);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleID: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Theme classes
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-blue-200 shadow-xl border';

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&:not(:disabled)]:hover:bg-purple-900/30'
    : 'bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&:not(:disabled)]:hover:bg-blue-100';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  const labelClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await API.get("/Roles");
      setRoles(response.data);
    } catch (error) {
      toast.error("Failed to load roles");
    }
  };

  const validateForm = () => {
    // Username validation
    if (!formData.name.trim()) {
      toast.warning("Username is required");
      return false;
    }
    
    // Username must contain both letters and numbers
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/.test(formData.name)) {
      toast.warning("Username must contain both letters and numbers (no special characters or spaces)");
      return false;
    }

    // Minimum length check
    if (formData.name.length < 3) {
      toast.warning("Username must be at least 3 characters long");
      return false;
    }

    // Maximum length check
    if (formData.name.length > 20) {
      toast.warning("Username cannot exceed 20 characters");
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      toast.warning("Email is required");
      return false;
    }

    // Strict email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.warning("Please enter a valid email address");
      return false;
    }

    // Role validation
    if (!formData.roleID) {
      toast.warning("Please select a role");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await API.post("/Users", {
        userID: 0,
        name: formData.name,
        email: formData.email,
        roleID: parseInt(formData.roleID)
      });

      toast.success("User added successfully");
      setFormData({ name: '', email: '', roleID: '' });
    } catch (error) {
      toast.error("Failed to add user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Real-time username validation
    if (name === 'name') {
      // Only allow alphanumeric characters
      const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className={`block font-medium ${labelClass}`}>
              Username
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${inputClass}`}
              placeholder="Enter username (letters and numbers only)"
            />
            <p className={`text-xs ${theme === 'dark' ? 'text-purple-300' : 'text-blue-600'}`}>
              Username must contain both letters and numbers, no special characters allowed
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className={`block font-medium ${labelClass}`}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${inputClass}`}
              placeholder="Enter email"
            />
          </div>

          {/* Role Dropdown */}
          <div className="space-y-2">
            <label htmlFor="roleID" className={`block font-medium ${labelClass}`}>
              Role
            </label>
            <select
              id="roleID"
              name="roleID"
              value={formData.roleID}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${inputClass} ${
                theme === 'dark' 
                  ? '[&>option]:bg-gray-800 [&>option]:text-purple-100' 
                  : '[&>option]:bg-white [&>option]:text-blue-600'
              }`}
              style={{
                colorScheme: theme === 'dark' ? 'dark' : 'light'
              }}
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.roleID} value={role.roleID}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg transition-colors ${buttonClass} disabled:opacity-50 flex items-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding User...
              </>
            ) : (
              'Add User'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddUsers;
