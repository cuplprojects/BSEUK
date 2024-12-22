import { Link, useLocation, useParams } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { useThemeStore } from '../store/themeStore';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import API from '../services/api';

const Breadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const theme = useThemeStore((state) => state.theme);
  const [candidateName, setCandidateName] = useState('');
  
  // Create a mapping for prettier path names and parent paths
  const pathConfig = {
    'dashboard': { display: 'Dashboard' },
    'settings': { display: 'Settings' },
    'profile': { display: 'Profile' },
    'marks-entry': { display: 'Marks Entry' },
    'change-password': { 
      display: 'Change Password',
      parent: 'settings'
    }
  };

  // Fetch candidate name when studentId is present
  useEffect(() => {
    const fetchCandidateName = async () => {
      if (params.studentId) {
        try {
          const response = await API.get(`/Candidates/${params.studentId}`);
          setCandidateName(response.data.candidateName);
        } catch (error) {
          console.error('Error fetching candidate:', error);
          setCandidateName('Unknown Candidate');
        }
      }
    };

    fetchCandidateName();
  }, [params.studentId]);

  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Build the breadcrumb path array including parent paths
  const buildBreadcrumbPath = (paths) => {
    const result = [];
    paths.forEach(path => {
      // Check if this is a studentId parameter
      if (path === params.studentId) {
        result.push({
          name: path,
          path: location.pathname,
          display: candidateName || 'Loading...'
        });
        return;
      }

      const config = pathConfig[path];
      if (config && config.parent && !paths.includes(config.parent)) {
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