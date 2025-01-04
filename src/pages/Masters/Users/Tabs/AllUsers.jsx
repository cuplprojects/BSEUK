import React, { useState, useEffect, useMemo } from "react";
import API from "../../../../services/api";
import { useThemeStore } from "../../../../store/themeStore";
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
import { FiSearch, FiEdit2 } from "react-icons/fi";
import { Dialog } from "@headlessui/react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useThemeStore((state) => state.theme);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    roleID: 0
  });

  // Theme classes
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-blue-200 shadow-xl border';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&:not(:disabled)]:hover:bg-purple-900/30'
    : 'bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&:not(:disabled)]:hover:bg-blue-100';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  const tableHeaderClass = theme === 'dark'
    ? 'bg-purple-900/20 text-purple-100'
    : 'bg-blue-50 text-blue-700';

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/Users");
      console.log("API Response:", response.data);
      setUsers(response.data);
      console.log("Users state after setting:", users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await API.get("/Roles");
      setRoles(response.data);
    } catch (error) {
      toast.error("Failed to load roles");
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.roleID === roleId);
    return role ? role.roleName : 'Unknown Role';
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/Users/${editingUser.userID}`, {
        userID: editingUser.userID,
        name: editForm.name,
        email: editForm.email,
        roleID: parseInt(editForm.roleID)
      });
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      fetchUsers(); // Refresh the table
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "userID",
        header: () => "User ID",
      },
      {
        accessorKey: "name",
        header: () => "Username",
      },
      {
        accessorKey: "email",
        header: () => "Email",
      },
      {
        accessorKey: "roleID",
        header: () => "Role",
        cell: (info) => getRoleName(info.getValue()),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => {
              setEditingUser(row.original);
              setEditForm({
                name: row.original.name,
                email: row.original.email,
                roleID: row.original.roleID
              });
              setIsEditModalOpen(true);
            }}
            className={`p-2 rounded-lg ${buttonClass}`}
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
        ),
      },
    ],
    [roles, buttonClass]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageSize: rowsPerPage,
        pageIndex: 0,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  console.log({
    usersLength: users.length,
    tableRows: table.getRowModel().rows.length,
    rawUsers: users,
    tableData: table.getRowModel().rows,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />

      {/* Search and Rows Per Page */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="relative">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border focus:outline-none focus:ring-2 ${inputClass}`}
            placeholder="Search users..."
          />
          <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
        </div>

        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className={`px-4 py-2 rounded-lg border ${inputClass} ${
            theme === 'dark' 
              ? '[&>option]:bg-gray-800 [&>option]:text-purple-100' 
              : '[&>option]:bg-white [&>option]:text-blue-600'
          }`}
          style={{
            colorScheme: theme === 'dark' ? 'dark' : 'light'
          }}
        >
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
          <option value={30}>30 rows</option>
          <option value={40}>40 rows</option>
          <option value={50}>50 rows</option>
        </select>
      </div>

      {/* Table */}
      <div className={`rounded-lg overflow-hidden border ${cardClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={tableHeaderClass}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-6 py-3 text-left ${textClass}`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-2"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  } hover:bg-gray-100 dark:hover:bg-gray-800`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 ${textClass}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-purple-500/20">
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

      {/* Edit Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`mx-auto max-w-sm rounded-lg ${cardClass} p-6 w-full ${
            theme === 'dark' ? 'border border-purple-500/30' : ''
          }`}>
            <Dialog.Title className={`text-lg font-medium mb-4 ${textClass}`}>
              Edit User
            </Dialog.Title>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className={`block mb-2 ${textClass}`}>Username</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={`w-full ${inputClass} rounded-lg p-2`}
                  required
                />
              </div>
              <div>
                <label className={`block mb-2 ${textClass}`}>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className={`w-full ${inputClass} rounded-lg p-2`}
                  required
                />
              </div>
              <div>
                <label className={`block mb-2 ${textClass}`}>Role</label>
                <select
                  value={editForm.roleID}
                  onChange={(e) => setEditForm({ ...editForm, roleID: e.target.value })}
                  className={`w-full ${inputClass} rounded-lg p-2 `}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.roleID} value={role.roleID}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className={`px-4 py-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-purple-900/50 hover:bg-purple-900/70'
                      : 'bg-blue-100 hover:bg-blue-200'
                  } ${textClass}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${buttonClass}`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
};

export default AllUsers;