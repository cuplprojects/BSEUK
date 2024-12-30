import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import API from './../../../services/api';

const NewFormComponent = () => {
  const [semesters, setSemesters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [file, setFile] = useState(null);

  const [candidates, setCandidates] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fieldHeaderMapping, setFieldHeaderMapping] = useState({}); // Store the selected headers for each field

  const candidateFields = [
    { key: "rollNumber", label: "Roll Number" },
    { key: "candidateName", label: "Candidate Name" },
    { key: "group", label: "Group" },
    { key: "fName", label: "Father's Name" },
    { key: "mName", label: "Mother's Name" },
    { key: "dob", label: "Date of Birth" },
    { key: "institutionName", label: "Institution Name" },
    { key: "category", label: "Category" },
  ];

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await API.get('Semesters');
        setSemesters(response.data);
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await API.get('Sessions');
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSemesters();
    fetchSessions();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    readExcelFile(selectedFile);
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      const headers = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0];

      setCandidates(jsonData);
      setHeaders(headers);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleHeaderChange = (fieldKey, selectedHeader) => {
    setFieldHeaderMapping((prev) => ({
      ...prev,
      [fieldKey]: selectedHeader,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
  
    try {
      const dataToSubmit = candidates.map((candidate) => {
        // Create a candidate object matching the required structure
        const candidateData = {
          candidateID: 0, // Default value
          semID: parseInt(selectedSemester, 10), // Ensure integer
          sesID: parseInt(selectedSession, 10), // Ensure integer
          candidateName: "",
          group: "",
          rollNumber: "", // Will be stringified
          fName: "",
          mName: "",
          dob: "", // Will be stringified
          institutionName: "",
          category: "",
        };
  
        // Populate fields based on the mapped headers
        candidateFields.forEach((field) => {
          const selectedHeader = fieldHeaderMapping[field.key];
          if (selectedHeader && candidate[selectedHeader] !== undefined) {
            candidateData[field.key] = candidate[selectedHeader];
          }
        });
  
        // Stringify rollNumber and dob
        candidateData.rollNumber = JSON.stringify(candidateData.rollNumber);
  
        return candidateData;
      });
  
      // Submit each candidate record
      for (const candidateData of dataToSubmit) {
        console.log(JSON.stringify(candidateData, null, 2)); // Log payload for debugging
  
        // Using the API service to post the candidate data
        const response = await API.post("Candidates", candidateData);
  
        if (response.status !== 200 && response.status !== 201) {
          console.error("Error details:", response.data);
          throw new Error(`Failed to submit: ${response.data.title || response.statusText}`);
        }
      }
  
      toast.success("Candidates submitted successfully!");
    } catch (error) {
      toast.error("Error submitting candidates: " + error.message);
    }
  };
  


  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
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
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
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
            Upload File
          </label>
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold">Field</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold">CSV Header</th>
              </tr>
            </thead>
            <tbody>
              {candidateFields.map((field) => (
                <tr key={field.key}>
                  <td className="border border-gray-300 px-4 py-2">{field.label}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
                      value={fieldHeaderMapping[field.key] || ''}
                      onChange={(e) => handleHeaderChange(field.key, e.target.value)}
                    >
                      <option value="">Select Header</option>
                      {headers.map((header, index) => (
                        <option key={index} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NewFormComponent;
