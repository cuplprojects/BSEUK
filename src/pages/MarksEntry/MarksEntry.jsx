import { useState, useEffect } from "react";
import API from "../../services/api";
import { useReactTable, getCoreRowModel, selectRowsFn } from "@tanstack/react-table";

const MarksEntry = () => {
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({ sesID: "", semID: "", paperID: "" });
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columns, setColumns] = useState([]);

  // Table Columns
  const getColumns = async (paperID) => {
    if (candidates.length === 0) return []; // No candidates, return empty columns

    console.log(paperID)
    const response = await API.get(`/Papers/${paperID}`);
    console.log(response.data)
    const paperType = response.data.paperType;

    if (paperType === 1) {
      return [
        {
          accessorFn: (row) => row?.marks?.theoryPaperMarks || 0,
          id: "theoryMarks",
          header: "Theory Marks",
        },
        {
          accessorFn: (row) => row?.marks?.interalMarks || 0,
          id: "internalMarks",
          header: "Internal Marks",
        },
      ];
    } else if (paperType === 2) {
      return [
        {
          accessorFn: (row) => row?.marks?.practicalMarks || 0,
          id: "practicalMarks",
          header: "Practical Marks",
        },
      ];
    }

    return []; // Default case if paperType is neither 1 nor 2
  };

  useEffect(() => {

    console.log(selectedFilters.paperID)
    const fetchColumns = async () => {
      const cols = await getColumns(selectedFilters.paperID);
      setColumns(cols);
    };

    fetchColumns();
  }, [candidates, selectedFilters.paperID]);

  

  const table = useReactTable({
    data: candidates,
    columns: [
      { accessorKey: "candidateRollNumber", header: "Roll No" },
      { accessorKey: "candidateName", header: "Candidate Name" },
      ...columns,
    ],
    globalFilterFn: "includes",
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    const fetchSessionsAndSemesters = async () => {
      try {
        const sessionResponse = await API.get("Sessions");
        setSessions(sessionResponse.data);
        const semesterResponse = await API.get("Semesters");
        setSemesters(semesterResponse.data);
      } catch (error) {
        console.error("Error fetching sessions or semesters:", error);
        setError("Failed to fetch sessions or semesters.");
      }
    };
    fetchSessionsAndSemesters();
  }, []);

  useEffect(() => {
    if (selectedFilters.semID) {
      const fetchPapers = async () => {
        try {
          const response = await API.get(`Papers/GetBySem/${selectedFilters.semID}`);
          console.log(response.data)
          setPapers(response.data);
        } catch (error) {
          console.error("Error fetching papers:", error);
          setError("Failed to fetch papers.");
        }
      };
      fetchPapers();
    } else {
      setPapers([]); // Clear papers if semester changes to an invalid state
    }
  }, [selectedFilters.semID]);

  const fetchCandidates = async (paperID) => {
    setLoading(true);
    setError(null);
    setCandidates([]); // Clear previous data while fetching new data
    try {
      const response = await API.get(`StudentsMarksObtaineds/GetStudentPaperMarks/${paperID}`);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">Marks Entry</h1>
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="flex flex-row gap-2 w-full">
          {/* Session Dropdown */}
          <select
            className="border rounded p-2 flex-1"
            onChange={(e) => setSelectedFilters({ ...selectedFilters, sesID: e.target.value })}
          >
            <option value="">Select Session</option>
            {sessions.map((session) => (
              <option key={session.sesID} value={session.sesID}>
                {session.sessionName}
              </option>
            ))}
          </select>

          {/* Semester Dropdown */}
          <select
            className="border rounded p-2 flex-1"
            onChange={(e) => setSelectedFilters({ ...selectedFilters, semID: e.target.value })}
            disabled={!selectedFilters.sesID}
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester.semID} value={semester.semID}>
                {semester.semesterName}
              </option>
            ))}
          </select>

          {/* Papers Dropdown */}
          <select
            className="border rounded p-2 flex-1"
            onChange={(e) => {
              const paperID = e.target.value;
              setSelectedFilters({ ...selectedFilters, paperID });
              if (paperID) fetchCandidates(paperID);
            }}
            disabled={!selectedFilters.semID}
          >
            <option value="">Select Paper</option>
            {papers.map((paper) => (
              <option key={paper.paperID} value={paper.paperID}>
                {paper.paperName}
              </option>
            ))}
          </select>
        </div>

        {/* Global Filter */}
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border rounded p-2 mb-4 md:mb-0 md:ml-4 w-full md:w-64"
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : candidates.length === 0 ? (
          <p>No candidates found for the selected paper.</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border border-gray-300 p-2">
                      {header.column.columnDef.header}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border border-gray-300 p-2">
                      {cell.getValue()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MarksEntry;
