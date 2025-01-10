import React, { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { useThemeStore } from "../../store/themeStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "./ConfirmationModal";
import * as XLSX from 'xlsx';
import RemarkModal from './RemarkModal';
import { Pencil } from 'lucide-react';

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
  const [paper, setPaper] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQestion] = useState("");
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const theme = useThemeStore((state) => state.theme);

  const cardClass =
    theme === "dark"
      ? "bg-black/40 backdrop-blur-xl border-purple-500/20"
      : "bg-white border-blue-200 shadow-xl";

  const textClass = theme === "dark" ? "text-purple-100" : "text-blue-700";

  const inputClass =
    theme === "dark"
      ? "bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&>option]:bg-purple-900 [&>option]:text-purple-100"
      : "bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&>option]:bg-white [&>option]:text-blue-600";

  const buttonClass =
    theme === "dark"
      ? "bg-purple-600 hover:bg-purple-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  const tableHeaderClass =
    theme === "dark"
      ? "bg-purple-900/50 text-purple-100"
      : "bg-blue-50 text-blue-700";

  const tableCellClass =
    theme === "dark"
      ? "border-purple-500/20 hover:bg-purple-900/30"
      : "border-blue-200 hover:bg-blue-50";


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

  const handleMarksLock = () => {
    setQestion("Are you sure you want to lock the marks?");
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsModalOpen(false);
    try {
      const datatosend = {
        id: 0,
        semID: selectedFilters.semID,
        sesID: selectedFilters.sesID,
        isLocked: true,
      };
      const response = await API.post("/LockStatus", datatosend);
      toast.success("Marks locked successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      // {
      //   accessorKey: "candidateID",
      //   header: "CandidateID",
      //   enableSorting: true,
      // },
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
        toast.error("Failed to fetch sessions or semesters.");
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
          // toast.success("Papers loaded successfully!");
        } catch (error) {
          console.error("Error fetching papers:", error);
          toast.error("Failed to fetch papers.");
        }
      };
      fetchPapers();
    }
  }, [selectedFilters.semID]);

  useEffect(() => {
    fetchCandidates(selectedFilters.paperID);
  },[selectedFilters]);

  const fetchCandidates = async (paperID) => {
    setLoading(true);
    setError(null);
    setCandidates([]);
    try {
      const datatosend = {
        paperID: paperID,
        sesID: selectedFilters.sesID,
      }
      const response = await API.post(
        `StudentsMarksObtaineds/GetStudentPaperMarks`, datatosend
      );
      setCandidates(response.data);
      // toast.success(`${response.data.length} candidates loaded successfully!`);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      // toast.error("Failed to fetch candidates data.");
    } finally {
      setLoading(false);
    }
  };
  const findNextEditableCell = (
    table,
    currentRowIndex,
    currentColIndex,
    reverse = false
  ) => {
    const rows = table.getRowModel().rows;
    const columns = table.getAllColumns();

    // Skip non-editable columns (candidateID, candidateRollNumber, candidateName)
    const editableColIndices = columns
      .map((col, index) => ({ index, id: col.id }))
      .filter(
        (col) =>
          !["candidateID", "candidateRollNumber", "candidateName"].includes(
            col.id
          )
      )
      .map((col) => col.index);

    let nextRowIndex = currentRowIndex;
    let nextColIndex;

    if (reverse) {
      // Find the previous editable column index
      nextColIndex = editableColIndices
        .filter((index) => index < currentColIndex)
        .pop();

      // If we're at the first column, move to the previous row
      if (nextColIndex === undefined) {
        nextRowIndex--;
        // If we're at the first row, wrap to the last row
        if (nextRowIndex < 0) {
          nextRowIndex = rows.length - 1;
        }
        nextColIndex = editableColIndices[editableColIndices.length - 1];
      }
    } else {
      // Forward navigation (existing logic)
      nextColIndex = editableColIndices.find(
        (index) => index > currentColIndex
      );

      // If we're at the last column, move to the next row
      if (nextColIndex === undefined) {
        nextRowIndex++;
        // If we're at the last row, wrap to the first row
        if (nextRowIndex >= rows.length) {
          nextRowIndex = 0;
        }
        nextColIndex = editableColIndices[0];
      }
    }

    return {
      rowId: rows[nextRowIndex]?.id,
      columnId: columns[nextColIndex]?.id,
    };
  };

  const handleRemarkSubmit = (remarks) => {
    if (selectedCandidate) {
      setUpdatedMarks({
        ...updatedMarks,
        [selectedCandidate.rowId]: {
          ...updatedMarks[selectedCandidate.rowId],
          candidateId: selectedCandidate.candidateId,
          remark: remarks
        }
      });
    }
  };

  const handleKeyDown = (e, row, columnId, rowIndex, columnIndex) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const nextCell = findNextEditableCell(
        table,
        rowIndex,
        columnIndex,
        e.shiftKey
      );
      if (nextCell.rowId && nextCell.columnId) {
        setEditingCell(nextCell);
        setInputValue(updatedMarks[nextCell.rowId]?.[nextCell.columnId] || "");
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
          }
        }, 0);
      }
    } else if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handleCellClick = (rowId, columnId) => {
    if (editingCell?.rowId === rowId && editingCell?.columnId === columnId) {
      setEditingCell(null);
    } else {
      setEditingCell({ rowId, columnId });
      // Get current value from updatedMarks
      const currentValue = updatedMarks[rowId]?.[columnId] || "";
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
    if (!/^\d*$/.test(value)) {
      toast.warning("Please enter numbers only!");
      return;
    }

    const maxMarks =
      columnId === "theoryMarks"
        ? paper.theoryPaperMaxMarks
        : columnId === "internalMarks"
          ? paper.interalMaxMarks
          : columnId === "practicalMarks"
            ? paper.practicalMaxMarks
            : null;

    if (maxMarks !== null && Number(value) > maxMarks) {
      toast.error(`Marks cannot exceed the maximum marks of ${maxMarks}!`);
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
    if (Object.keys(updatedMarks).length === 0) {
      toast.info("No marks to update!");
      return;
    }

    const marksToSubmit = Object.keys(updatedMarks)
      .map((rowId) => {
        const { candidateId, theoryMarks, internalMarks, practicalMarks } =
          updatedMarks[rowId];
        const candidateData = candidates.find(
          (candidate) => candidate.candidateID === candidateId
        );
        if (!candidateData) return null;

        return {
          smoID: candidateData.smoID || 0,
          candidateID: candidateData.candidateID,
          paperID: selectedFilters.paperID,
          theoryPaperMarks:
            theoryMarks !== undefined
              ? theoryMarks
              : candidateData.marks?.theoryPaperMarks || 0,
          interalMarks:
            internalMarks !== undefined
              ? internalMarks
              : candidateData.marks?.interalMarks || 0,
          practicalMarks:
            practicalMarks !== undefined
              ? practicalMarks
              : candidateData.marks?.practicalMarks || 0,
          remark: updatedMarks[rowId]?.remark || candidateData.marks?.remark || ''
        };
      })
      .filter(Boolean);

    try {
      toast.promise(
        Promise.all(
          marksToSubmit.map((mark) => API.post("/StudentsMarksObtaineds", mark))
        ),
        {
          pending: "Updating marks...",
          success: "Marks updated successfully!",
          error: "Failed to update marks",
        }
      );

      fetchCandidates(selectedFilters.paperID);
    } catch (error) {
      console.error("Error updating marks:", error);
      toast.error("Failed to update marks.");
    }
  };

  useEffect(() => {
    console.log(updatedMarks)
  },[updatedMarks])

  const markAsAbsent = async (candidateID) => {
    try {
      const datatosend = {
        smoID: 0,
        candidateID: candidateID,
        paperID: selectedFilters.paperID,
        theoryPaperMarks: 0,
        interalMarks: 0,
        practicalMarks: 0,
        totalMarks: 0,
        isAbsent: true,
      };
      const response = await API.post(`/StudentsMarksObtaineds`, datatosend);
      toast.success("Candidate marked as absent successfully!");
      fetchCandidates(selectedFilters.paperID);
    } catch (error) {
      console.error("Error marking candidate as absent:", error);
      toast.error("Failed to mark candidate as absent.");
    }
  };

  const handleAudit = async () => {
    try {
      const datatosend = {
        semID: selectedFilters.semID,
        sesID: selectedFilters.sesID,
      };

      const response = await API.post("StudentsMarksObtaineds/Audit", datatosend);
      const auditData = response.data;

      // Transform the data for Excel - with null check and error handling
      const excelData = auditData.map(student => {
        if (!student || !student.rollNumber || !Array.isArray(student.missingPapers)) {
          return null;
        }

        // Create base object with roll number
        const rowData = {
          'Roll Number': student.rollNumber
        };

        // Safely add missing papers
        student.missingPapers.forEach((paper, index) => {
          if (paper) {
            rowData[`Missing Paper ${index + 1}`] = paper;
          }
        });

        return rowData;
      }).filter(Boolean); // Remove any null entries

      // Only proceed if we have data to export
      if (excelData.length === 0) {
        toast.info('No audit data to export');
        return;
      }

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Audit Report');

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const fileName = `audit_report_${date}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);

      toast.success('Audit report downloaded successfully!');
    } catch (error) {
      console.error('Error generating audit report:', error);
      toast.error('Failed to generate audit report');
    }
  };

  const markAsNotAbsent = async (candidateID) => {
    try {
      const datatosend = {
        smoID: 0,
        candidateID: candidateID,
        paperID: selectedFilters.paperID,
        theoryPaperMarks: 0,
        interalMarks: 0,
        practicalMarks: 0,
        totalMarks: 0,
        isAbsent: false,
      };
      const response = await API.post(`/StudentsMarksObtaineds`, datatosend);
      toast.success("Candidate marked as present successfully!");
      fetchCandidates(selectedFilters.paperID);
    } catch (error) {
      console.error("Error marking candidate as present:", error);
      toast.error("Failed to mark candidate as present.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-5 space-y-6"
    >
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
        theme={theme === "dark" ? "dark" : "light"}
      />
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${textClass}`}>Marks Entry</h1>
        {candidates.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleMarksLock}
              className={`text-wrap w-full sm:w-auto px-4 sm:px-6 py-2 h-auto min-h-[3rem] rounded-lg font-semibold transition-colors ${buttonClass}`}
            >
              <span className="block text-sm sm:text-base">
                Lock Marks for{' '}
                <span className="whitespace-nowrap">
                  {semesters[selectedFilters.semID]?.semesterName}
                </span>{' '}
                <span className="whitespace-nowrap">
                  {sessions[selectedFilters.sesID - 1]?.sessionName}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={handleAudit}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 h-auto min-h-[3rem] rounded-lg font-semibold transition-colors ${buttonClass}`}
            >
              Get Remaining Marks Entry Status
            </button>
          </div>
        )}
      </div>

      <div className={`p-6 rounded-lg ${cardClass}`}>
        <div className="flex flex-col space-y-4">
          {/* Dropdowns Row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Session Dropdown */}
            <select
              className={`w-full md:w-1/3 rounded-lg px-4 py-2 ${inputClass}`}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  sesID: e.target.value,
                })
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
              className={`w-full md:w-1/3 rounded-lg px-4 py-2 ${inputClass}`}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  semID: e.target.value,
                })
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
              className={`w-full md:w-1/3 rounded-lg px-4 py-2 ${inputClass}`}
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

          {/* Search and Rows per page - Only show when candidates exist */}
          {candidates.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Box - Full width on mobile, grows to fill space on desktop */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className={`w-full rounded-lg px-4 py-2 pr-10 ${inputClass}`}
                />
                {globalFilter && (
                  <button
                    onClick={() => setGlobalFilter("")}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${textClass} hover:opacity-75`}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Rows per page selector - Fixed width */}
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setRowsPerPage(newSize);
                  table.setPageSize(newSize);
                }}
                className={`w-full sm:w-48 rounded-lg px-4 py-2 ${inputClass}`}
              >
                {[10, 20, 30, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className={`rounded-lg overflow-hidden ${cardClass}`}>
        {loading ? (
          <div className={`p-4 text-center ${textClass}`}>Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : candidates.length === 0 ? (
          <div className={`p-4 text-center ${textClass}`}>
            No candidates found for the selected paper.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={tableHeaderClass}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`p-3 text-left font-semibold border ${tableCellClass} cursor-pointer`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() && (
                            <span className="ml-2">
                              {header.column.getIsSorted() === "asc"
                                ? " ↑"
                                : " ↓"}
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
                  <tr key={row.id} className={`border-b ${tableCellClass}`}>
                    {row.getVisibleCells().map((cell) => {
                      const isEditing =
                        editingCell?.rowId === row.id &&
                        editingCell?.columnId === cell.column.id;
                      const isNonEditable =
                        cell.column.id === "candidateRollNumber" ||
                        cell.column.id === "candidateName" ||
                        cell.column.id === "candidateID" ||
                        row.original.marks?.isAbsent;
                      return (
                        <td
                          key={cell.id}
                          className={`p-3 border ${tableCellClass} ${row.original.marks?.isAbsent
                            ? "opacity-50 pointer-events-none"
                            : ""
                            }`}
                          onClick={() =>
                            !isNonEditable &&
                            handleCellClick(row.id, cell.column.id)
                          }
                        >
                          {isEditing && !isNonEditable ? (
                            <input
                              ref={inputRef}
                              type="text"
                              value={inputValue}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  row.id,
                                  cell.column.id,
                                  row.original.candidateID
                                )
                              }
                              className={`w-full px-2 py-1 rounded ${inputClass}`}
                              onBlur={() => setEditingCell(null)}
                              onKeyDown={(e) =>
                                handleKeyDown(
                                  e,
                                  row,
                                  cell.column.id,
                                  table.getRowModel().rows.indexOf(row),
                                  row.getAllCells().indexOf(cell)
                                )
                              }
                            />
                          ) : (
                            <span className={textClass}>
                              {updatedMarks[row.id]?.[cell.column.id] ||
                                cell.getValue()}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className={`p-3 border ${tableCellClass}`}>
                      {row.original.marks?.isAbsent ? (
                        <button
                          onClick={() =>
                            markAsNotAbsent(row.original.candidateID)
                          }
                          className={`px-4 py-2 rounded ${buttonClass}`}
                        >
                          Mark Present
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedCandidate({
                                rowId: row.id,
                                candidateId: row.original.candidateID
                              });
                              setIsRemarkModalOpen(true);
                            }}
                            className={`p-2 rounded ${buttonClass}`}
                            title="Add Remarks"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => markAsAbsent(row.original.candidateID)}
                            className={`px-4 py-2 rounded ${buttonClass}`}
                          >
                            Mark Absent
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className={`px-3 py-1 rounded-lg transition-colors ${buttonClass} disabled:opacity-50`}
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className={`px-3 py-1 rounded-lg transition-colors ${buttonClass} disabled:opacity-50`}
                >
                  {"<"}
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className={`px-3 py-1 rounded-lg transition-colors ${buttonClass} disabled:opacity-50`}
                >
                  {">"}
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className={`px-3 py-1 rounded-lg transition-colors ${buttonClass} disabled:opacity-50`}
                >
                  {">>"}
                </button>
              </div>
              <span className={`flex items-center gap-1 ${textClass}`}>
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </span>
            </div>

            <div className="p-4">
              <button
                onClick={handleSubmit}
                className={`w-full px-6 py-2 rounded-lg transition-colors ${buttonClass}`}
              >
                Submit
              </button>
            </div>
          </div>
        )}
        <ConfirmationModal
          question={question}
          isOpen={isModalOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
        <RemarkModal
          isOpen={isRemarkModalOpen}
          onClose={() => {
            setIsRemarkModalOpen(false);
            setSelectedCandidate(null);
          }}
          onSubmit={handleRemarkSubmit}
          initialRemarks={selectedCandidate ? updatedMarks[selectedCandidate.rowId]?.remarks || '' : ''}
        />
      </div>
    </motion.div>
  );
};

export default MarksEntry;
