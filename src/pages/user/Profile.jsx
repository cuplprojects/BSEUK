import { useState, useEffect } from 'react';
import { FiMail } from 'react-icons/fi';
import { useThemeStore } from '../../store/themeStore';
import API from './../../services/api';
import { useUserStore } from '../../store/useUsertoken';

const SimpleProfile = () => {
  const theme = useThemeStore((state) => state.theme);
  const { userId, userDetails, setUserDetails } = useUserStore();
  const [userName, setUserName] = useState('Not Set');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId && !userDetails) {
        try {
          const response = await API.get(`/Users/${userId}`);
          setUserDetails(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [userId, userDetails, setUserDetails]);

  // New effect to fetch UserAuth details
  useEffect(() => {
    const fetchUserAuth = async () => {
      if (userId) {
        try {
          const response = await API.get(`/UserAuths/${userId}`);
          setUserName(response.data.userName);
        } catch (error) {
          console.error('Error fetching user auth:', error);
          setUserName('Not Set');
        }
      }
    };

    fetchUserAuth();
  }, [userId]);

  const [profile] = useState({
    name: userDetails?.name,
    email: userDetails?.email,
  });

  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20 text-purple-100'
    : 'bg-white border-gray-200 shadow-lg text-gray-900';

  const subTextClass = theme === 'dark'
    ? 'text-purple-300'
    : 'text-gray-600';

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className={`border rounded-2xl p-6 ${cardClass}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-semibold ${theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-600'
                }`}
            >
              {userDetails?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
            <span>{profile.name}</span>
          </h1>
          <div className="text-lg mb-4">{userName}</div>
          <div className="flex items-center gap-3 justify-center">
            <FiMail className={`w-5 h-5 ${subTextClass}`} />
            <span className={subTextClass}>{profile.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfile;
