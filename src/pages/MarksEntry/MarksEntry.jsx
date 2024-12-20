import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MarksEntry = () => {
    const theme = useThemeStore((state) => state.theme);
    const navigate = useNavigate();

    // State management
    const [sessions, setSessions] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesToShow, setEntriesToShow] = useState(10);
    const [page, setPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const [loadingDropdown, setLoadingDropdown] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
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
    }, [selectedSession, selectedSemester]);

    // Fetch sessions and semesters for dropdowns
    const fetchSessionsAndSemesters = async () => {
        setLoadingDropdown(true);
        try {
            const [sessionsResponse, semestersResponse] = await Promise.all([
                axios.get('https://localhost:7133/api/Sessions'),
                axios.get('https://localhost:7133/api/Semesters')
            ]);
            
            // Map the responses to match the expected format
            const mappedSessions = sessionsResponse.data.map(session => ({
                id: session.sesID.toString(),
                session: session.sessionName
            }));
            
            const mappedSemesters = semestersResponse.data.map(semester => ({
                id: semester.semID.toString(),
                semester: semester.semesterName
            }));

            setSessions(mappedSessions);
            setSemesters(mappedSemesters);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
            // Set empty arrays to prevent loading state from hanging
            setSessions([]);
            setSemesters([]);
        } finally {
            setLoadingDropdown(false);
        }
    };

    // Fetch students data
    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const response = await axios.post(
                'https://localhost:7133/api/Candidates/GetStudents',  // Change GET to POST
                {
                    sesID: parseInt(selectedSession),
                    semID: parseInt(selectedSemester)
                },
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure content type is set to JSON for POST
                        'Accept': 'application/json' // Ensure you accept JSON response
                    }
                }
            );
    
            // Map the full response data
            const mappedStudents = response.data.map(candidate => ({
                id: candidate.candidateID.toString(),
                candidateId: candidate.candidateID,
                name: candidate.candidateName,
                rollNo: candidate.rollNumber,
                group: candidate.group,
                fName: candidate.fName,
                mName: candidate.mName,
                dob: candidate.dob,
                institutionName: candidate.institutionName,
                semID: candidate.semID,
                sesID: candidate.sesID
            }));
    
            setStudents(mappedStudents);
            setTotalEntries(response.data.length);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
            setTotalEntries(0);
        } finally {
            setLoadingStudents(false);
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
            ? 'bg-black/20 backdrop-blur-xl border-purple-500/20'
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
                                <option key={session.id} value={session.id}>
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
                                <option key={semester.id} value={semester.id}>
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
                        {selectedSession && selectedSemester ? (
                            loadingStudents ? (
                                <div className="flex justify-center items-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                                    <span className="ml-2">Loading students...</span>
                                </div>
                            ) : students.length > 0 ? (
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 border border-gray-300">Candidate ID</th>
                                            <th 
                                                className="px-4 py-2 border border-gray-300 cursor-pointer"
                                                onClick={() => handleSort('name')}
                                            >
                                                Name {getSortIndicator('name')}
                                            </th>
                                            <th 
                                                className="px-4 py-2 border border-gray-300 cursor-pointer"
                                                onClick={() => handleSort('rollNo')}
                                            >
                                                Roll No {getSortIndicator('rollNo')}
                                            </th>
                                            <th 
                                                className="px-4 py-2 border border-gray-300 cursor-pointer"
                                                onClick={() => handleSort('group')}
                                            >
                                                Group {getSortIndicator('group')}
                                            </th>
                                            <th 
                                                className="px-4 py-2 border border-gray-300 cursor-pointer"
                                                onClick={() => handleSort('fName')}
                                            >
                                                Father's Name {getSortIndicator('fName')}
                                            </th>
                                            <th 
                                                className="px-4 py-2 border border-gray-300 cursor-pointer"
                                                onClick={() => handleSort('mName')}
                                            >
                                                Mother's Name {getSortIndicator('mName')}
                                            </th>
                                            <th 
                                                className="px-4 py-2 border border-gray-300 cursor-pointer"
                                                onClick={() => handleSort('dob')}
                                            >
                                                Date of Birth {getSortIndicator('dob')}
                                            </th>
                                            <th 
                                                className="px-4 py-2 border border-gray-300 cursor-pointer"
                                                onClick={() => handleSort('institutionName')}
                                            >
                                                Institution Name {getSortIndicator('institutionName')}
                                            </th>
                                            <th 
                                                className="px-4 py-2 border border-gray-300 cursor-pointer"
                                                onClick={() => handleSort('semID')}
                                            >
                                                Semester ID {getSortIndicator('semID')}
                                            </th>
                                            <th 
                                                className="px-4 py-2 border border-gray-300 cursor-pointer"
                                                onClick={() => handleSort('sesID')}
                                            >
                                                Session ID {getSortIndicator('sesID')}
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr
                                                key={student.id}
                                                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                            >
                                                <td className="px-4 py-2 border border-gray-300">{student.candidateId}</td>
                                                <td className="px-4 py-2 border border-gray-300">{student.name}</td>
                                                <td className="px-4 py-2 border border-gray-300">{student.rollNo}</td>
                                                <td className="px-4 py-2 border border-gray-300">{student.group}</td>
                                                <td className="px-4 py-2 border border-gray-300">{student.fName}</td>
                                                <td className="px-4 py-2 border border-gray-300">{student.mName}</td>
                                                <td className="px-4 py-2 border border-gray-300">{student.dob}</td>
                                                <td className="px-4 py-2 border border-gray-300">{student.institutionName}</td>
                                                <td className="px-4 py-2 border border-gray-300">{student.semID}</td>
                                                <td className="px-4 py-2 border border-gray-300">{student.sesID}</td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    <button
                                                        onClick={() => handleEdit(student.id)}
                                                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    No students found for the selected session and semester.
                                </div>
                            )
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                Please select both Session and Semester to view students.
                            </div>
                        )}
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
