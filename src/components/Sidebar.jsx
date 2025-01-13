import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import {
  FiHome,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUsers,
  FiUserPlus,
  FiUpload,
  FiEdit
} from "react-icons/fi";
import { FaBuildingColumns } from "react-icons/fa6";
import { FaList } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from '../store/themeStore';
import { PiCertificateBold } from "react-icons/pi";
import { GiNotebook } from "react-icons/gi";
import { MdGroups } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import Logo from "./../assets/logo.png";
import { PiStudentBold } from "react-icons/pi";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import isAdminAccess from './../services/isAdminAccess';
import { useUserStore } from './../store/useUsertoken';
const Sidebar = ({ onClose, isMobile, isCollapsed, onCollapse }) => {

  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);
  const [expandedItems, setExpandedItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAuthenticated, isLoading } = useUserStore();

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isAdminAccess();
      setIsAdmin(adminStatus);
    };
    
    if (isAuthenticated) {
      checkAdmin();
    }
  }, [isAuthenticated]);

  const menuItems = [
    // Common routes for all authenticated users
    { path: "/dashboard", icon: <FiHome className="w-6 h-6" />, label: "Dashboard" },
    { path: "/marks-entry", icon: <GiNotebook className="w-6 h-6" />, label: "Marks Entry" },
    { path: "/certificate-generation", icon: <PiCertificateBold className="w-6 h-6" />, label: "Certificate" },
    
    // Admin only menu items
    ...(isAdmin ? [
      { path: "/users", icon: < FiUsers  className="w-6 h-6" />, label: "Users" ,
        subItems: [
          {
            path: "/users/add",
            icon: <FiUserPlus className="w-5 h-5" />,
            label: "Add Users"
          },
          {
            path: "/users/all",
            icon: <FaUsers  className="w-5 h-5" />,
            label: "All Users"
          },
        ]
      },
      {
        path: "candidates",
        icon: <PiStudentBold className="w-6 h-6" />,
        label: "Candidates",
        subItems: [
          {
            path: "/add-candidate",
            icon: <FiUserPlus className="w-5 h-5" />,
            label: "Add Candidate"
          },
          {
            path: "/add-bulkcandidates",
            icon: <FiUpload className="w-5 h-5" />,
            label: "Import Candidates"
          },
          {
            path: "/edit-candidate",
            icon: <FiEdit className="w-5 h-5" />,
            label: "Edit Candidate"
          }
        ]
      },
      { path: "/add-groups", icon: <MdGroups className="w-6 h-6" />, label: "Groups" },
      // { path: "/add-roles", icon: <IoShieldCheckmark className="w-6 h-6" />, label: "Roles" },
      { path: "/add-session", icon: <SlCalender className="w-6 h-6" />, label: "Sessions" },
      { path: "/add-institution", icon: <FaBuildingColumns className="w-6 h-6" />, label: "Institutions" },
      { path: "/add-category", icon: <FaList className="w-6 h-6" />, label: "Category" },
    ] : [])
];

  const toggleExpand = (path) => {
    setExpandedItems(prev =>
      prev.includes(path)
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const renderMenuItem = (item) => (
    <div key={item.path}>
      {item.subItems ? (
        <div className="space-y-1">
          <button
            onClick={() => toggleExpand(item.path)}
            className={`w-full flex items-center ${!isMobile && isCollapsed ? 'justify-center' : 'justify-between'} p-3 rounded-lg transition-colors duration-200 ${expandedItems.includes(item.path)
              ? theme === 'dark'
                ? 'bg-purple-900/50 text-purple-100'
                : 'bg-blue-600/10 text-white'
              : theme === 'dark'
                ? 'text-purple-300 hover:bg-purple-900/30'
                : 'text-white hover:bg-blue-500/30'
              }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <AnimatePresence mode="wait">
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {(!isCollapsed || isMobile) && (
              <FiChevronDown
                className={`w-4 h-4 transform transition-transform duration-200 ${expandedItems.includes(item.path) ? 'rotate-180' : ''
                  }`}
              />
            )}
          </button>
          <AnimatePresence>
            {expandedItems.includes(item.path) && (!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-6 space-y-1 overflow-hidden"
              >
                {item.subItems.map(subItem => (
                  <motion.div
                    key={subItem.path}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={subItem.path}
                      onClick={onClose}
                      className={`flex items-center space-x-2 py-2 px-3 rounded-lg transition-colors duration-200 ${location.pathname === subItem.path
                        ? theme === 'dark'
                          ? "bg-purple-600/50 text-white"
                          : "bg-blue-600 text-white"
                        : theme === 'dark'
                          ? "text-purple-300 hover:bg-purple-900/30"
                          : "text-white hover:bg-blue-500/30"
                        }`}
                    >
                      {subItem.icon}
                      <span className="text-sm">{subItem.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to={item.path}
            onClick={onClose}
            className={`flex items-center ${!isMobile && isCollapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg transition-colors duration-200 ${location.pathname === item.path
              ? theme === 'dark'
                ? "bg-purple-600 text-white"
                : "bg-blue-600 text-white"
              : theme === 'dark'
                ? "text-purple-300 hover:bg-purple-900/50"
                : "text-white hover:bg-blue-500"
              }`}
          >
            {item.icon}
            <AnimatePresence mode="wait">
              {(!isCollapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={false}
      animate={{ width: !isMobile && isCollapsed ? "4.5rem" : "16rem" }}
      transition={{ duration: 0.2 }}
      className={`h-screen ${theme === 'dark' ? 'bg-black/40 backdrop-blur-xl border-r border-purple-500/20' : 'bg-black/40 backdrop-blur-xl border-r border-slate-200'}`}
    >
      <div className="p-4">
        {/* Logo Container */}
        <motion.div
          initial={false}
          animate={{
            width: isCollapsed ? "3rem" : "8rem",
            height: isCollapsed ? "3rem" : "8rem"
          }}
          transition={{ duration: 0.2 }}
          className="hidden md:flex justify-center items-center rounded-full mx-auto mb-2"
          style={{
            backgroundImage: `url(${Logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: "white"
          }}
        />
        <div className="flex items-center justify-between mb-8">
          {isMobile && (
            <button
              onClick={onClose}
              className="text-purple-300 hover:text-purple-100 transition-colors absolute right-4 top-4"
            >
              <FiX className="w-6 h-6" />
            </button>
          )}
          <AnimatePresence mode="wait">
            {(!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
              >
                <Link to="/dashboard">
                  {/* <img src={theme === 'dark' ? logo : logoLight} alt="CUPL | EMS" className="h-24 w-auto" /> */}
                  {/* <img src={CUPL} alt="CUPL | EMS" className={`h-14 w-auto rounded-xl p-2 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-purple-900/50 to-purple-600/50' 
                      : 'bg-gradient-to-r from-blue-600/50 to-blue-400/50'
                  }`} /> */}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onCollapse(!isCollapsed)}
              className={`transition-all duration-200 ${isCollapsed
                ? `mx-auto w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-purple-600/20 hover:bg-purple-600/30' : 'bg-blue-500/20 hover:bg-blue-500/30'} flex items-center justify-center`
                : ''
                }`}
            >
              {isCollapsed ? (
                <FiChevronRight className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-300 hover:text-purple-100' : 'text-white hover:text-blue-700 hover:bg-white hover:rounded-full'}`} />
              ) : (
                <FiChevronLeft className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-300 hover:text-purple-100' : 'text-white hover:text-blue-700 hover:bg-white hover:rounded-full'}`} />
              )}
            </motion.button>
          )}
        </div>
        <nav className="space-y-2">
          {menuItems.map(renderMenuItem)}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
