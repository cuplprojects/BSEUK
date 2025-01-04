import React from "react";
import PropTypes from "prop-types";

const ConfirmationModal = ({ question, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null; // Do not render if modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
        {/* Modal Content */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{question}</h3>
        <div className="flex justify-end space-x-4">
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes for validation
ConfirmationModal.propTypes = {
  question: PropTypes.string.isRequired, // The question to display
  onConfirm: PropTypes.func.isRequired, // Callback when confirmed
  onCancel: PropTypes.func.isRequired,  // Callback when canceled
  isOpen: PropTypes.bool.isRequired,    // Modal visibility state
};

export default ConfirmationModal;
