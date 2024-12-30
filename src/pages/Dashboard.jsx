import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const theme = useThemeStore((state) => state.theme);
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-slate-200 shadow-lg';

  // Variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <motion.h1
        className={`text-3xl font-bold ${
          theme === 'dark'
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-800'
            : 'text-blue-700'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome Back!
      </motion.h1>

      {/* Quick Actions Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'Add Candidate', link: '/add-candidate' },
          { label: 'Import Candidates', link: '/add-bulkcandidates' },
          { label: 'Create Session', link: '/dashboard/create-session' },
          { label: 'View Reports', link: '/report' },
          { label: 'Certificate', link: '/certificate-generation' },
          { label: 'Marks Entry', link: '/marks-entry' },
          { label: 'Add Groups', link: '/add-groups' },
        ].map((action) => (
          <motion.div
            key={action.label}
            className={`p-6 border rounded-lg ${cardClass} flex items-center justify-center transition-all duration-200`}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={action.link}
              className={`text-lg font-medium ${
                theme === 'dark'
                  ? 'text-purple-300'
                  : 'text-blue-700'
              } hover:underline`}
            >
              {action.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
