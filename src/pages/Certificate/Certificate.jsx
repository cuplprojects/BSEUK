import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useThemeStore } from "../../store/themeStore";
import { FiDownload, FiSearch, FiLoader } from "react-icons/fi";
import API from "../../services/api";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const Certificate = () => {
  const theme = useThemeStore((state) => state.theme);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Theme classes
  const cardClass = theme === "dark"
    ? "bg-black/40 backdrop-blur-xl border-purple-500/20"
    : "bg-white border-blue-200 shadow-sm";

  const textClass = theme === "dark"
    ? "text-purple-100"
    : "text-blue-700";

  const inputClass = theme === "dark"
    ? "bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400"
    : "bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400";

  const buttonClass = theme === "dark"
    ? "bg-purple-600 hover:bg-purple-700 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsResponse, semestersResponse] = await Promise.all([
          API.get("/Sessions"),
          API.get("/Semesters"),
        ]);
        setSessions(sessionsResponse.data);
        setSemesters(semestersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load sessions and semesters");
      }
    };
    fetchData();
  }, []);

  const handleSingleDownload = async () => {
    if (!rollNumber) {
      setError("Please enter a roll number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get student result using the new endpoint
      const response = await API.get(`/StudentsMarksObtaineds/GetStudentResult/${rollNumber}`);
      const result = response.data;

      // Generate certificate
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;

      // Add border
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Add Serial Number
      pdf.setFontSize(10);
      pdf.text(`Sr. No. ${result.studentDetails.rollNumber}`, 15, 20);

      // Add Header (Hindi + English)
      pdf.setFontSize(16);
      pdf.text("BOARD OF SCHOOL EDUCATION UTTARAKHAND", pageWidth / 2, 35, { align: "center" });

      // Add Title
      pdf.setFontSize(14);
      pdf.text("TWO-YEAR DIPLOMA IN ELEMENTARY EDUCATION - 2023", pageWidth / 2, 90, { align: "center" });
      pdf.text("MARKS STATEMENT : FIRST SEMESTER", pageWidth / 2, 100, { align: "center" });

      // Add Student Details
      pdf.setFontSize(12);
      pdf.text(`Name: ${result.studentDetails.candidateName}`, 15, 120);
      pdf.text(`Roll No.: ${result.studentDetails.rollNumber}`, pageWidth - 80, 120);
      pdf.text(`Group: ${result.studentDetails.group}`, pageWidth - 40, 120);
      
      pdf.text(`Mother's Name: ${result.studentDetails.mName}`, 15, 130);
      pdf.text(`Father's Name: ${result.studentDetails.fName}`, pageWidth/2, 130);
      
      pdf.text(`Institution's Name: ${result.studentDetails.institutionName}`, 15, 140);

      // Add Marks Table
      const tableData = result.marksDetails.map(mark => [
        mark.paperCode,
        mark.paperName,
        mark.maxMarks,
        mark.theoryMarks,
        mark.internalMarks,
        mark.practicalMarks,
        mark.total
      ]);

      autoTable(pdf, {
        startY: 150,
        head: [["Code", "Subject", "Max Marks", "Theory", "Internal", "Practical", "Total"]],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 2,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 60 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
        },
      });

      // Add Result
      const percentage = ((result.totalMarks / result.maximumMarks) * 100).toFixed(2);
      const resultText = percentage >= 33 ? "PASS" : "FAIL";
      
      pdf.text(`Result: ${resultText} (${percentage}%)`, 15, pdf.autoTable.previous.finalY + 20);

      // Add Signature lines
      pdf.line(15, pageHeight - 30, 60, pageHeight - 30);
      pdf.text("Controller of Examination", 15, pageHeight - 20);

      pdf.line(pageWidth - 60, pageHeight - 30, pageWidth - 15, pageHeight - 30);
      pdf.text("Principal", pageWidth - 60, pageHeight - 20);

      pdf.save(`Certificate_${result.studentDetails.rollNumber}.pdf`);
    } catch (error) {
      console.error("Error generating certificate:", error);
      setError("Failed to generate certificate. Please check the roll number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDownload = async () => {
    if (!selectedSession || !selectedSemester) {
      setError("Please select both session and semester");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get bulk results using the new endpoint
      const response = await API.post("/StudentsMarksObtaineds/GetBulkResult", {
        SessionId: parseInt(selectedSession),
        SemesterId: parseInt(selectedSemester),
      });

      const results = response.data;

      // Generate certificate for each student
      for (const result of results) {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;

        // Add border
        pdf.setDrawColor(0);
        pdf.setLineWidth(0.5);
        pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

        // Add Serial Number
        pdf.setFontSize(10);
        pdf.text(`Sr. No. ${result.studentDetails.rollNumber}`, 15, 20);

        // Add Header (Hindi + English)
        pdf.setFontSize(16);
        pdf.text("BOARD OF SCHOOL EDUCATION UTTARAKHAND", pageWidth / 2, 35, { align: "center" });

        // Add Title
        pdf.setFontSize(14);
        pdf.text("TWO-YEAR DIPLOMA IN ELEMENTARY EDUCATION - 2023", pageWidth / 2, 90, { align: "center" });
        pdf.text("MARKS STATEMENT : FIRST SEMESTER", pageWidth / 2, 100, { align: "center" });

        // Add Student Details
        pdf.setFontSize(12);
        pdf.text(`Name: ${result.studentDetails.candidateName}`, 15, 120);
        pdf.text(`Roll No.: ${result.studentDetails.rollNumber}`, pageWidth - 80, 120);
        pdf.text(`Group: ${result.studentDetails.group}`, pageWidth - 40, 120);
        
        pdf.text(`Mother's Name: ${result.studentDetails.mName}`, 15, 130);
        pdf.text(`Father's Name: ${result.studentDetails.fName}`, pageWidth/2, 130);
        
        pdf.text(`Institution's Name: ${result.studentDetails.institutionName}`, 15, 140);

        // Add Marks Table
        const tableData = result.marksDetails.map(mark => [
          mark.paperCode,
          mark.paperName,
          mark.maxMarks,
          mark.theoryMarks,
          mark.internalMarks,
          mark.practicalMarks,
          mark.total
        ]);

        autoTable(pdf, {
          startY: 150,
          head: [["Code", "Subject", "Max Marks", "Theory", "Internal", "Practical", "Total"]],
          body: tableData,
          theme: "grid",
          styles: {
            fontSize: 10,
            cellPadding: 2,
            overflow: "linebreak",
          },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 60 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 },
            6: { cellWidth: 20 },
          },
        });

        // Add Result
        const percentage = ((result.totalMarks / result.maximumMarks) * 100).toFixed(2);
        const resultText = percentage >= 33 ? "PASS" : "FAIL";
        
        pdf.text(`Result: ${resultText} (${percentage}%)`, 15, pdf.autoTable.previous.finalY + 20);

        // Add Signature lines
        pdf.line(15, pageHeight - 30, 60, pageHeight - 30);
        pdf.text("Controller of Examination", 15, pageHeight - 20);

        pdf.line(pageWidth - 60, pageHeight - 30, pageWidth - 15, pageHeight - 30);
        pdf.text("Principal", pageWidth - 60, pageHeight - 20);

        pdf.save(`Certificate_${result.studentDetails.rollNumber}.pdf`);
      }

      setError("All certificates generated successfully!");
    } catch (error) {
      console.error("Error generating certificates:", error);
      setError("Failed to generate certificates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <h1 className={`text-3xl font-bold ${textClass} mb-8`}>
          Certificate Generation
        </h1>

        {/* Individual Certificate Download */}
        <div className={`border rounded-lg p-6 ${cardClass}`}>
          <h2 className={`text-xl font-semibold ${textClass} mb-4`}>
            Download Individual Certificate
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter Roll Number"
              className={`flex-1 px-4 py-2 rounded-lg border ${inputClass}`}
            />
            <button
              onClick={handleSingleDownload}
              disabled={loading}
              className={`px-6 py-2 rounded-lg ${buttonClass} flex items-center gap-2`}
            >
              {loading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiDownload />
              )}
              Download
            </button>
          </div>
        </div>

        {/* Bulk Certificate Download */}
        <div className={`border rounded-lg p-6 ${cardClass}`}>
          <h2 className={`text-xl font-semibold ${textClass} mb-4`}>
            Bulk Download Certificates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block mb-2 ${textClass}`}>Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
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
              <label className={`block mb-2 ${textClass}`}>Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              >
                <option value="">Select Semester</option>
                {semesters.map((semester) => (
                  <option key={semester.semID} value={semester.semID}>
                    {semester.semesterName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleBulkDownload}
            disabled={loading}
            className={`w-full px-6 py-2 rounded-lg ${buttonClass} flex items-center justify-center gap-2`}
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiDownload />
            )}
            Download All Certificates
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center py-2"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Certificate;