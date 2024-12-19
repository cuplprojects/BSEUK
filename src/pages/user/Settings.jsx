import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiGlobe, FiLock, FiMoon, FiShield, FiAlertCircle, FiKey } from "react-icons/fi";
import { useThemeStore } from '../../store/themeStore';
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const [showValidation, setShowValidation] = useState(false);
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        notifications: true,
        language: "English",
        twoFactorAuth: false
    });

    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
        : 'bg-white border-slate-200 shadow-lg';

    const textClass = theme === 'dark'
        ? 'text-purple-100'
        : 'text-slate-900';

    const subTextClass = theme === 'dark'
        ? 'text-purple-300'
        : 'text-slate-600';

    const handleToggle = (setting) => {
        if (setting === 'darkMode') {
            toggleTheme();
        } else {
            setSettings(prev => ({
                ...prev,
                [setting]: !prev[setting]
            }));
        }
    };

    const handleSetup = () => {
        if (import.meta.env.VITE_SKIP_VALIDATION !== 'true') {
            setShowValidation(true);
            setTimeout(() => setShowValidation(false), 3000); // Hide after 3 seconds
        }
    };

    const renderControl = (item) => {
        if (item.setting === 'changePassword') {
            return (
                <button
                    onClick={() => navigate('/change-password')}
                    className={`px-4 py-2 rounded-lg ${theme === 'dark'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        } transition-colors`}
                >
                    Change
                </button>
            );
        }

        if (item.setting === 'twoFactorAuth') {
            if (import.meta.env.VITE_SKIP_VALIDATION === 'true') {
                return (
                    <div className={`px-4 py-2 rounded-lg ${theme === 'dark'
                            ? 'bg-purple-600/20 text-purple-300'
                            : 'bg-blue-100 text-blue-700'
                        } flex items-center gap-2`}>
                        <FiShield className="w-4 h-4" />
                        <span className="text-sm">Secured</span>
                    </div>
                );
            }
            return (
                <div className="relative">
                    <button
                        onClick={handleSetup}
                        className={`px-4 py-2 rounded-lg ${theme === 'dark'
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                            } transition-colors`}
                    >
                        Setup
                    </button>
                    <AnimatePresence>
                        {showValidation && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`absolute right-0 mt-2 p-2 rounded-lg text-sm whitespace-nowrap ${theme === 'dark'
                                        ? 'bg-red-900/80 text-red-200'
                                        : 'bg-red-100 text-red-600'
                                    } flex items-center gap-2`}
                            >
                                <FiAlertCircle className="w-4 h-4" />
                                This feature is not available at the moment .
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        }

        return (
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={item.setting === 'darkMode' ? theme === 'dark' : settings[item.setting]}
                    onChange={() => handleToggle(item.setting)}
                    className="sr-only peer"
                />
                <div className={`w-11 h-6 ${theme === 'dark'
                        ? 'bg-purple-900/20'
                        : 'bg-blue-200'
                    } peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:${theme === 'dark'
                        ? 'bg-purple-400 after:border-purple-400'
                        : 'bg-blue-300 after:border-blue-300'
                    } after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${theme === 'dark'
                        ? 'bg-purple-600'
                        : 'bg-blue-600'
                    }`}></div>
            </label>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-100' : 'text-blue-700'} mb-8`}>
                    Settings
                </h1>

                <div className="space-y-6">
                    {[
                        {
                            icon: <FiBell className={`text-2xl ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`} />,
                            title: "Notifications",
                            description: "Manage your notification preferences",
                            setting: 'notifications'
                        },
                        {
                            icon: <FiMoon className={`text-2xl ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`} />,
                            title: "Dark Mode",
                            description: "Toggle dark mode appearance",
                            setting: 'darkMode',
                            value: theme === 'dark'
                        },
                        {
                            icon: <FiLock className={`text-2xl ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`} />,
                            title: "Two-Factor Authentication",
                            description: "Enable additional security",
                            setting: 'twoFactorAuth'
                        },
                        {
                            icon: <FiKey className={`text-2xl ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`} />,
                            title: "Change Password",
                            description: "Update your account password",
                            setting: 'changePassword'
                        }
                    ].map((item) => (
                        <motion.div
                            key={item.setting}
                            className={`border rounded-lg p-6 ${cardClass}`}
                            whileHover={{
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <motion.div
                                    className="flex items-center space-x-4"
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.icon}
                                    <div>
                                        <h2 className={`text-xl ${textClass}`}>{item.title}</h2>
                                        <p className={`text-sm ${subTextClass}`}>{item.description}</p>
                                    </div>
                                </motion.div>
                                {renderControl(item)}
                            </div>
                        </motion.div>
                    ))}

                    <div className={`border rounded-lg p-6 ${cardClass}`}>
                        <div className="flex items-center space-x-4 mb-6">
                            <FiGlobe className={`text-2xl ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`} />
                            <div>
                                <h2 className={`text-xl ${textClass}`}>Language</h2>
                                <p className={`text-sm ${subTextClass}`}>Choose your preferred language</p>
                            </div>
                        </div>
                        <select
                            value={settings.language}
                            onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                            className={`${theme === 'dark' ? 'bg-purple-900/20 border-purple-500/20 text-purple-100' : 'bg-gray-50 border-gray-200'} border rounded px-3 py-2 w-full`}
                        >
                            <option value="English" className={theme === 'dark' ? 'bg-purple-900 text-purple-100' : ''}>English</option>
                            <option value="Hindi" className={theme === 'dark' ? 'bg-purple-900 text-purple-100' : ''}>Hindi</option>
                        </select>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
