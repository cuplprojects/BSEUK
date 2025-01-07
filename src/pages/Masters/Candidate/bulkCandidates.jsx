import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import API from "./../../../services/api";
import { useThemeStore } from "../../../store/themeStore";
import { FaFileDownload } from "react-icons/fa";

const NewFormComponent = () => {
  const [semesters, setSemesters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [file, setFile] = useState(null);

  const [candidates, setCandidates] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fieldHeaderMapping, setFieldHeaderMapping] = useState({});

  const theme = useThemeStore((state) => state.theme);

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

  const tableHeaderClass = theme === 'dark'
    ? 'bg-purple-900/50 text-purple-100'
    : 'bg-blue-600 text-white';

  const tableCellClass = theme === 'dark'
    ? 'border-purple-500/20'
    : 'border-blue-200';

  const candidateFields = [
    { key: "rollNumber", label: "Roll Number" },
    { key: "candidateName", label: "Candidate Name" },
    { key: "group", label: "Group" },
    { key: "fName", label: "Father's Name" },
    { key: "mName", label: "Mother's Name" },
    { key: "dob", label: "Date of Birth" },
    { key: "institutionName", label: "Institution Name" },
    { key: "category", label: "Category" },
    { key: "papersOpted", label: "Papers" },
  ];

  const handleDownloadTemplate = () => {
    // Use the imported Excel file
    const templatePath = "excel/candidates.xlsx";

    // Create a link element
    const link = document.createElement("a");
    link.href = templatePath;
    link.download = "candidates_template.xlsx"; // Name of the file to be downloaded
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await API.get("Semesters");
        setSemesters(response.data);
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await API.get("Sessions");
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
    if (!selectedFile) return;

    // Check file type
    const fileType = selectedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'xls', 'xlsx'].includes(fileType)) {
      toast.error('Please upload a valid Excel or CSV file', {
        autoClose: 3000
      });
      return;
    }

    setFile(selectedFile);
    readExcelFile(selectedFile);
    toast.info('Processing file...', {
      autoClose: 2000
    });
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        const headers = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0];

        if (!headers || headers.length === 0) {
          toast.error('No headers found in the file');
          return;
        }

        setCandidates(jsonData);
        setHeaders(headers);
        toast.success(`File processed successfully. Found ${jsonData.length} records.`, {
          autoClose: 3000
        });
      } catch (error) {
        toast.error('Error processing file. Please check the file format.');
        console.error('File processing error:', error);
      }
    };
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleHeaderChange = (fieldKey, selectedHeader) => {
    if (!selectedHeader) {
      toast.warning(`Please select a header for ${fieldKey}`, {
        autoClose: 2000,
        hideProgressBar: true
      });
      return;
    }
    setFieldHeaderMapping((prev) => ({ ...prev, [fieldKey]: selectedHeader }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!selectedSemester || !selectedSession) {
      toast.warning('Please select both Semester and Session', {
        autoClose: 3000
      });
      return;
    }

    if (!file) {
      toast.error('Please select a file to upload', {
        autoClose: 3000
      });
      return;
    }

    // Check if all required fields are mapped
    const requiredFields = ['rollNumber', 'candidateName'];
    const missingFields = requiredFields.filter(
      field => !fieldHeaderMapping[field]
    );

    if (missingFields.length > 0) {
      toast.error(`Please map the following required fields: ${missingFields.join(', ')}`, {
        autoClose: 4000
      });
      return;
    }

    try {
      const dataToSubmit = candidates.map((candidate) => {
        const candidateData = {
          candidateID: 0,
          semID: parseInt(selectedSemester, 10),
          sesID: parseInt(selectedSession, 10),
          candidateName: "",
          group: "",
          rollNumber: "",
          fName: "",
          mName: "",
          dob: "",
          institutionName: "",
          category: "",
        };

        candidateFields.forEach((field) => {
          const selectedHeader = fieldHeaderMapping[field.key];
          if (selectedHeader && candidate[selectedHeader] !== undefined) {
            candidateData[field.key] = candidate[selectedHeader];
          }
        });

        candidateData.rollNumber = JSON.stringify(candidateData.rollNumber);
        return candidateData;
      });

      // Show loading toast
      toast.info('Processing candidates...', {
        autoClose: false,
        toastId: 'uploading'
      });

      // Submit candidates in batches
      for (const candidateData of dataToSubmit) {
        const response = await API.post("Candidates", candidateData);
        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`Failed to submit: ${response.data.title || response.statusText}`);
        }
      }

      // Dismiss loading toast and show success
      toast.dismiss('uploading');
      toast.success(`Successfully uploaded ${dataToSubmit.length} candidates!`, {
        autoClose: 3000
      });

      // Reset form
      setFile(null);
      setCandidates([]);
      setHeaders([]);
      setFieldHeaderMapping({});

    } catch (error) {
      toast.dismiss('uploading');
      toast.error(`Error uploading candidates: ${error.message}`, {
        autoClose: 5000
      });
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      <div className={`p-6 rounded-lg ${cardClass} mb-6`}>
        <h2 className={`text-xl font-semibold mb-6 ${textClass}`}>Bulk Upload Candidates</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className={`w-full rounded-lg px-4 py-2 ${inputClass}`}
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
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className={`w-full rounded-lg px-4 py-2 ${inputClass}`}
            >
              <option value="">Select Session</option>
              {sessions.map((session) => (
                <option key={session.sesID} value={session.sesID}>
                  {session.sessionName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mb-6 items-end">
          {/* File Upload Section */}
          <div className="col-span-12 sm:col-span-8">
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Upload Excel File
            </label>
            <input
              type="file"
              accept=".csv, .xls, .xlsx"
              onChange={handleFileChange}
              className={`w-full rounded-lg px-4 py-2 h-12 ${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${theme === 'dark'
                  ? 'file:bg-purple-600 file:text-white hover:file:bg-purple-700'
                  : 'file:bg-blue-600 file:text-white hover:file:bg-blue-700'
                }`}
            />
          </div>

          {/* Download Template Button */}
          <div className="col-span-12 sm:col-span-4 flex sm:justify-end">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className={`w-full sm:w-auto px-6 py-2 h-12 rounded-lg font-semibold transition-colors ${buttonClass}`}
            >
              <FaFileDownload className="inline mr-2" />
              Template
            </button>
          </div>
        </div>




        <div className={`overflow-x-auto rounded-lg mb-6 ${cardClass}`}>
          <table className={`w-full border-collapse ${theme === 'dark'
            ? 'border-purple-500/20'
            : 'border border-blue-200'
            }`}>
            <thead className={tableHeaderClass}>
              <tr>
                <th className={`px-6 py-3 text-left font-semibold ${tableCellClass}`}>Field</th>
                <th className={`px-6 py-3 text-left font-semibold ${tableCellClass}`}>CSV Header</th>
              </tr>
            </thead>
            <tbody>
              {candidateFields.map((field, index) => (
                <tr key={field.key} className={`
                  ${index > 0 && index % 2 === 1  // Start striping from second row
                    ? theme === 'dark'
                      ? 'bg-purple-900/20'
                      : 'bg-blue-50/50'
                    : ''
                  }
                `}>
                  <td className={`px-6 py-4 ${textClass} ${tableCellClass}`}>{field.label}</td>
                  <td className={`px-6 py-4 ${tableCellClass}`}>
                    <select
                      className={`w-full rounded-lg px-4 py-2 ${inputClass}`}
                      value={fieldHeaderMapping[field.key] || ""}
                      onChange={(e) => handleHeaderChange(field.key, e.target.value)}
                    >
                      <option value="">Select Header</option>
                      {headers
                        .filter(header => !Object.values(fieldHeaderMapping).includes(header) ||
                          fieldHeaderMapping[field.key] === header)
                        .map((header, index) => (
                          <option key={index} value={header}>{header}</option>
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
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${buttonClass}`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewFormComponent;

