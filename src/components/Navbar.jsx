import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import UserMenu from './UserMenu';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className={`bg-black/40 border-b border-purple-500/20 p-4 ${theme === 'dark' ? 'bg-black/40 backdrop-blur-xl border-r border-purple-500/20' : 'bg-black/40 backdrop-blur-xl border-r border-slate-200'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            className="md:hidden text-purple-300 hover:text-purple-100 transition-colors"
          >
            <FiMenu className="w-6 h-6" />
          </motion.button>
          <Link to="/dashboard" className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-pink-400' : 'text-white'}`}>
            CUPL | EMS
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <AnimatePresence mode="wait">
            <motion.button
              key={theme}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`relative p-3 rounded-xl ${theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-900/50 to-purple-600/50 text-yellow-300'
                  : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600'
                }`}
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </motion.button>
          </AnimatePresence>

          <UserMenu onLogout={handleLogout} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
