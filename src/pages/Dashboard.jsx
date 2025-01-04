import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const theme = useThemeStore((state) => state.theme);
  
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border border-purple-500/20 hover:bg-purple-900/20'
    : 'bg-white border-blue-200 shadow-xl hover:shadow-2xl hover:bg-blue-50/50';

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

  const quickActions = [
    { 
      label: 'Add Candidate', 
      link: '/add-candidate',
      icon: '👤'
    },
    { 
      label: 'Import Candidates', 
      link: '/add-bulkcandidates',
      icon: '📥'
    },
    { 
      label: 'Create Session', 
      link: '/add-session',
      icon: '📅'
    },
    // { 
    //   label: 'View Reports', 
    //   link: '/report',
    //   icon: '📊'
    // },
    { 
      label: 'Certificate', 
      link: '/certificate-generation',
      icon: '📜'
    },
    { 
      label: 'Marks Entry', 
      link: '/marks-entry',
      icon: '✏️'
    },
    { 
      label: 'Add Groups', 
      link: '/add-groups',
      icon: '📚'
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className={`text-4xl font-bold mb-4 ${
          theme === 'dark'
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800'
        }`}>
          Welcome Back!
        </h1>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-purple-200' : 'text-blue-600'
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
                <span className={`text-lg font-medium text-center ${
                  theme === 'dark'
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
