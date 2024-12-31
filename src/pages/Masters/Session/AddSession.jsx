import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../services/api";
import { useThemeStore } from "../../../store/themeStore";

const AddSession = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState("");
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
          <table>
            <thead>
              <tr>
                <th className={textClass}>Session Name</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.sesID}>
                  <td className={textClass}>{session.sessionName}</td>
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
