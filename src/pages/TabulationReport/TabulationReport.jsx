import React, { useEffect, useState } from 'react'
import API from '../../services/api';
import { toast, ToastContainer } from "react-toastify";
import { useThemeStore } from '../../store/themeStore';

const TabulationReport = () => {
    const theme = useThemeStore((state) => state.theme);

    const [sessions, setSessions] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSession, setSelectedSession] = useState('');

    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border border-purple-500/20 hover:bg-purple-900/20'
        : 'bg-white border-blue-200 shadow-xl hover:shadow-2xl hover:bg-blue-50/50';

    const textClass = theme === 'dark'
        ? 'text-purple-100'
        : 'text-blue-700';

    useEffect(() => {
        fetchSessions();
        fetchSemesters();
    }, []);

    const fetchSemesters = async () => {
        try {
            const response = await API.get('Semesters');
            setSemesters(response.data);
        } catch (error) {
            console.error("Error fetching semesters:", error);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await API.get('Sessions');
            setSessions(response.data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    const handleDownload = () => {
        // Download logic goes here
        // For now just an alert
        toast.info("Download triggered for selected semester and session");
    }

    return (
        <div className="p-8">
             <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={theme === 'dark' ? 'dark' : 'light'}
                  />
            <h1 className={`text-center text-3xl font-bold mb-6 mt-20 ${textClass}`}>
                Tabulation Report
            </h1>

            {/* Dropdown Selectors */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div>
                    <label className={`block mb-1 font-semibold ${textClass}`}>Semester</label>
                    <select
                        className="px-4 py-2 rounded-md border border-gray-300 focus:ring focus:outline-none"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                        <option value="">Select Semester</option>
                        {semesters.map(sem => (
                            <option key={sem.semID} value={sem.semID}>
                                {sem.semesterName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={`block mb-1 font-semibold ${textClass}`}>Session</label>
                    <select
                        className="px-4 py-2 rounded-md border border-gray-300 focus:ring focus:outline-none"
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                    >
                        <option value="">Select Session</option>
                        {sessions.map(sess => (
                            <option key={sess.sesID} value={sess.sesID}>
                                {sess.sessionName}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="mt-4 md:mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold shadow transition"
                    onClick={handleDownload}
                >
                    Download
                </button>
            </div>

            {/* Preview Area */}
            <div className="w-full flex justify-center">
                <div className="border-2 border-dashed border-gray-400 rounded-xl w-[595px] h-[420px] flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-xl">
                        [A5 Landscape Preview Area]
                    </span>
                </div>
            </div>
        </div>
    )
}

export default TabulationReport;
