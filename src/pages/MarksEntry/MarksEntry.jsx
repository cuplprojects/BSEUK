import { useState, useEffect, useMemo } from "react";
import { useThemeStore } from "../../store/themeStore";
import API from "../../services/api";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';

const MarksEntry = () => {
  const theme = useThemeStore((state) => state.theme);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({ sesID: '', semID: '', paperID: '' });
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingDropdown, setLoadingDropdown] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paperDetails, setPaperDetails] = useState(null);
  const [studentsMarks, setStudentsMarks] = useState({});
  const [editableRows, setEditableRows] = useState({});
  const [originalMarks, setOriginalMarks] = useState({});
  // New table states
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [data, setData] = useState([]); // This will hold the data for the table

  // Theme classes
  const cardClass =
    theme === "dark"
      ? "bg-black/40 backdrop-blur-xl border-purple-500/20"
      : "bg-white border-blue-200 shadow-sm";

  const textClass = theme === "dark" ? "text-purple-100" : "text-blue-700";

  const inputClass =
    theme === "dark"
      ? "bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400"
      : "bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400";

  const columns = [
    { accessorKey: 'rollNumber', header: 'Roll Number' },
    { accessorKey: 'studentName', header: 'Student Name' },
    { accessorKey: 'marks', header: 'Marks' },
  ];

  const table = useReactTable({
    data,
    columns,
    globalFilterFn: 'includes',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await API.get("Sessions");
        setSessions(sessionResponse.data);
        const semesterResponse = await API.get("Semesters");
        setSemesters(semesterResponse.data);
        const paperResponse = await API.get("Papers");
        setPapers(paperResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='max-w-6xl mx-auto p-5'>
      <h1 className='text-3xl font-bold mb-5'>Marks Entry</h1>
      <div className='flex flex-col md:flex-row justify-between mb-4'>
        <div className='flex flex-row gap-2 w-full'>
          <select className='border rounded p-2 flex-1' onChange={(e) => setSelectedFilters({ ...selectedFilters, sesID: e.target.value })}>
            <option value="">Select Session</option>
            {sessions.map((session) => (
              <option key={session.sesID} value={session.sesID}>{session.sessionName}</option>
            ))}
          </select>
          <select className='border rounded p-2 flex-1' onChange={(e) => setSelectedFilters({ ...selectedFilters, semID: e.target.value })} disabled={!selectedFilters.sesID}>
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester.semID} value={semester.semID}>{semester.semesterName}</option>
            ))}
          </select>
          <select className='border rounded p-2 flex-1' onChange={(e) => setSelectedFilters({ ...selectedFilters, paperID: e.target.value })} disabled={!selectedFilters.semID}>
            <option value="">Select Paper</option>
            {papers.map((paper) => (
              <option key={paper.paperID} value={paper.paperID}>{paper.paperName}</option>
            ))}
          </select>
        </div>
        <input
          type='text'
          placeholder='Search...'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='border rounded p-2 mb-4 md:mb-0 md:ml-4 w-full md:w-64'
        />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead className='bg-gray-200'>
            <tr>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id} className='border border-gray-300 p-2'>{column.header}</th>
                  ))}
                </tr>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className='border-b hover:bg-gray-100'>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='border border-gray-300 p-2'>{cell.getValue()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between mt-4'>
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className='border rounded p-2 bg-blue-500 text-white'>First</button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className='border rounded p-2 bg-blue-500 text-white'>Previous</button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className='border rounded p-2 bg-blue-500 text-white'>Next</button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className='border rounded p-2 bg-blue-500 text-white'>Last</button>
      </div>
    </div>
  );
};

export default MarksEntry;
