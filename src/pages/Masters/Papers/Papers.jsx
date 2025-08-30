import React, { useEffect, useMemo, useRef, useState } from "react";
import API from "../../../services/api";
import { useThemeStore } from "../../../store/themeStore";
import { motion } from "framer-motion";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Type helpers
const toInt = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v));

const Papers = () => {
    const theme = useThemeStore((state) => state.theme);

    // Theme classes (aligned with Institution.jsx)
    const cardClass = theme === "dark"
        ? "bg-black/40 backdrop-blur-xl border-purple-500/20"
        : "bg-white border-blue-200 shadow-xl border";

    const textClass = theme === "dark" ? "text-purple-100" : "text-blue-700";

    const inputClass = theme === "dark"
        ? "bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&:not(:disabled)]:hover:bg-purple-900/30 [&>option]:bg-purple-900 [&>option]:text-purple-100"
        : "bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&:not(:disabled)]:hover:bg-blue-100 [&>option]:bg-white [&>option]:text-blue-600";

    const buttonClass = theme === "dark"
        ? "bg-purple-600 hover:bg-purple-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white";

    const cancelButtonClass = theme === "dark"
        ? "bg-red-600 hover:bg-red-700 text-white"
        : "bg-red-500 hover:bg-red-600 text-white";

    const tableHeaderClass = theme === "dark"
        ? "bg-purple-900/50 text-purple-100"
        : "bg-blue-50 text-blue-700";

    const tableCellClass = theme === "dark"
        ? "border-purple-500/20 hover:bg-purple-900/30"
        : "border-blue-200 hover:bg-blue-50";

    // Data state
    const [papers, setPapers] = useState([]);

    // Form state for new paper
    const [form, setForm] = useState({
        paperName: "",
        paperCode: 0,
        paperType: 0,
        theoryPaperMaxMarks: 0,
        interalMaxMarks: 0,
        practicalMaxMarks: 0,
        semID: 0,
        totalMaxMarks: 0,
    });

    // Semesters from API
    const [semesters, setSemesters] = useState([]);

    // Table state
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const editFormRef = useRef(null);
    const [editForm, setEditForm] = useState(null);

    // Paper Types state
    const [paperTypes, setPaperTypes] = useState([]);


    useEffect(() => {
        fetchPapers();
        fetchSemesters();
        fetchPaperTypes();
    }, []);

    const fetchPapers = async () => {
        try {
            const res = await API.get("/Papers");
            setPapers(res.data || []);
        } catch (err) {
            toast.error("Failed to load papers");
        }
    };

    const fetchSemesters = async () => {
        try {
            const res = await API.get("/Semesters");
            setSemesters(res.data || []);
        } catch (err) {
            toast.error("Failed to load semesters");
        }
    };

    const fetchPaperTypes = async () => {
        try {
            const res = await API.get("/PaperTypes");
            setPaperTypes(res.data || []);
        } catch (err) {
            toast.error("Failed to load paper types");
        }
    };

    // When semesters load, set default in form if needed
    useEffect(() => {
        if (semesters && semesters.length > 0) {
            setForm((prev) => {
                const exists = semesters.some((s) => s.semID === Number(prev.semID));
                return exists ? prev : { ...prev, semID: semesters[0].semID };
            });
        }
    }, [semesters]);

    // Helpers to keep totalMaxMarks in sync
    const computeTotal = (theory, internal, practical) => {
        return toInt(theory) + toInt(internal) + toInt(practical);
    };

    const updateForm = (key, value) => {
        const next = { ...form, [key]: value };
        if (
            ["theoryPaperMaxMarks", "interalMaxMarks", "practicalMaxMarks"].includes(key)
        ) {
            next.totalMaxMarks = computeTotal(
                next.theoryPaperMaxMarks,
                next.interalMaxMarks,
                next.practicalMaxMarks
            );
        }
        setForm(next);
    };

    const updateEditForm = (key, value) => {
        const source = editFormRef.current ?? editForm ?? {};
        const next = { ...source, [key]: value };
        if (
            ["theoryPaperMaxMarks", "interalMaxMarks", "practicalMaxMarks"].includes(key)
        ) {
            next.totalMaxMarks = computeTotal(
                next.theoryPaperMaxMarks,
                next.interalMaxMarks,
                next.practicalMaxMarks
            );
        }
        editFormRef.current = next; // keep ref in sync to avoid unmounting inputs
        setEditForm(next);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.paperName?.trim()) {
            toast.warning("Please enter a paper name", { autoClose: 2000 });
            return;
        }

        const payload = {
            paperName: form.paperName,
            paperCode: toInt(form.paperCode),
            paperType: toInt(form.paperType),
            theoryPaperMaxMarks: toInt(form.theoryPaperMaxMarks),
            interalMaxMarks: toInt(form.interalMaxMarks),
            practicalMaxMarks: toInt(form.practicalMaxMarks),
            semID: toInt(form.semID),
            totalMaxMarks: toInt(
                computeTotal(form.theoryPaperMaxMarks, form.interalMaxMarks, form.practicalMaxMarks)
            ),
        };

        try {
            await API.post("/Papers", payload);
            toast.success("Paper added successfully", { autoClose: 2000 });
            setForm({
                paperName: "",
                paperCode: 0,
                paperType: 0,
                theoryPaperMaxMarks: 0,
                interalMaxMarks: 0,
                practicalMaxMarks: 0,
                semID: 0,
                totalMaxMarks: 0,
            });
            fetchPapers();
        } catch (err) {
            toast.error("Failed to add paper");
        }
    };

    const startEdit = (row) => {
        setEditingId(row.paperID);
        editFormRef.current = { ...row };
        setEditForm(editFormRef.current);
    };

    const cancelEdit = () => {
        setEditingId(null);
        editFormRef.current = null;
        setEditForm(null);
    };

    const saveEdit = async () => {
        const current = editFormRef.current ?? editForm;
        if (!current || !editingId) return;
        if (!current.paperName?.trim()) {
            toast.warning("Paper name cannot be empty", { autoClose: 2000 });
            return;
        }

        const payload = {
            paperID: editingId,
            paperName: current.paperName,
            paperCode: toInt(current.paperCode),
            paperType: toInt(current.paperType),
            theoryPaperMaxMarks: toInt(current.theoryPaperMaxMarks),
            interalMaxMarks: toInt(current.interalMaxMarks),
            practicalMaxMarks: toInt(current.practicalMaxMarks),
            semID: toInt(current.semID),
            totalMaxMarks: toInt(
                computeTotal(current.theoryPaperMaxMarks, current.interalMaxMarks, current.practicalMaxMarks)
            ),
        };

        try {
            await API.put(`/Papers/${editingId}`, payload);
            toast.success("Paper updated", { autoClose: 2000 });
            setEditingId(null);
            editFormRef.current = null;
            setEditForm(null);
            fetchPapers();
        } catch (err) {
            toast.error("Failed to update paper");
        }
    };

    // Columns
    const columns = useMemo(
        () => [
            {
                accessorKey: "srNo",
                header: "Sr.No.",
                enableSorting: false,
                cell: (info) => (
                    <div className="w-24">
                        <span className={textClass}>{info.row.index + 1}</span>
                    </div>
                ),
            },
            {
                accessorKey: "paperName",
                header: "Paper Name",
                cell: ({ row }) => {
                    const r = row.original;
                    if (editingId === r.paperID) {
                        const ef = editFormRef.current || {};
                        return (
                            <input
                                type="text"
                                value={ef.paperName ?? ""}
                                className={`w-full rounded-lg px-3 py-1 ${inputClass}`}
                                onChange={(e) => updateEditForm("paperName", e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") cancelEdit();
                                    else if (e.key === "Enter") saveEdit();
                                }}
                            />
                        );
                    }
                    return <span className={textClass}>{r.paperName}</span>;
                },
            },
            {
                accessorKey: "paperCode",
                header: "Code",
                cell: ({ row }) => {
                    const r = row.original;
                    if (editingId === r.paperID) {
                        const ef = editFormRef.current || {};
                        return (
                            <input
                                type="number"
                                value={ef.paperCode ?? ""}
                                className={`w-full rounded-lg px-3 py-1 ${inputClass}`}
                                onChange={(e) => updateEditForm("paperCode", e.target.value)}
                            />
                        );
                    }
                    return <span className={textClass}>{r.paperCode}</span>;
                },
            },
            {
                accessorKey: "paperType",
                header: "Type",
                cell: ({ row }) => {
                    const r = row.original;
                    if (editingId === r.paperID) {
                        const ef = editFormRef.current || {};
                        return (
                            <select
                                value={ef.paperType ?? 0}
                                className={`w-full rounded-lg px-3 py-1 ${inputClass}`}
                                onChange={(e) => updateEditForm("paperType", e.target.value)}
                            >
                                {paperTypes.map((pt) => (
                                    <option key={pt.paperTypeID} value={pt.paperTypeID}>
                                        {pt.paperTypee}
                                    </option>
                                ))}
                            </select>
                        );
                    }
                    // Display the paper type name instead of ID
                    const paperType = paperTypes.find((pt) => pt.paperTypeID === r.paperType);
                    return <span className={textClass}>{paperType ? paperType.paperTypee : r.paperType}</span>;
                },
            },

            {
                accessorKey: "theoryPaperMaxMarks",
                header: "Theory Max",
                cell: ({ row }) => {
                    const r = row.original;
                    if (editingId === r.paperID) {
                        const ef = editFormRef.current || {};
                        return (
                            <input
                                type="number"
                                value={ef.theoryPaperMaxMarks ?? ""}
                                className={`w-full rounded-lg px-3 py-1 ${inputClass}`}
                                onChange={(e) => updateEditForm("theoryPaperMaxMarks", e.target.value)}
                            />
                        );
                    }
                    return <span className={textClass}>{r.theoryPaperMaxMarks}</span>;
                },
            },
            {
                accessorKey: "interalMaxMarks",
                header: "Internal Max",
                cell: ({ row }) => {
                    const r = row.original;
                    if (editingId === r.paperID) {
                        const ef = editFormRef.current || {};
                        return (
                            <input
                                type="number"
                                value={ef.interalMaxMarks ?? ""}
                                className={`w-full rounded-lg px-3 py-1 ${inputClass}`}
                                onChange={(e) => updateEditForm("interalMaxMarks", e.target.value)}
                            />
                        );
                    }
                    return <span className={textClass}>{r.interalMaxMarks}</span>;
                },
            },
            {
                accessorKey: "practicalMaxMarks",
                header: "Practical Max",
                cell: ({ row }) => {
                    const r = row.original;
                    if (editingId === r.paperID) {
                        const ef = editFormRef.current || {};
                        return (
                            <input
                                type="number"
                                value={ef.practicalMaxMarks ?? ""}
                                className={`w-full rounded-lg px-3 py-1 ${inputClass}`}
                                onChange={(e) => updateEditForm("practicalMaxMarks", e.target.value)}
                            />
                        );
                    }
                    return <span className={textClass}>{r.practicalMaxMarks}</span>;
                },
            },
            {
                accessorKey: "semID",
                header: "Semester",
                cell: ({ row }) => {
                    const r = row.original;
                    if (editingId === r.paperID) {
                        const ef = editFormRef.current || {};
                        return (
                            <select
                                value={ef.semID ?? 0}
                                className={`w-full rounded-lg px-3 py-1 ${inputClass}`}
                                onChange={(e) => updateEditForm("semID", e.target.value)}
                            >
                                {semesters.map((s) => (
                                    <option key={s.semID} value={s.semID}>
                                        {s.semesterName}
                                    </option>
                                ))}
                            </select>
                        );
                    }
                    const sem = semesters.find((s) => s.semID === r.semID);
                    return <span className={textClass}>{sem ? sem.semesterName : r.semID}</span>;
                },
            },
            {
                accessorKey: "totalMaxMarks",
                header: "Total Max",
                cell: ({ row }) => {
                    const r = row.original;
                    return <span className={textClass}>{r.totalMaxMarks}</span>;
                },
            },
            {
                accessorKey: "actions",
                header: "Actions",
                enableSorting: false,
                cell: ({ row }) => {
                    const r = row.original;
                    const isEditing = editingId === r.paperID;
                    return (
                        <div className="w-56">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={saveEdit}
                                        className={`px-3 py-1 rounded-lg text-sm ${buttonClass}`}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className={`px-3 py-1 rounded-lg text-sm ${cancelButtonClass}`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => startEdit(r)}
                                    className={`px-3 py-1 rounded-lg text-sm ${buttonClass}`}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    );
                },
            },
        ],
        [editingId, inputClass, textClass, buttonClass, cancelButtonClass, semesters]
    );

    const table = useReactTable({
        data: papers,
        columns,
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

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === "dark" ? "dark" : "light"}
            />

            <h1 className={`text-3xl font-bold mb-6 ${textClass}`}>Papers</h1>

            {/* Add Paper Form */}
            <div className={`mb-6 p-4 rounded-lg ${cardClass}`}>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="paperName" className={`block mb-2 ${textClass}`}>Paper Name</label>
                        <input
                            type="text"
                            placeholder="Paper Name"
                            value={form.paperName}
                            onChange={(e) => updateForm("paperName", e.target.value)}
                            className={`rounded-lg px-4 py-2 ${inputClass}`}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="paperCode" className={`block mb-2 ${textClass}`}>Paper Code</label>
                        <input
                            type="number"
                            placeholder="Paper Code"
                            value={form.paperCode}
                            onChange={(e) => updateForm("paperCode", e.target.value)}
                            className={`rounded-lg px-4 py-2 ${inputClass}`}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="paperType" className={`block mb-2 ${textClass}`}>Paper Type</label>
                        <select
                            value={form.paperType}
                            onChange={(e) => updateForm("paperType", e.target.value)}
                            className={`rounded-lg px-4 py-2 ${inputClass}`}
                        >
                            {paperTypes.map((pt) => (
                                <option key={pt.paperTypeID} value={pt.paperTypeID}>
                                    {pt.paperTypee}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="semID" className={`block mb-2 ${textClass}`}>Semester</label>
                        <select
                            value={form.semID}
                            onChange={(e) => updateForm("semID", e.target.value)}
                            className={`rounded-lg px-4 py-2 ${inputClass}`}
                        >
                            {semesters.map((s) => (
                                <option key={s.semID} value={s.semID}>
                                    {s.semesterName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="theoryPaperMaxMarks" className={`block mb-2 ${textClass}`}>Theory Max Marks</label>
                        <input
                            type="number"
                            placeholder="Theory Max Marks"
                            value={form.theoryPaperMaxMarks}
                            onChange={(e) => updateForm("theoryPaperMaxMarks", e.target.value)}
                            className={`rounded-lg px-4 py-2 ${inputClass}`}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="interalMaxMarks" className={`block mb-2 ${textClass}`}>Internal Max Marks</label>
                        <input
                            type="number"
                            placeholder="Internal Max Marks"
                            value={form.interalMaxMarks}
                            onChange={(e) => updateForm("interalMaxMarks", e.target.value)}
                            className={`rounded-lg px-4 py-2 ${inputClass}`}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="practicalMaxMarks" className={`block mb-2 ${textClass}`}>Practical Max Marks</label>
                        <input
                            type="number"
                            placeholder="Practical Max Marks"
                            value={form.practicalMaxMarks}
                            onChange={(e) => updateForm("practicalMaxMarks", e.target.value)}
                            className={`rounded-lg px-4 py-2 ${inputClass}`}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="totalMaxMarks" className={`block mb-2 ${textClass}`}>Total Max Marks</label>
                        <input
                            type="number"
                            placeholder="Total Max (auto)"
                            value={computeTotal(form.theoryPaperMaxMarks, form.interalMaxMarks, form.practicalMaxMarks)}
                            readOnly
                            className={`rounded-lg px-4 py-2 ${inputClass}`}
                        />
                    </div>

                    <div className="md:col-span-2 lg:col-span-4 flex justify-end mt-4">
                        <button type="submit" className={`px-6 py-2 rounded-lg ${buttonClass}`}>
                            Add Paper
                        </button>
                    </div>
                </form>
            </div>

            {/* Search and Rows per page */}
            {papers.length > 0 && (
                <div className={`mb-6 p-4 rounded-lg ${cardClass}`}>
                    <div className="flex flex-col sm:flex-row gap-4">
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
                </div>
            )}

            {/* Papers Table */}
            <div className={`rounded-lg overflow-hidden ${cardClass}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className={tableHeaderClass}>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={`p-4 text-left font-semibold ${header.id.includes("srNo")
                                                ? "w-24"
                                                : header.id.includes("actions")
                                                    ? "w-56"
                                                    : "flex-1"
                                                } ${tableCellClass} ${header.column.getCanSort() ? "cursor-pointer" : ""}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <span className="ml-2">
                                                        {{
                                                            asc: " ↑",
                                                            desc: " ↓",
                                                        }[header.column.getIsSorted()] ?? ""}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`${tableCellClass} ${index % 2 === 0
                                        ? theme === "dark"
                                            ? "bg-purple-900/20"
                                            : "bg-blue-50/50"
                                        : ""
                                        }`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`p-4 ${cell.column.id.includes("srNo")
                                                ? "w-24"
                                                : cell.column.id.includes("actions")
                                                    ? "w-56"
                                                    : "flex-1"
                                                }`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
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
                        <div className={`text-sm ${textClass}`}>
                            Page <span>{table.getState().pagination.pageIndex + 1}</span> of {" "}
                            <span>{table.getPageCount()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Papers;