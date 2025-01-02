import React, { useState, useEffect, useMemo } from "react";
import API from "../../../services/api";
import { useThemeStore } from "../../../store/themeStore";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await API.get("/Groups");
      setGroups(response.data);
    };
    fetchGroups();
  }, []);

  const handleEditGroup = (group) => {
    setEditingGroupId(group.groupID);
  };

  const handleSaveEdit = async (groupId, groupName) => {
    await API.put(`/Groups/${groupId}`, {
      groupID: groupId,
      groupName,
    });
    setGroups(
      groups.map((group) =>
        group.groupID === groupId ? { ...group, groupName } : group
      )
    );
    setEditingGroupId(null);
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
  };

  const columns = useMemo(() => [
    {
      accessorKey: "srNo",
      header: "Sr.No.",
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "groupName",
      header: "Group Name",
      cell: ({ row }) => {
        const group = row.original;
        if (editingGroupId === group.groupID) {
          return (
            <EditableCell
              initialValue={group.groupName}
              onSave={(value) => handleSaveEdit(group.groupID, value)}
              onCancel={handleCancelEdit}
              theme={theme}
            />
          );
        }
        return <span>{group.groupName}</span>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const group = row.original;
        return editingGroupId === group.groupID ? (
          <button onClick={handleCancelEdit}>Cancel</button>
        ) : (
          <button onClick={() => handleEditGroup(group)}>Edit</button>
        );
      },
    },
  ], [editingGroupId, theme, groups]);

  const table = useReactTable({
    data: groups,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Groups</h1>
      <table className="min-w-full mt-4">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border-b p-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EditableCell = ({ initialValue, onSave, onCancel, theme }) => {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
  };

  return (
    <div>
      <input
      autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`border ${
          theme === "dark" ? "border-gray-600" : "border-gray-300"
        } rounded-lg p-2`}
      />
      <button onClick={handleSave} className="ml-2 text-blue-500">
        Save
      </button>
      <button onClick={onCancel} className="ml-2 text-red-500">
        Cancel
      </button>
    </div>
  );
};

export default Groups;
