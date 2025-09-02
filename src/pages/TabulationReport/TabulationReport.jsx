import React, { useEffect, useState } from 'react'
import API from '../../services/api';
import { useThemeStore } from '../../store/themeStore';

const TabulationReport = () => {
    const theme = useThemeStore((state) => state.theme);

    const [sessions, setSessions] = useState([]);
    const [semesters, setSemesters] = useState([]);

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

    return (
        <div className="p-6">
            <h1 className={`text-center text-3xl font-bold mb-6 mt-20 ${textClass}`}>
                Tabulation Report
            </h1>

            {/* Map Semester Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {semesters.map((sem) => (
                    <div 
                        key={sem.semID} 
                        className={`p-4 rounded-2xl ${cardClass}`}
                    >
                        <h2 className={`text-xl font-semibold ${textClass}`}>
                            {sem.semesterName} - {sem.semID}
                        </h2>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {sessions.map((sem) => (
                    <div 
                        key={sem.semID} 
                        className={`p-4 rounded-2xl ${cardClass}`}
                    >
                        <h2 className={`text-xl font-semibold ${textClass}`}>
                            {sem.sessionName} - {sem.sesID}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TabulationReport
