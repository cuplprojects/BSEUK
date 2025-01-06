import React from 'react';
import { X } from 'lucide-react';

const PreviewModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Modal Container */}
      <div className="relative w-[95%] h-[90vh] rounded-lg shadow-xl z-10 flex flex-col">
        {/* Header with theme-based background */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Certificate Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Content with white background */}
        <div className="flex-1 overflow-auto p-4 bg-white rounded-b-lg">
          <div className="w-full h-full flex justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;