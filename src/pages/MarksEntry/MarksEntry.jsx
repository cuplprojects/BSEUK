import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { FiEdit2, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import API from '../../services/api';
import EditMarksModal from './EditMarksModal';

const MarksEntry = () => {
    const navigate = useNavigate();
    const theme = useThemeStore((state) => state.theme);
    const [students, setStudents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [papers, setPapers] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loadingDropdown, setLoadingDropdown] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paperDetails, setPaperDetails] = useState(null);
    const [selectedPaper, setSelectedPaper] = useState(''); // Change initial state to empty string

    // New table states
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    // Theme classes
    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
        : 'bg-white border-blue-200 shadow-sm';

    const textClass = theme === 'dark'
        ? 'text-purple-100'
        : 'text-blue-700';

    const inputClass = theme === 'dark'
        ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400'
        : 'bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400';

    const fetchPapers = async (semesterId) => {
        if (!semesterId) {
            setPapers([]);
            return;
        }
        setLoadingDropdown(true);
        try {
            const response = await API.get(`/Papers/GetBySem/${semesterId}`);
            // console.log(response.data)
            setPapers(response.data);
        } catch (error) {
            console.error('Error fetching papers:', error);
            setPapers([]);
        } finally {
            setLoadingDropdown(false);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoadingDropdown(true);
            try {
                const [sessionsResponse, semestersResponse] = await Promise.all([
                    API.get('/Sessions'),
                    API.get('/Semesters')
                ]);
                setSessions(sessionsResponse.data);
                setSemesters(semestersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingDropdown(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        fetchPapers(selectedSemester);
    }, [selectedSemester]);

    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const response = await API.post(
                '/Candidates/GetStudents',
                {
                    sesID: parseInt(selectedSession),
                    semID: parseInt(selectedSemester)
                }
            );

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
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };
    // console.log(selectedPaper)
    useEffect(() => {
        if (selectedSession && selectedSemester) {
            fetchStudents();
        }
    }, [selectedSession, selectedSemester]);

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handlePaperChange = (e) => {
        const value = e.target.value;
        setSelectedPaper(value);
        if (value) {
            // Fetch paper details when paper is selected
            const fetchPaperDetails = async () => {
                try {
                    const response = await API.get(`/Papers/${value}`);
                    setPaperDetails(response.data);
                } catch (error) {
                    console.error('Error fetching paper details:', error);
                }
            };
            fetchPaperDetails();
        } else {
            setPaperDetails(null);
        }
    };

    // Table columns definition
    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            enableSorting: true,
        },
        {   
            accessorKey: 'rollNo',
            header: 'Roll No',
            enableSorting: true,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <button 
                    onClick={() => handleEdit(row.original)}
                    disabled={selectedPaper === ''}
                    className={`px-3 py-1 rounded-lg ${
                        theme === 'dark' 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={selectedPaper === '' ? "Please select a paper first" : "Edit marks"}
                >
                    <FiEdit2 className="w-4 h-4" />
                </button>
            ),
        },
    ], [theme, selectedPaper]);

    // Initialize table
    const table = useReactTable({
        data: students,
        columns,
        state: {
            globalFilter,
            sorting,
            pagination,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-6 p-6">
            {/* Filters Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-6 ${cardClass}`}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={`block mb-2 ${textClass}`}>Session</label>
                        <select
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                            disabled={loadingDropdown}
                        >
                            <option value="">Select Session</option>
                            {sessions.map((session) => (
                                <option key={session.sesID} value={session.sesID}>
                                    {session.sessionName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`block mb-2 ${textClass}`}>Semester</label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                            disabled={loadingDropdown}
                        >
                            <option value="">Select Semester</option>
                            {semesters.map((semester) => (
                                <option key={semester.semID} value={semester.semID}>
                                    {semester.semesterName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`block mb-2 ${textClass}`}>Papers</label>
                        <select
                            value={selectedPaper}
                            onChange={handlePaperChange}
                            className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                            disabled={loadingDropdown}
                        >
                            <option value="">Select Paper</option>
                            {papers.map((paper) => (
                                <option key={paper.paperID} value={paper.paperID}>
                                    {paper.paperName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Table Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`border rounded-lg p-4 ${cardClass} space-y-4`}
            >
                {/* Search */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-purple-400' : 'text-blue-400'}`} />
                        <input
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            placeholder="Search students..."
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${inputClass}`}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${theme === 'dark' ? 'border-purple-500/20' : 'border-blue-200'}`}>
                                {table.getHeaderGroups().map(headerGroup => (
                                    headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className={`px-6 py-4 text-left ${textClass} ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && (
                                                    <div className="flex flex-col">
                                                        {header.column.getIsSorted() === 'asc' ? (
                                                            <FiChevronUp className="w-4 h-4" />
                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                            <FiChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <div className="flex flex-col">
                                                                <FiChevronUp className="w-4 h-4 -mb-1.5 text-gray-400" />
                                                                <FiChevronDown className="w-4 h-4 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    ))
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loadingStudents ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-4">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-current"></div>
                                            <span>Loading students...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-4">
                                        No students found
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, index) => (
                                    <tr
                                        key={row.id}
                                        className={`
                                            border-b last:border-b-0 
                                            ${index % 2 === 0
                                                ? theme === 'dark'
                                                    ? 'bg-purple-900/10'
                                                    : 'bg-blue-50'
                                                : theme === 'dark'
                                                    ? 'bg-transparent'
                                                    : 'bg-white'
                                            }
                                            hover:${theme === 'dark' ? 'bg-purple-900/20' : 'bg-blue-100'} 
                                            transition-colors
                                        `}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className={`px-6 py-4 ${textClass}`}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className={`px-3 py-1.5 rounded-lg border ${inputClass}`}
                        >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                        <span className={textClass}>
                            Page {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className={`px-3 py-1.5 rounded-lg border ${inputClass} disabled:opacity-50`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className={`px-3 py-1.5 rounded-lg border ${inputClass} disabled:opacity-50`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </motion.div>
            <EditMarksModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStudent(null);
                }}
                student={selectedStudent}
                paperDetails={paperDetails}
                selectedPaper={selectedPaper}
                theme={theme}
            />
        </div>
    );
};

export default MarksEntry;
