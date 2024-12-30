import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify"; // Ensure this line is present
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import axios

const AddCandidate = () => {
  const [formData, setFormData] = useState({
    candidateID: 0, // Added candidateID
    candidateName: "",
    group: "",
    rollNumber: "",
    fName: "",
    mName: "",
    dob: "",
    institutionName: "",
    semID: "",
    sesID: "",
    papersOpted: ""
  });

  const [semesters, setSemesters] = useState([]); // State to hold semesters
  const [sessions, setSessions] = useState([]); // State to hold sessions

  // Fetch semesters and sessions from the API
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await fetch("https://localhost:7133/api/Semesters");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSemesters(data); // Set the fetched semesters
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await fetch("https://localhost:7133/api/Sessions");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSessions(data); // Set the fetched sessions
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSemesters();
    fetchSessions(); // Call to fetch sessions
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7133/api/Candidates", {
        candidateID: formData.candidateID, // Include candidateID
        candidateName: formData.candidateName,
        group: formData.group,
        rollNumber: formData.rollNumber,
        fName: formData.fName,
        mName: formData.mName,
        dob: formData.dob,
        institutionName: formData.institutionName,
        semID: formData.semID,
        sesID: formData.sesID,
        papersOpted: formData.papersOpted
      });
      console.log("Success:", response.data);
      // Optionally reset the form or handle success
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Add Candidate
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Candidate Name
                </label>
                <input
                  type="text"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter candidate name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Group
                </label>
                <input
                  type="text"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter group"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter roll number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Father's Name
                </label>
                <input
                  type="text"
                  name="fName"
                  value={formData.fName}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter father's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mother's Name
                </label>
                <input
                  type="text"
                  name="mName"
                  value={formData.mName}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter mother's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Institution Name
                </label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter institution name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Semester
                </label>
                <select
                  name="semID"
                  value={formData.semID}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem.semID} value={sem.semID}>
                      {sem.semesterName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Session
                </label>
                <select
                  name="sesID"
                  value={formData.sesID}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Session</option>
                  {sessions.map((session) => (
                    <option key={session.sesID} value={session.sesID}>
                      {session.sessionName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Papers Opted
                </label>
                <input
                  type="text"
                  name="papersOpted"
                  value={formData.papersOpted}
                  onChange={handleChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter paper codes separated by commas"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out"
              >
                Add Candidate
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddCandidate;
