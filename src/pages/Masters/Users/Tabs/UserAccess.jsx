import React from 'react';
import { motion } from "framer-motion";
import { useThemeStore } from "../../../../store/themeStore";

const UserAccess = () => {
  const theme = useThemeStore((state) => state.theme);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Content will be added here */}
      <div className={`${textClass}`}>
        User Access Management
      </div>
    </motion.div>
  );
};

export default UserAccess;