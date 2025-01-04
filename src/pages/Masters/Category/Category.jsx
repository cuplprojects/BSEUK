import React, { useState, useEffect, useMemo } from "react";
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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useThemeStore((state) => state.theme);

  // Theme classes
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-blue-200 shadow-xl border';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&:not(:disabled)]:hover:bg-purple-900/30 [&>option]:bg-purple-900 [&>option]:text-purple-100'
    : 'bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&:not(:disabled)]:hover:bg-blue-100 [&>option]:bg-white [&>option]:text-blue-600';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  const cancelButtonClass = theme === 'dark'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-red-500 hover:bg-red-600 text-white';

  const tableHeaderClass = theme === 'dark'
    ? 'bg-purple-900/50 text-purple-100'
    : 'bg-blue-50 text-blue-700';

  const tableCellClass = theme === 'dark'
    ? 'border-purple-500/20 hover:bg-purple-900/30'
    : 'border-blue-200 hover:bg-blue-50';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get("/Categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.warning("Please enter a category name", {
        autoClose: 2000
      });
      return;
    }

    try {
      await API.post("/Categories", {
        categoryName: newCategoryName
      });
      toast.success("Category added successfully", {
        autoClose: 2000
      });
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleSaveEdit = async (catID, categoryName) => {
    if (!categoryName.trim()) {
      toast.warning("Category name cannot be empty", {
        autoClose: 2000
      });
      return;
    }

    try {
      await API.put(`/Categories/${catID}`, {
        catID,
        categoryName,
      });
      setCategories(
        categories.map((category) =>
          category.catID === catID ? { ...category, categoryName } : category
        )
      );
      setEditingCategoryId(null);
      toast.success("Category updated", {
        autoClose: 2000
      });
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
  };

  const columns = useMemo(() => [
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
      accessorKey: "categoryName",
      header: "Category Name",
      enableSorting: true,
      cell: ({ row }) => {
        const category = row.original;
        if (editingCategoryId === category.catID) {
          return (
            <div className="flex-1">
              <input
                autoFocus
                type="text"
                value={editedValue}
                className={`w-full rounded-lg px-3 py-1 ${inputClass}`}
                onChange={(e) => setEditedValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleCancelEdit();
                  } else if (e.key === 'Enter' && editedValue !== category.categoryName) {
                    handleSaveEdit(category.catID, editedValue);
                  }
                }}
              />
            </div>
          );
        }
        return (
          <div className="flex-1">
            <span className={textClass}>{category.categoryName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="w-48">
            {editingCategoryId === category.catID ? (
              <div className="flex gap-2">
                {editedValue !== category.categoryName && (
                  <button 
                    onClick={() => handleSaveEdit(category.catID, editedValue)}
                    className={`px-3 py-1 rounded-lg text-sm ${buttonClass}`}
                  >
                    Save
                  </button>
                )}
                <button 
                  onClick={handleCancelEdit}
                  className={`px-3 py-1 rounded-lg text-sm ${cancelButtonClass}`}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setEditingCategoryId(category.catID);
                  setEditedValue(category.categoryName);
                }}
                className={`px-3 py-1 rounded-lg text-sm ${buttonClass}`}
              >
                Edit
              </button>
            )}
          </div>
        );
      },
    },
  ], [editingCategoryId, editedValue, buttonClass, cancelButtonClass, inputClass, textClass]);

  const table = useReactTable({
    data: categories,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
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
        theme={theme === 'dark' ? 'dark' : 'light'}
      />

      <h1 className={`text-3xl font-bold mb-6 ${textClass}`}>Categories</h1>
      
      {/* Add Category Form */}
      <div className={`mb-6 p-4 rounded-lg ${cardClass}`}>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter new category name"
            className={`flex-grow rounded-lg px-4 py-2 ${inputClass}`}
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${buttonClass}`}
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Search and Rows per page */}
      {categories.length > 0 && (
        <div className={`mb-6 p-4 rounded-lg ${cardClass}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Box */}
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
              onChange={e => {
                const newSize = Number(e.target.value);
                setRowsPerPage(newSize);
                table.setPageSize(newSize);
              }}
              className={`w-full sm:w-48 rounded-lg px-4 py-2 ${inputClass}`}
            >
              {[10, 20, 30, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Categories Table */}
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
                      className={`p-4 text-left font-semibold ${
                        header.id.includes('srNo') 
                          ? 'w-24' 
                          : header.id.includes('actions')
                            ? 'w-48'
                            : 'flex-1'
                      } ${tableCellClass} ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="ml-2">
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted()] ?? ''}
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
                  className={`${tableCellClass} ${
                    index % 2 === 0 
                      ? theme === 'dark' 
                        ? 'bg-purple-900/20' 
                        : 'bg-blue-50/50'
                      : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      className={`p-4 ${
                        cell.column.id.includes('srNo')
                          ? 'w-24'
                          : cell.column.id.includes('actions')
                            ? 'w-48'
                            : 'flex-1'
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
            <span className={`flex items-center gap-1 ${textClass}`}>
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Categories;