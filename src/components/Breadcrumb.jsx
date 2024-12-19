import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { useThemeStore } from '../store/themeStore';
import { motion } from 'framer-motion';

const Breadcrumb = () => {
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);
  
  // Create a mapping for prettier path names and parent paths
  const pathConfig = {
    'dashboard': { display: 'Dashboard' },
    'settings': { display: 'Settings' },
    'profile': { display: 'Profile' },
    'change-password': { 
      display: 'Change Password',
      parent: 'settings' // Define the parent path
    }
  };

  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Build the breadcrumb path array including parent paths
  const buildBreadcrumbPath = (paths) => {
    const result = [];
    paths.forEach(path => {
      const config = pathConfig[path];
      if (config && config.parent && !paths.includes(config.parent)) {
        // Add parent path if it exists and isn't already in the path
        result.push({
          name: config.parent,
          path: `/${config.parent}`,
          display: pathConfig[config.parent].display
        });
      }
      result.push({
        name: path,
        path: `/${result.map(r => r.name).concat(path).join('/')}`,
        display: config?.display || path.charAt(0).toUpperCase() + path.slice(1)
      });
    });
    return result;
  };

  const breadcrumbPaths = buildBreadcrumbPath(pathnames);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 flex items-center space-x-2 ${theme === 'dark' ? 'text-purple-300' : 'text-blue-600'}`}
    >
      <Link 
        to="/"
        className={`hover:${theme === 'dark' ? 'text-purple-100' : 'text-blue-900'} transition-colors duration-200`}
      >
        Home
      </Link>

      {breadcrumbPaths.map((item, index) => {
        const isLast = index === breadcrumbPaths.length - 1;
        
        return (
          <div key={item.path} className="flex items-center space-x-2">
            <FiChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className={`font-medium ${theme === 'dark' ? 'text-purple-100' : 'text-blue-900'}`}>
                {item.display}
              </span>
            ) : (
              <Link
                to={item.path}
                className={`hover:${theme === 'dark' ? 'text-purple-100' : 'text-blue-900'} transition-colors duration-200`}
              >
                {item.display}
              </Link>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

export default Breadcrumb;