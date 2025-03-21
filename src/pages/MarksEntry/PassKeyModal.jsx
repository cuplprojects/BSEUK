import React, { useState } from 'react';
import { FiLock, FiKey, FiX, FiShield } from 'react-icons/fi';
import { useThemeStore } from '../../store/themeStore';

const PassKeyModal = ({ isOpen, onClose, onSubmit }) => {
  const [passKey, setPassKey] = useState('');
  const theme = useThemeStore((state) => state.theme);

  const modalClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border border-purple-500/20'
    : 'bg-white border border-blue-200 shadow-xl';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
    : 'bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  const iconClass = theme === 'dark'
    ? 'text-purple-400'
    : 'text-blue-400';

  const handleSubmit = () => {
    onSubmit(passKey);
    setPassKey('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className={`${modalClass} w-full max-w-sm rounded-2xl`}>
        {/* Close button */}
        <button 
          onClick={onClose}
          className={`absolute right-4 top-4 p-2 rounded-full hover:bg-purple-900/20 transition-colors ${textClass}`}
        >
          <FiX size={20} />
        </button>

        {/* Modal content */}
        <div className="p-8">
          {/* Icon header */}
          <div className="flex justify-center mb-6">
            <div className={`${buttonClass} p-4 rounded-2xl`}>
              <FiShield size={32} />
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-center text-xl font-bold ${textClass} mb-2`}>
            Admin Authentication
          </h2>
          <p className={`text-center ${iconClass} mb-6`}>
            Enter your admin passkey to proceed
          </p>

          {/* Input field */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center">
              <FiLock className={iconClass} size={18} />
            </div>
            <input
              type="password"
              value={passKey}
              onChange={(e) => setPassKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className={`w-full pl-12 pr-4 py-3 rounded-xl transition-colors ${inputClass}`}
              placeholder="Enter passkey"
              autoFocus
            />
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className={`px-4 py-3 rounded-xl transition-colors border ${textClass} hover:bg-purple-900/10`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-4 py-3 rounded-xl transition-colors ${buttonClass} flex items-center justify-center gap-2`}
            >
              <FiKey size={18} />
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassKeyModal;