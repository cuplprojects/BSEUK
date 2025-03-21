import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFileImport, faCalendarAlt, faChartBar, faCertificate, faPencilAlt, faBook, faBuilding, faList } from '@fortawesome/free-solid-svg-icons';
import { PiCertificateFill } from "react-icons/pi";
import { IoShieldCheckmark } from "react-icons/io5";
import {FiEdit} from "react-icons/fi";
import { IoPersonAddSharp } from "react-icons/io5";
import isAdminAccess from './../services/isAdminAccess';
import { useUserStore } from './../store/useUsertoken';
const Dashboard = () => {
  const theme = useThemeStore((state) => state.theme);
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
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border border-purple-500/20 hover:bg-purple-900/20'
    : 'bg-white border-blue-200 shadow-xl hover:shadow-2xl hover:bg-blue-50/50';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';


  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        staggerChildren: 0.15,
        ease: "easeOut"
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
  };

// Common actions for all users
const commonActions = [
  {
    label: 'Certificate',
    link: '/certificate-generation',
    icon: <PiCertificateFill className={textClass} />
  },
  {
    label: 'Marks Entry',
    link: '/marks-entry',
    icon: <FontAwesomeIcon icon={faPencilAlt} className={textClass} />
  }
];

// Admin only actions
const adminActions = [
  {
    label: 'Users',
    link: '/users/add',
    icon: <FontAwesomeIcon icon={faUser} className={textClass} />
  },
  // {
  //   label: 'Roles',
  //   link: '/add-roles',
  //   icon: <IoShieldCheckmark className={textClass} />
  // },
  {
    label: 'Add Candidates',
    link: '/add-candidate',
    icon: <IoPersonAddSharp className={textClass} />
  },
  {
    label: 'Import Candidates',
    link: '/add-bulkcandidates',
    icon: <FontAwesomeIcon icon={faFileImport} className={textClass} />
  },
  {
    label: 'Edit Candidates',
    link: '/edit-candidate',
    icon: <FiEdit className={textClass} />
  },
  {
    label: 'Create Session',
    link: '/add-session',
    icon: <FontAwesomeIcon icon={faCalendarAlt} className={textClass} />
  },
  {
    label: 'Add Groups',
    link: '/add-groups',
    icon: <FontAwesomeIcon icon={faBook} className={textClass} />
  },
  {
    label: 'Add Institution',
    link: '/add-institution',
    icon: <FontAwesomeIcon icon={faBuilding} className={textClass} />
  },
  {
    label: 'Add Category',
    link: '/add-category',
    icon: <FontAwesomeIcon icon={faList} className={textClass} />
  }
];

// Combine actions based on admin status
const quickActions = [...commonActions, ...(isAdmin ? adminActions : [])];

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark'
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800'
          }`}>
          Welcome Back!
        </h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-purple-200' : 'text-blue-600'
          }`}>
          Select an action to get started
        </p>
      </motion.div>

      {/* Quick Actions - Updated to use flexbox */}
      <motion.div
        className="flex flex-wrap justify-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {quickActions.map((action) => (
          <motion.div
            key={action.label}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
          >
            <Link to={action.link}>
              <div className={`p-6 rounded-xl ${cardClass} transition-all duration-300
                flex flex-col items-center justify-center gap-4 min-h-[160px]`}
              >
                <span className="text-4xl" role="img" aria-label={action.label}>
                  {action.icon}
                </span>
                <span className={`text-lg font-medium text-center ${theme === 'dark'
                    ? 'text-purple-200'
                    : 'text-blue-700'
                  }`}>
                  {action.label}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
