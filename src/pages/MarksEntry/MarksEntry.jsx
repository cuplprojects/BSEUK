import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { useNavigate } from 'react-router-dom';

const MarksEntry = () => {
    const theme = useThemeStore((state) => state.theme);
    const navigate = useNavigate();

    // State management
    const [sessions, setSessions] = useState([
        { _id: 's1', session: '2021-2022' },
        { _id: 's2', session: '2022-2023' },
        { _id: 's3', session: '2023-2024' },
    ]);
    const [semesters, setSemesters] = useState([
        { _id: 's1', semester: 'Semester 1' },
        { _id: 's2', semester: 'Semester 2' },
        { _id: 's3', semester: 'Semester 3' },
        { _id: 's4', semester: 'Semester 4' },
        { _id: 's5', semester: 'Semester 5' },
        { _id: 's6', semester: 'Semester 6' },
        { _id: 's7', semester: 'Semester 7' },
        { _id: 's8', semester: 'Semester 8' },
    ]);
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [students, setStudents] = useState([
        { _id: 's1', rollNo: '12345', name: 'John Doe', marks: 90 },
        { _id: 's2', rollNo: '67890', name: 'Jane Doe', marks: 80 },
        { _id: 's3', rollNo: '34567', name: 'Bob Smith', marks: 70 },
        { _id: 's4', rollNo: '89012', name: 'Alice Johnson', marks: 60 },
        { _id: 's5', rollNo: '56789', name: 'Charlie Brown', marks: 50 },
        { _id: 's6', rollNo: '23456', name: 'Eva Green', marks: 40 },
        { _id: 's7', rollNo: '90123', name: 'David Lee', marks: 30 },
        { _id: 's8', rollNo: '45678', name: 'Sophia Kim', marks: 20 },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);
    const [page, setPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const [loadingDropdown, setLoadingDropdown] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });


    // Fetch dropdown data on component mount
    useEffect(() => {
        fetchSessionsAndSemesters();
    }, []);

    // Fetch students based on dropdown selections and filters
    useEffect(() => {
        if (selectedSession && selectedSemester) {
            fetchStudents();
        }
    }, [selectedSession, selectedSemester, page, searchTerm, entriesToShow]);

    // Fetch sessions and semesters for dropdowns
    const fetchSessionsAndSemesters = async () => {
        setLoadingDropdown(true);
        try {
            const [sessionsData, semestersData] = await Promise.all([
                fetch('/api/sessions').then((res) => res.json()),
                fetch('/api/semesters').then((res) => res.json()),
            ]);
            setSessions(sessionsData);
            setSemesters(semestersData);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        } finally {
            setLoadingDropdown(false);
        }
    };

    // Fetch students data
    const fetchStudents = async () => {
        try {
            const response = await fetch(
                `/api/students?session=${selectedSession}&semester=${selectedSemester}&page=${page}&search=${searchTerm}&limit=${entriesToShow}`
            );
            const data = await response.json();
            setStudents(data.students);
            setTotalEntries(data.totalEntries);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const  handleEdit = (studentId) => {
        navigate(`/marks-entry/MarksEntryForm/${studentId}`);
    };

    // Pagination handler
    const handlePagination = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(totalEntries / entriesToShow)) {
            setPage(newPage);
        }
    };

    // Dropdown loading spinner or empty state handling
    const dropdownLoading = (
        <option value="" disabled>
            Loading...
        </option>
    );

    const dropdownEmpty = (
        <option value="" disabled>
            No options available
        </option>
    );

    const handleSort = (key) => {
        const direction =
            sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });

        const sortedStudents = [...students].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setStudents(sortedStudents);
    };

    // Render Sort Indicator
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '↑' : '↓';
        }
        return null;
    };

    // Theme-based styles
    const cardClass =
        theme === 'dark'
            ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
            : 'bg-white border-slate-200 shadow-lg';

    return (
        <div className="space-y-6">
            <h1
                className={`text-3xl font-bold ${theme === 'dark'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-800'
                    : 'text-blue-700'
                    }`}
            >
                Marks Entry
            </h1>

            {/* Dropdowns */}
            <div className="flex items-center space-x-4">
                {/* Session Dropdown */}
                <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="p-2 border rounded-lg"
                    disabled={loadingDropdown}
                >
                    <option value="">Select Session</option>
                    {loadingDropdown
                        ? dropdownLoading
                        : sessions.length
                            ? sessions.map((session) => (
                                <option key={session._id} value={session._id}>
                                    {session.session}
                                </option>
                            ))
                            : dropdownEmpty}
                </select>

                {/* Semester Dropdown */}
                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="p-2 border rounded-lg"
                    disabled={loadingDropdown}
                >
                    <option value="">Select Semester</option>
                    {loadingDropdown
                        ? dropdownLoading
                        : semesters.length
                            ? semesters.map((semester) => (
                                <option key={semester._id} value={semester._id}>
                                    {semester.semester}
                                </option>
                            ))
                            : dropdownEmpty}
                </select>
            </div>

            {/* table content  */}
            <div className={`border rounded-md p-4 ${cardClass}`}>
                {/* Top Section */}
                <div className="flex justify-between items-center mb-4">
                    {/* Entries to Show */}
                    <div className="flex items-center space-x-1">
                        <label className="text-md font-medium" htmlFor="entriesToShow">
                            Show:
                        </label>
                        <select
                            id="entriesToShow"
                            value={entriesToShow}
                            onChange={(e) => setEntriesToShow(Number(e.target.value))}
                            className="p-2 border rounded-lg size-sm"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        <label className="text-md font-medium" htmlFor="entriesToShow">
                            Entries
                        </label>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <FiSearch className="absolute left-2 top-2.5 text-gray-500" />
                            <input
                                id="searchRollNo"
                                type="text"
                                placeholder="Enter roll no"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 p-2 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`border rounded-lg p-2 ${cardClass}`}
                >
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th
                                        className="px-4 py-2 border border-gray-300 cursor-pointer"
                                        onClick={() => handleSort('rollNo')}
                                    >
                                        Roll No {getSortIndicator('rollNo')}
                                    </th>
                                    <th
                                        className="px-4 py-2 border border-gray-300 cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        Name {getSortIndicator('name')}
                                    </th>
                                    <th
                                        className="px-4 py-2 border border-gray-300 cursor-pointer"
                                        onClick={() => handleSort('marks')}
                                    >
                                        Marks {getSortIndicator('marks')}
                                    </th>
                                    <th className="px-4 py-2 border border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr
                                        key={student.rollNo}
                                        className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                    >
                                        <td className="px-4 py-2 border border-gray-300">{student.rollNo}</td>
                                        <td className="px-4 py-2 border border-gray-300">{student.name}</td>
                                        <td className="px-4 py-2 border border-gray-300">{student.marks}</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <button
                                                onClick={() => handleEdit(student._id)}
                                                className="p-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Bottom Section */}
                <div className="flex justify-between items-center mt-4">
                    {/* Showing Range */}
                    <span className="text-md font-medium">
                        {`Showing ${Math.min((page - 1) * entriesToShow + 1, totalEntries)}–${Math.min(
                            page * entriesToShow,
                            totalEntries
                        )} of ${totalEntries}`}
                    </span>

                    {/* Pagination */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePagination(page - 1)}
                            className="p-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span className="text-md font-medium">{`Page ${page} of ${Math.ceil(
                            totalEntries / entriesToShow
                        )}`}</span>
                        <button
                            onClick={() => handlePagination(page + 1)}
                            className="p-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                            disabled={page === Math.ceil(totalEntries / entriesToShow)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarksEntry;
