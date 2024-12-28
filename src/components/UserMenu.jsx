import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useUserStore } from '../store/useUsertoken';
import sampleUser from './../assets/sample-user/sampleUser.jpg';

const UserMenu = ({ userDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const { user, logout } = useUserStore();
  

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: <FiUser className="w-4 h-4" />,
      label: 'Profile',
      path: '/profile'
    },
    {
      icon: <FiLogOut className="w-4 h-4" />,
      label: 'Logout',
      onClick: handleLogout
    },
  ];
  if (!userDetails) {
    return (
      <div className="relative">
        <motion.button
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark'
            ? 'bg-gradient-to-r from-purple-900/50 to-purple-600/50 text-purple-300'
            : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600'
            }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-semibold ${
          theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-600'
        }`}>
          ?
        </div>
          <span className="hidden sm:block">Loading...</span>
        </motion.button>
      </div>
    );
  }


  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark'
          ? 'bg-gradient-to-r from-purple-900/50 to-purple-600/50 text-purple-300'
          : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600'
          }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-semibold ${
          theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-600'
        }`}>
          {userDetails?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <span className="hidden sm:block">{userDetails?.name || 'Loading...'}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg border backdrop-blur-xl ${theme === 'dark'
                ? 'bg-black border-purple-500/20 text-purple-300'
                : 'bg-white border-blue-200 text-blue-700'
                }`}
              style={{ zIndex: 500 }}
            >
              {menuItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`flex items-center gap-3 px-4 py-2 transition-colors duration-200 ${theme === 'dark'
                      ? 'hover:bg-purple-900/50'
                      : 'hover:bg-blue-50'
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2 transition-colors duration-200 ${theme === 'dark'
                      ? 'hover:bg-purple-900/50'
                      : 'hover:bg-blue-50'
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;