import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useThemeStore } from "../../../store/themeStore";
import AddUsers from './Tabs/AddUsers';
import AllUsers from './Tabs/AllUsers';
import UserAccess from './Tabs/UserAccess';
import { FiUsers, FiUserPlus } from "react-icons/fi";
import { GoPasskeyFill } from "react-icons/go";
import { useNavigate, useLocation } from 'react-router-dom';

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);

  // Set active tab based on current route
  useEffect(() => {
    // Default to add-users when landing on /users
    if (location.pathname === '/users') {
      navigate('/users/add');
    }
  }, [location.pathname, navigate]);

  // Determine active tab from current route
  const activeTab = location.pathname === '/users/all'
    ? 'all'
    : location.pathname === '/users/access'
      ? 'access'
      : 'add';

  // Theme classes
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-blue-200 shadow-xl border';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';

  const activeTabClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';

  const inactiveTabClass = theme === 'dark'
    ? 'text-purple-400 hover:text-purple-200'
    : 'text-blue-400 hover:text-blue-600';

  const tabs = [
    {
      id: 'add',
      label: 'Add User',
      icon: <FiUserPlus className="w-5 h-5" />,
      path: '/users/add'
    },
    {
      id: 'all',
      label: 'All Users',
      icon: <FiUsers className="w-5 h-5" />,
      path: '/users/all'
    },
    {
      id: 'access',
      label: 'User Access',
      icon: <GoPasskeyFill className="w-5 h-5" />,
      path: '/users/access'
    }
  ];

  const handleTabChange = (tab) => {
    navigate(tab.path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      {/* Page Title */}
      <h1 className={`text-2xl font-bold mb-6 ${textClass}`}>
        User Management
      </h1>

      {/* Tab Container */}
      <div className={`rounded-lg overflow-hidden ${cardClass}`}>
        {/* Modern Tab Navigation */}
        <div className="relative flex border-b border-purple-500/20 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-4 relative flex items-center gap-2 font-medium transition-colors ${
                activeTab === tab.id ? activeTabClass : inactiveTabClass
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    theme === 'dark' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}
                  layoutId="activeTab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content with Animation */}
        <motion.div 
          className="p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          key={activeTab}
        >
          {location.pathname === '/users/all' 
            ? <AllUsers /> 
            : location.pathname === '/users/access'
              ? <UserAccess />
              : <AddUsers />
          }
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Users;