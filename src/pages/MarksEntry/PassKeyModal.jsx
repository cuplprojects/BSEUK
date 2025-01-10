import React, { useState } from 'react';

const PassKeyModal = ({ isOpen, onClose, onSubmit }) => {
  const [passKey, setPassKey] = useState('');

  const handleSubmit = () => {
    onSubmit(passKey);
    setPassKey('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter Passkey</h2>
        <input
          type="password"
          value={passKey}
          onChange={(e) => setPassKey(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Passkey"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassKeyModal;