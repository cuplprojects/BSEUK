import { useState } from 'react';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const theme = useThemeStore((state) => state.theme);
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-slate-200 shadow-lg';

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-800' : 'text-blue-700'}`}>
        Welcome Back !
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
        <div className={`border rounded-lg p-6 ${cardClass}`}>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : 'text-blue-700'} mb-4`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {['Add Candidate', 'Import Candidates', 'Create Session', 'View Reports', 'Certificate','Marks Entry'].map((action) => (
              <Link
                key={action}
                to={{
                  'Add Candidate': '/add-candidate',
                  'Import Candidates':'/add-bulkcandidates',
                  'Create Session': '/dashboard/create-session',
                  'View Reports': '/report',
                  'Certificate': '/certificate-generation',
                  'Marks Entry':'/marks-entry',
                }[action]}
                className={`p-4 rounded-lg transition-colors duration-200 ${theme === 'dark'
                    ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                  }`}
              >
                {action}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
