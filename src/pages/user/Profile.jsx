import { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { useThemeStore } from '../../store/themeStore';

const SimpleProfile = () => {
  const theme = useThemeStore((state) => state.theme);
  const [profile] = useState({
    name: 'Jayant Roy',
    email: 'jayanta@chandrakala.co.in',
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
        <h1 className="text-2xl font-bold mb-4 text-center">
          {profile.name}
        </h1>
        <div className="flex items-center gap-3 justify-center">
          <FiMail className={`w-5 h-5 ${subTextClass}`} />
          <span className={subTextClass}>{profile.email}</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfile;
