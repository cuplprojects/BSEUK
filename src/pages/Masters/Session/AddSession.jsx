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

  return (
    <div>
      <div
        className={`flex ${
          theme === "dark" ? "bg-black/40" : "bg-white"
        } p-4 rounded-lg`}
      >
        <div className="flex-1 border border-gray-300 rounded-lg m-2 p-4">
          <h2
            className={`text-lg font-bold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Existing Sessions
          </h2>
          <table>
            <thead>
              <tr>
                <th>Session Name</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.sesID}>
                  <td>{session.sessionName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-1 border border-gray-300 rounded-lg m-2 p-4">
          <h2
            className={`text-lg font-bold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Add New Session
          </h2>
          <input
            type="text"
            value={newSession}
            onChange={(e) => setNewSession(e.target.value)}
            placeholder="Add new session"
            className={`border ${
              theme === "dark" ? "border-gray-600" : "border-gray-300"
            } rounded-lg p-2`}
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
    </div>
  );
};

export default AddSession;
