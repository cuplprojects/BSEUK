import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import sampleUser from './../assets/sample-user/sampleUser.jpg';

const UserMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);

  const menuItems = [
    { icon: <FiUser className="w-4 h-4" />, label: 'Profile', path: '/profile' },
    { icon: <FiSettings className="w-4 h-4" />, label: 'Settings', path: '/settings' },
  ];

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
        <img
          src={sampleUser}
          alt="User"
          className={`w-8 h-8 rounded-full object-cover border-2 ${theme === 'dark' ? 'border-purple-500/20' : 'border-blue-500/20'}`}
        />
        <span className="hidden sm:block">Jayant Roy</span>
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
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 transition-colors duration-200 ${theme === 'dark'
                    ? 'hover:bg-purple-900/50'
                    : 'hover:bg-blue-50'
                  }`}
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;