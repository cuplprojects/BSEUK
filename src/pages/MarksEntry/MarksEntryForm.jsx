import React, { useState, useEffect } from 'react';
import StudentData from './StudentData';
import Papers from './Papers';
import EditMarks from './EditMarks';
import API from '../../services/api';

const MarksEntryForm = ({ studentId, onSubmit, theme }) => {
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
    const containerClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
    const headerClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white';

    return (
        <div className={`min-h-screen p-6 ${containerClass}`}>
            {/* Header */}
            <header className={`${headerClass} p-4 rounded-lg mb-6`}>
                <h1 className="text-2xl font-semibold">Marks Entry</h1>
            </header>

            <div className="grid grid-cols-3 gap-6">
                {/* Left Section: Student Data */}
                <div className="col-span-1">
                    {loading ? (
                        <div className="text-center text-gray-500">Loading student data...</div>
                    ) : (
                        <StudentData studentData={studentData} />
                    )}
                </div>

                {/* Right Section: Papers List and Edit Marks */}
                <div className="col-span-2 grid grid-rows-2 gap-6">
                    <Papers papers={papers} />
                    <EditMarks studentId={studentId} onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    );
};

export default MarksEntryForm;
