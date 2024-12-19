import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const theme = useThemeStore((state) => state.theme);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
        : 'bg-white border-blue-200 shadow-lg';

    const textClass = theme === 'dark'
        ? 'text-purple-100'
        : 'text-blue-900';

    const inputClass = theme === 'dark'
        ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 focus:border-purple-400'
        : 'bg-blue-50 border-blue-200 text-blue-900 focus:border-blue-500';

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your password change logic here
        console.log('Password change submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                <button
                    onClick={() => navigate('/settings')}
                    className={`mb-6 ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'} hover:underline`}
                >
                    ← Back to Settings
                </button>

                <div className={`border rounded-lg p-8 ${cardClass}`}>
                    <div className="flex items-center space-x-4 mb-8">
                        <FiLock className={`text-2xl ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`} />
                        <h1 className={`text-2xl font-bold ${textClass}`}>Change Password</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {[
                            { name: 'currentPassword', label: 'Current Password' },
                            { name: 'newPassword', label: 'New Password' },
                            { name: 'confirmPassword', label: 'Confirm New Password' }
                        ].map((field) => (
                            <div key={field.name}>
                                <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                                    {field.label}
                                </label>
                                <input
                                    type="password"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${inputClass} transition-colors`}
                                    required
                                />
                            </div>
                        ))}

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/settings')}
                                className={`px-4 py-2 rounded-lg ${
                                    theme === 'dark'
                                        ? 'bg-purple-900/20 text-purple-300 hover:bg-purple-800/30'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                } transition-colors`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg ${
                                    theme === 'dark'
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                } transition-colors`}
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ChangePassword;
