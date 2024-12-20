import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StudentData from './StudentData';
import Papers from './Papers';
import EditMarks from './EditMarks';
import API from '../../services/api';
import { useThemeStore } from '../../store/themeStore';

const MarksEntryForm = ({ studentId, onSubmit }) => {
    const theme = useThemeStore((state) => state.theme);
    const [studentData, setStudentData] = useState(null);
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch student data based on studentId
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const response = await API.get(API.endpoints.students.detail(studentId));
                setStudentData(response.data);
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]);

    // Fetch papers data (mock for now)
    useEffect(() => {
        const mockPapers = [
            { id: 1, name: 'Mathematics' },
            { id: 2, name: 'Science' },
            { id: 3, name: 'History' },
        ];
        setPapers(mockPapers);
    }, []);

    // Theme-based styles
    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border-r border-purple-500/20'
        : 'bg-white border-slate-200 shadow-lg';

    const textClass = theme === 'dark'
        ? 'text-white'
        : 'text-blue-900';

    const subTextClass = theme === 'dark'
        ? 'text-purple-300'
        : 'text-blue-600';

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <h1 className={`text-3xl font-bold ${theme === 'dark'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-800'
                    : 'text-blue-700'}`}
                >
                    Marks Entry Form
                </h1>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section: Student Data */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`border rounded-lg p-6 ${cardClass}`}
                    >
                        <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Student Information</h2>
                        {loading ? (
                            <div className={`flex justify-center items-center py-4 ${subTextClass}`}>
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-current"></div>
                                <span className="ml-2">Loading student data...</span>
                            </div>
                        ) : (
                            <StudentData studentData={studentData} theme={theme} />
                        )}
                    </motion.div>

                    {/* Right Section: Papers List and Edit Marks */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`border rounded-lg p-6 ${cardClass}`}
                        >
                            <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Papers</h2>
                            <Papers papers={papers} theme={theme} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`border rounded-lg p-6 ${cardClass}`}
                        >
                            <h2 className={`text-xl font-semibold ${textClass} mb-4`}>Enter Marks</h2>
                            <EditMarks studentId={studentId} onSubmit={onSubmit} theme={theme} />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MarksEntryForm;
