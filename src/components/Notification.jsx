import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiLoader 
} from 'react-icons/fi';

const POSITIONS = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4'
};

const TYPE_CONFIGS = {
  error: {
    icon: FiAlertCircle,
    bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
    borderColor: 'border-red-400',
    textColor: 'text-white',
    iconColor: 'text-white'
  },
  warning: {
    icon: FiAlertTriangle,
    bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
    borderColor: 'border-yellow-400',
    textColor: 'text-white',
    iconColor: 'text-white'
  },
  success: {
    icon: FiCheckCircle,
    bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
    borderColor: 'border-green-400',
    textColor: 'text-white',
    iconColor: 'text-white'
  },
  processing: {
    icon: FiLoader,
    bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    borderColor: 'border-blue-400',
    textColor: 'text-white',
    iconColor: 'text-white'
  }
};

const Notification = ({ 
  show = false,
  type = 'success',
  message = '',
  position = 'top-right',
  autoClose = 5000, // Default to 5 seconds
  onClose = () => {},
  // Add a unique key to help manage multiple notifications
  key = null
}) => {
  const [isVisible, setIsVisible] = useState(show);

  // Use useCallback to memoize the close function
  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose();
  }, [onClose]);

  // Effect to handle showing and auto-closing
  useEffect(() => {
    // Always set visibility based on show prop
    setIsVisible(show);

    // If show is true, set up auto-close timer
    if (show) {
      const timer = setTimeout(handleClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, handleClose]);

  const config = TYPE_CONFIGS[type];
  const Icon = config.icon;
  const positionClasses = POSITIONS[position];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={key || 'notification'}
          initial={{ opacity: 0, y: position.includes('top') ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position.includes('top') ? -20 : 20 }}
          className={`fixed z-50 ${positionClasses}`}
        >
          <div
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
              ${config.bgColor} ${config.borderColor}
              min-w-[300px] max-w-[500px]
            `}
          >
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              {type === 'processing' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
            
            <p className={`flex-1 text-sm ${config.textColor}`}>
              {message}
            </p>

            <button
              onClick={handleClose}
              className={`flex-shrink-0 ${config.iconColor} hover:${config.textColor} transition-colors`}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;