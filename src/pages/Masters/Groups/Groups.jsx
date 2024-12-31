import React, { useState, useEffect } from "react";
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
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editedGroupName, setEditedGroupName] = useState("");
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await API.get("/Groups");
      setGroups(response.data);
    };
    fetchGroups();
  }, []);

  const handleAddGroup = async () => {
    const response = await API.post("/Groups", {
      groupID: 0,
      groupName: newGroupName,
    });
    setGroups([...groups, response.data]);
    setNewGroupName("");
  };

  const handleEditGroup = (group) => {
    setEditingGroupId(group.groupID);
    setEditedGroupName(group.groupName);
  };

  const handleSaveEdit = async (group) => {
    await API.put(`/Groups/${group.groupID}`, {
      groupID: group.groupID,
      groupName: editedGroupName,
    });
    setGroups(
      groups.map((g) =>
        g.groupID === group.groupID ? { ...g, groupName: editedGroupName } : g
      )
    );
    setEditingGroupId(null);
    setEditedGroupName("");
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditedGroupName("");
  };

  const columns = [
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
        return editingGroupId === group.groupID ? (
          <input
            type="text"
            value={editedGroupName}
            onChange={(e) => setEditedGroupName(e.target.value)}
            className={`border ${
              theme === "dark" ? "border-gray-600" : "border-gray-300"
            } rounded-lg p-2`}
          />
        ) : (
          <span>{group.groupName}</span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const group = row.original;
        return editingGroupId === group.groupID ? (
          <>
            <button onClick={() => handleSaveEdit(group)}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <button onClick={() => handleEditGroup(group)}>Edit</button>
        );
      },
    },
  ];

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
      <input
        type="text"
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
        placeholder="New Group Name"
        className={`border ${
          theme === "dark" ? "border-gray-600" : "border-gray-300"
        } rounded-lg p-2 mb-4`}
      />
      <button onClick={handleAddGroup} className="bg-blue-500 text-white p-2 rounded-lg">
        Add Group
      </button>
      <table className="min-w-full mt-4">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border-b p-2">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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

export default Groups;
