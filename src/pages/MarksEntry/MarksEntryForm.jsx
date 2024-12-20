import React, { useState, useEffect } from 'react';

const MarksEntryForm = ({ studentId, onSubmit, theme }) => {
    const [studentData, setStudentData] = useState(null);
    const [marks, setMarks] = useState('');
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch student data based on studentId
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/students/${studentId}`);
                const data = await response.json();
                setStudentData(data);
                setMarks(data.marks || '');
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

    const handleMarksChange = (e) => {
        setMarks(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (onSubmit) {
            try {
                await onSubmit({ studentId, marks });
                setSuccessMessage('Marks have been successfully submitted!');
                // Clear the success message after a few seconds
                setTimeout(() => setSuccessMessage(''), 5000);
            } catch (error) {
                console.error('Error submitting marks:', error);
            }
        }
    };

    // Theme-based styles
    const containerClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
    const buttonClass =
        theme === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white';
    const headerClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white';
    const footerClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white';

    return (
        <div className={`min-h-screen flex flex-col ${containerClass}`}>
            {/* Header */}
            <header className={`${headerClass} p-4`}>
                <h1 className="text-2xl font-semibold">Marks Entry</h1>
            </header>

            <main className="flex-grow p-6">
                <h2 className="text-xl font-bold mb-4">Enter Marks</h2>

                {loading ? (
                    <div className="text-center text-gray-500">Loading student data...</div>
                ) : studentData ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Roll No:</label>
                            <span className="block p-2 border rounded-lg">{studentData.rollNo}</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name:</label>
                            <span className="block p-2 border rounded-lg">{studentData.name}</span>
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="marks"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Marks:
                            </label>
                            <input
                                type="number"
                                id="marks"
                                value={marks}
                                onChange={handleMarksChange}
                                className="mt-1 p-2 border rounded-lg w-full"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Student not found</div>
                )}

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={() => setMarks('')}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded-lg ${buttonClass}`}
                        disabled={!marks}
                    >
                        Submit
                    </button>
                </div>

                {successMessage && (
                    <div className="mt-4 text-green-500 font-semibold">
                        {successMessage}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className={`${footerClass} p-4`}>
                <p className="text-center">© 2024 Marks Entry System</p>
            </footer>
        </div>
    );
};

export default MarksEntryForm;
