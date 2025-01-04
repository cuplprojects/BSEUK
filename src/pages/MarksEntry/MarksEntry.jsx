import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
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
  const [sorting, setSorting] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const inputRef = useRef(null);
  const [paper,setPaper] = useState({});
  const [inputValue, setInputValue] = useState('');

  // Table Columns
  const getColumns = async (paperID) => {
    if (candidates.length === 0) return [];

    const response = await API.get(`/Papers/${paperID}`);

    setPaper(response.data);

    const paperType = response.data.paperType;

    if (paperType === 1) {
      return [
        {
          accessorFn: (row) => row?.marks?.theoryPaperMarks || "",
          id: "theoryMarks",
          header: `Theory Marks (Max: ${response.data.theoryPaperMaxMarks})`,
          enableSorting: true,
        },
        {
          accessorFn: (row) => row?.marks?.interalMarks || "",
          id: "internalMarks",
          header: `Internal Marks (Max: ${response.data.interalMaxMarks})`,
          enableSorting: true,
        },
      ];
    } else {
      return [
        {
          accessorFn: (row) => row?.marks?.practicalMarks || "",
          id: "practicalMarks",
          header: `Practical Marks (Max: ${response.data.practicalMaxMarks})`,
          enableSorting: true,
        },
      ];
    }

    return [];
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
      {
        accessorKey: "candidateID",
        header: "CandidateID",
        enableSorting: true,
      },
      {
        accessorKey: "candidateRollNumber",
        header: "Roll No",
        enableSorting: true,
      },
      {
        accessorKey: "candidateName",
        header: "Candidate Name",
        enableSorting: true,
      },
      ...columns,
    ],
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: rowsPerPage,
      },
    },
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
          setUpdatedMarks({});
        } catch (error) {
          console.error("Error fetching papers:", error);
          setError("Failed to fetch papers.");
        }
      };
      fetchPapers();
    } else {
      setPapers([]);
      setUpdatedMarks({});
    }
  }, [selectedFilters.semID]);

  const fetchCandidates = async (paperID) => {
    setLoading(true);
    setError(null);
    setCandidates([]);
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
      setEditingCell(null);
    } else {
      setEditingCell({ rowId, columnId });
      // Get current value from updatedMarks
      const currentValue = updatedMarks[rowId]?.[columnId] || '';
      setInputValue(currentValue);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  };

  const handleInputChange = (e, rowId, columnId, candidateId) => {

    const value = e.target.value;
    setInputValue(value);
  
    // Ensure only numeric values are allowed
    if (!/^\d*$/.test(value)) return;
  
    // Rest of validation logic remains same
    const maxMarks = columnId === "theoryMarks" 
      ? paper.theoryPaperMaxMarks
      : columnId === "internalMarks"
      ? paper.interalMaxMarks
      : columnId === "practicalMarks"
      ? paper.practicalMaxMarks
      : null;
  
    if (maxMarks !== null && Number(value) > maxMarks) {
      alert(`Value cannot exceed the maximum marks of ${maxMarks}.`);
      return;
    }

    setUpdatedMarks({
      ...updatedMarks,
      [rowId]: {
        ...updatedMarks[rowId],
        [columnId]: value,
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
        smoID: candidateData.smoID || 0,
        candidateID: candidateData.candidateID,
        paperID: selectedFilters.paperID,
        theoryPaperMarks: theoryMarks !== undefined ? theoryMarks : candidateData.marks?.theoryPaperMarks || 0,
        interalMarks: internalMarks !== undefined ? internalMarks : candidateData.marks?.interalMarks || 0,
        practicalMarks: practicalMarks !== undefined ? practicalMarks : candidateData.marks?.practicalMarks || 0,
      };
    }).filter(Boolean);

    try {
      for (const mark of marksToSubmit) {
        await API.post('/StudentsMarksObtaineds', mark);
      }
      alert("Marks updated successfully!");
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
              setUpdatedMarks({});
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

        <div className="flex gap-2">
          {/* Rows per page selector */}
          <select
            value={rowsPerPage}
            onChange={e => {
              const newSize = Number(e.target.value);
              setRowsPerPage(newSize);
              table.setPageSize(newSize);
            }}
            className="border rounded p-2"
          >
            {[10, 20, 30, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>

          {/* Global Filter */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="border rounded p-2 w-64 pr-8"  // Added pr-8 for padding-right
            />
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
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
                        className="border border-gray-300 p-2 cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() && (
                            <span>
                              {header.column.getIsSorted() === "asc" ? " ↑" : " ↓"}
                            </span>
                          )}
                        </div>
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
                      const isNonEditable =
                        cell.column.id === "candidateRollNumber" ||
                        cell.column.id === "candidateName" ||
                        cell.column.id === "candidateID";
                      return (
                        <td
                          key={cell.id}
                          className="border border-gray-300 p-2"
                          onClick={() => !isNonEditable && handleCellClick(row.id, cell.column.id)}
                        >
                          {isEditing && !isNonEditable ? (
                            <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) =>
                              handleInputChange(e, row.id, cell.column.id, row.original.candidateID)
                            }
                            className="border rounded p-1"
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              // Allow only numeric keys, backspace, delete, arrow keys
                              if (
                                !/[0-9]/.test(e.key) &&
                                !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
                              ) {
                                e.preventDefault();
                              }
                            }}
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  {"<"}
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  {">"}
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  {">>"}
                </button>
              </div>
              <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </span>
            </div>

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