import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import {
  useReactTable,
  getCoreRowModel,
  selectRowsFn,
} from "@tanstack/react-table";

const MarksEntry = () => {
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    sesID: "",
    semID: "",
    paperID: "",
  });
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columns, setColumns] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [updatedMarks, setUpdatedMarks] = useState({});
  const inputRef = useRef(null);

  // Table Columns
  const getColumns = async (paperID) => {
    if (candidates.length === 0) return []; // No candidates, return empty columns

    const response = await API.get(`/Papers/${paperID}`);
    const paperType = response.data.paperType;

    if (paperType === 1) {
      return [
        {
          accessorFn: (row) => row?.marks?.theoryPaperMarks || "",
          id: "theoryMarks",
          header: "Theory Marks",
        },
        {
          accessorFn: (row) => row?.marks?.interalMarks || "",
          id: "internalMarks",
          header: "Internal Marks",
        },
      ];
    } else {
      return [
        {
          accessorFn: (row) => row?.marks?.practicalMarks || "",
          id: "practicalMarks",
          header: "Practical Marks",
        },
      ];
    }

    return []; // Default case if paperType is neither 1 nor 2
  };

  useEffect(() => {
    const fetchColumns = async () => {
      const cols = await getColumns(selectedFilters.paperID);
      setColumns(cols);
    };

    fetchColumns();
  }, [candidates, selectedFilters.paperID]);

  const table = useReactTable({
    data: candidates,
    columns: [
      { accessorKey: "candidateID", header: "CandidateID"},
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
          const response = await API.get(
            `Papers/GetBySem/${selectedFilters.semID}`
          );
          setPapers(response.data);
          setUpdatedMarks({}); // Reset updatedMarks when semester changes
        } catch (error) {
          console.error("Error fetching papers:", error);
          setError("Failed to fetch papers.");
        }
      };
      fetchPapers();
    } else {
      setPapers([]); // Clear papers if semester changes to an invalid state
      setUpdatedMarks({}); // Reset updatedMarks when semester changes
    }
  }, [selectedFilters.semID]);

  const fetchCandidates = async (paperID) => {
    setLoading(true);
    setError(null);
    setCandidates([]); // Clear previous data while fetching new data
    try {
      const response = await API.get(
        `StudentsMarksObtaineds/GetStudentPaperMarks/${paperID}`
      );
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (rowId, columnId) => {
    if (editingCell?.rowId === rowId && editingCell?.columnId === columnId) {
      setEditingCell(null); // Exit editing mode if clicking the same cell
    } else {
      setEditingCell({ rowId, columnId });
      setTimeout(() => {
        inputRef.current?.select(); // Select the input content after rendering
      }, 0);
    }
  };

  const handleInputChange = (e, rowId, columnId, candidateId) => {
    setUpdatedMarks({
      ...updatedMarks,
      [rowId]: {
        ...updatedMarks[rowId],
        [columnId]: e.target.value,
        candidateId: candidateId,
      },
    });
  };

  const handleSubmit = async () => {
    const marksToSubmit = Object.keys(updatedMarks).map((rowId) => {
      const { candidateId, theoryMarks, internalMarks, practicalMarks } = updatedMarks[rowId];
      const candidateData = candidates.find((candidate) => candidate.candidateID === candidateId);
      if (!candidateData) return null;
    
      return {
        smoID: candidateData.smoID || 0, // Adjust based on your backend structure
        candidateID: candidateData.candidateID,
        paperID: selectedFilters.paperID,
        theoryPaperMarks: theoryMarks || 0,
        interalMarks: internalMarks || 0,
        practicalMarks: practicalMarks || 0,
      };
    }).filter(Boolean);
    
   
    
    try {
      for (const mark of marksToSubmit) {
        await API.post('/StudentsMarksObtaineds', mark);
      }
      alert("Marks updated successfully!");
      // Optionally refetch candidates to reflect changes
      fetchCandidates(selectedFilters.paperID);
    } catch (error) {
      console.error("Error updating marks:", error);
      setError("Failed to update marks.");
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
            onChange={(e) =>
              setSelectedFilters({ ...selectedFilters, sesID: e.target.value })
            }
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
            onChange={(e) =>
              setSelectedFilters({ ...selectedFilters, semID: e.target.value })
            }
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
              setUpdatedMarks({}); // Reset updatedMarks when paper changes
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
          <>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border border-gray-300 p-2"
                      >
                        {header.column.columnDef.header}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-gray-100">
                    {row.getVisibleCells().map((cell) => {
                      const isEditing =
                        editingCell?.rowId === row.id &&
                        editingCell?.columnId === cell.column.id;
                      const isNonEditable = cell.column.id === "candidateRollNumber" || cell.column.id === "candidateName"; // Check for non-editable columns
                      return (
                        <td
                          key={cell.id}
                          className="border border-gray-300 p-2"
                          onClick={() => !isNonEditable && handleCellClick(row.id, cell.column.id)} // Only allow click if not non-editable
                        >
                          {isEditing && !isNonEditable ? ( // Render input only if not non-editable
                            <input
                              ref={inputRef}
                              type="text"
                              value={
                                updatedMarks[row.id]?.[cell.column.id] ||
                                cell.getValue()
                              }
                              onChange={(e) =>
                                handleInputChange(e, row.id, cell.column.id, row.original.candidateID)
                              }
                              className="border rounded p-1"
                              onBlur={() => setEditingCell(null)}
                            />
                          ) : (
                            updatedMarks[row.id]?.[cell.column.id] ||
                            cell.getValue()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MarksEntry;
