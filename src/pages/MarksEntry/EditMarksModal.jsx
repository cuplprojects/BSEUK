import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import EditMarks from './EditMarks';

const EditMarksModal = ({ 
    isOpen, 
    onClose, 
    student, 
    paperDetails,
    theme,
    selectedPaper 
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 ${theme === 'dark' ? 'bg-black/50' : 'bg-gray-600/50'} 
                backdrop-blur-sm z-50 flex items-center justify-center p-4`}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className={`w-full max-w-3xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} 
                    rounded-xl shadow-xl border ${theme === 'dark' ? 'border-purple-500/20' : 'border-blue-200'} 
                    p-6 max-h-[90vh] overflow-y-auto`}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
                            Edit Marks
                        </h2>
                        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Student: {student?.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg hover:bg-opacity-80 ${
                            theme === 'dark'
                                ? 'bg-purple-600/20 text-purple-300'
                                : 'bg-blue-100 text-blue-600'
                        }`}
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Student Details */}
                <div className={`grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg 
                    ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-blue-50'}`}>
                    <div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-blue-600'}`}>
                            Roll Number: {student?.rollNo}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-blue-600'}`}>
                            Group: {student?.group}
                        </p>
                    </div>
                    <div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-blue-600'}`}>
                            Father's Name: {student?.fName}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-purple-300' : 'text-blue-600'}`}>
                            Institution: {student?.institutionName}
                        </p>
                    </div>
                </div>

                {/* Marks Entry Form or Paper Selection Message */}
                {!selectedPaper ? (
                    <div className={`flex items-center justify-center p-6 ${
                        theme === 'dark' ? 'text-purple-300' : 'text-blue-600'
                    }`}>
                        <FiAlertCircle className="w-5 h-5 mr-2" />
                        <span>Please select a paper first to enter marks</span>
                    </div>
                ) : (
                    <EditMarks
                        paperID={paperDetails?.paperID}
                        paperName={paperDetails?.paperName}
                        paperCode={paperDetails?.paperCode}
                        paperType={paperDetails?.paperType}
                        theme={theme}
                        studentId={student?.candidateId}
                    />
                )}
            </motion.div>
        </motion.div>
    );
};

export default EditMarksModal;
