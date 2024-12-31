import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../services/api";
import { useThemeStore } from "../../../store/themeStore";

const AddSession = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState("");
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editedSessionName, setEditedSessionName] = useState("");
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Fetch existing sessions from the API
    const fetchSessions = async () => {
      const response = await API.get("/Sessions");
      console.log(response.data); // Update with your API endpoint
      setSessions(response.data);
    };
    fetchSessions();
  }, []);

  const handleAddSession = async () => {
    // Add new session to the API
    await API.post("/Sessions", { sesID: 0, sessionName: newSession }); // Update with your API endpoint
    setNewSession("");
    // Optionally, refetch sessions after adding
    const response = await API.get("/Sessions");
    setSessions(response.data);
  };

  const handleEditClick = (session) => {
    setEditingSessionId(session.sesID);
    setEditedSessionName(session.sessionName);
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditedSessionName("");
  };

  const handleSaveEdit = async (session) => {
    await API.put(`Sessions/${session.sesID}`, {
      sesID: session.sesID,
      sessionName: editedSessionName,
    });
    setEditingSessionId(null);
    setEditedSessionName("");
    const response = await API.get("/Sessions");
    setSessions(response.data);
  };

  const cardClass =
    theme === "dark"
      ? "bg-black/40 backdrop-blur-xl border-purple-500/20"
      : "bg-white border-blue-200 shadow-sm";

  const textClass = theme === "dark" ? "text-purple-100" : "text-blue-700";

  const inputClass =
    theme === "dark"
      ? "bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&>option]:bg-purple-900 [&>option]:text-purple-100"
      : "bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&>option]:bg-white [&>option]:text-blue-600";

  return (
    <div>
      <div className={cardClass}>
        <div className="flex-1 border border-gray-300 rounded-lg m-2 p-4">
          <h2 className={`text-lg font-bold ${textClass}`}>Add New Session</h2>
          <div className="flex flex-col">
            <input
              type="text"
              value={newSession}
              onChange={(e) => setNewSession(e.target.value)}
              placeholder="Add new session"
              className={`border ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } rounded-lg p-2 ${inputClass}`}
            />
            <button
              onClick={handleAddSession}
              className={`mt-2 p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-purple-600 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              Add Session
            </button>
          </div>
        </div>
        <div className="flex-1 border border-gray-300 rounded-lg m-2 p-4">
          <h2 className={`text-lg font-bold ${textClass}`}>
            Existing Sessions
          </h2>
          <table className={`w-full border-collapse ${
            theme === "dark" ? "border border-gray-600" : "border border-gray-300"
          }`}>
            <thead>
              <tr>
                <th className={`p-2 ${
                  theme === "dark" ? "border-b border-gray-600" : "border-b border-gray-300"
                } ${textClass}`}>Session Names</th>
                <th className={`p-2 ${
                  theme === "dark" ? "border-b border-gray-600" : "border-b border-gray-300"
                } ${textClass}`}>Actions Column</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.sesID} className={`${
                  theme === "dark" ? "border-b border-gray-600" : "border-b border-gray-300"
                }`}>
                  <td className="p-2">
                    {editingSessionId === session.sesID ? (
                      <input
                        type="text"
                        value={editedSessionName}
                        onChange={(e) => setEditedSessionName(e.target.value)}
                        className={`border ${
                          theme === "dark"
                            ? "border-gray-600"
                            : "border-gray-300"
                        } rounded-lg p-2 ${inputClass}`}
                      />
                    ) : (
                      <span className={textClass}>{session.sessionName}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {editingSessionId === session.sesID ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(session)}
                          className={`mt-2 p-2 rounded-lg ${
                            theme === "dark"
                              ? "bg-purple-600 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={`mt-2 p-2 rounded-lg ${
                            theme === "dark"
                              ? "bg-gray-600 text-white"
                              : "bg-gray-300 text-black"
                          } ml-2`}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditClick(session)}
                        className={`mt-2 p-2 rounded-lg ${
                          theme === "dark"
                            ? "bg-purple-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddSession;
