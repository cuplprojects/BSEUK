import React, { useEffect, useState } from 'react'
import axios from "axios";
import API from '../../services/api'; // keep using this for Semesters/Sessions
import { toast, ToastContainer } from "react-toastify";
import { useThemeStore } from '../../store/themeStore';

const TabulationReport = () => {
    const theme = useThemeStore((state) => state.theme);

    const [sessions, setSessions] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [awardsheetNumber, setAwardsheetNumber] = useState('');
    const [month, setMonth] = useState('tqykbZ');
    const [year, setYear] = useState(2025);
    const [pdfUrl, setPdfUrl] = useState(null);

    const textClass = theme === 'dark' ? 'text-purple-100' : 'text-blue-700';

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

    const handleDownload = async () => {
        if (!selectedSemester || !selectedSession) {
            toast.error("Please select Semester and Session");
            return;
        }

        try {
            const semester = selectedSemester;
            const session = selectedSession;
            const starting_awardsheet_number =
                semester === "44" ? parseInt(awardsheetNumber || "0") : 0;

            const params = {
                semester,
                session,
                starting_awardsheet_number,
                month,
                year
            };

            // Direct axios call (no API service)
            const response = await axios.get(
                "http://192.168.1.24:100/api/Reports/GetTR1Report",
                {
                    params,
                    responseType: "blob"
                }
            );

            if (response.data) {
                const file = new Blob([response.data], { type: "application/pdf" });
                const fileUrl = URL.createObjectURL(file);
                setPdfUrl(fileUrl);
                toast.success("Report loaded!");
            } else {
                toast.warn("No report data found.");
            }
        } catch (error) {
            console.error("Error downloading report:", error);
            toast.error("Failed to download report");
        }
    };

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
            <h1 className={`text-center text-3xl font-bold mb-6 mt-0 ${textClass}`}>
                Tabulation Report
            </h1>

            {/* Inputs Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 flex-wrap">
                {/* Semester */}
                <div>
                    <label className={`block mb-1 font-semibold ${textClass}`}>Semester</label>
                    <select
                        className="px-4 py-2 rounded-md border border-gray-300 focus:ring focus:outline-none"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                    >
                        <option value="">Select Semester</option>
                        {semesters.map((sem) => (
                            <option key={sem.semID} value={sem.semID}>
                                {sem.semesterName}
                            </option>
                        ))}
                        <option value="44">Final Marks TR</option>
                    </select>
                </div>

                {/* Session */}
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

                {/* Awardsheet (only for sem 44) */}
                {selectedSemester === "44" && (
                    <div>
                        <label className={`block mb-1 font-semibold ${textClass}`}>
                            Awardsheet Number
                        </label>
                        <input
                            type="number"
                            className="px-4 py-2 rounded-md border border-gray-300 focus:ring focus:outline-none"
                            value={awardsheetNumber}
                            onChange={(e) => setAwardsheetNumber(e.target.value)}
                            placeholder="Enter Awardsheet No."
                        />
                    </div>
                )}

                {/* Month */}
                <div>
                    <label className={`block mb-1 font-semibold ${textClass}`}>Month <span className='text-red-600'>(in kruti dev)</span> </label>
                    <input
                        type="text"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:ring focus:outline-none"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        placeholder="Month in Kruti Dev"
                    />
                </div>

                {/* Year */}
                <div>
                    <label className={`block mb-1 font-semibold ${textClass}`}>Year</label>
                    <input
                        type="number"
                        className="px-4 py-2 rounded-md border border-gray-300 focus:ring focus:outline-none"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Year"
                    />
                </div>

                {/* <button
                    className="mt-4 md:mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold shadow transition"
                    onClick={handleDownload}
                >
                    Download
                </button> */}
                <a
                    href={`http://192.168.1.24:100/api/Reports/GetTR1Report?semester=${selectedSemester}&session=${selectedSession}&starting_awardsheet_number=${selectedSemester === "44" ? awardsheetNumber || 0 : 0}&month=${month}&year=${year}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 md:mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold shadow transition inline-block"
                >
                    Open
                </a>

            </div>

            {/* A3 PDF Preview */}
            {/* <div className="w-full flex justify-center">
                <div className="border-2 border-dashed border-gray-400 rounded-xl w-[1684px] h-[1190px] flex items-center justify-center bg-gray-50 overflow-hidden">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            title="PDF Preview"
                            className="w-full h-full rounded-xl"
                        />
                    ) : (
                        <span className="text-gray-400 text-xl">
                            [A3 Landscape Preview Area]
                        </span>
                    )}
                </div>
            </div> */}
        </div>
    )
}

export default TabulationReport;
