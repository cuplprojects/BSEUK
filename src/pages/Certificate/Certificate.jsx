import React, { useState, useEffect } from "react";
import { FiDownload, FiLoader } from "react-icons/fi";
import API from "../../services/api";
import Template from "./Template";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Certificate = () => {
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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

  const formatCertificateData = (result) => {
    return {
      name: result.studentDetails.candidateName,
      mothersName: result.studentDetails.mName,
      fathersName: result.studentDetails.fName,
      rollNo: result.studentDetails.rollNumber,
      class: result.studentDetails.group,
      institutionName: result.studentDetails.institutionName,
      marks: result.marksDetails.map(mark => ({
        code: mark.paperCode,
        name: mark.paperName,
        maxMarks: mark.maxMarks,
        theory: mark.theoryMarks,
        practical: mark.practicalMarks,
        total: mark.total
      })),
      totalMarks: result.totalMarks,
      result: ((result.totalMarks / result.maximumMarks) * 100).toFixed(2) >= 33 ? "PASS" : "FAIL",
      watermarkImage: "/path/to/watermark.png",
      headerImage: "/path/to/logo.png"
    };
  };

  const generatePDF = async (result) => {
    const data = formatCertificateData(result);
    setCertificateData(data);
    setShowPreview(true);

    // Wait for the template to render
    await new Promise(resolve => setTimeout(resolve, 100));

    const template = document.getElementById('certificate-template');
    const canvas = await html2canvas(template, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

    return pdf;
  };

  const handleSingleDownload = async () => {
    if (!rollNumber || !selectedSession || !selectedSemester) {
      setError("Please enter roll number and select session and semester");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await API.post('/StudentsMarksObtaineds/GetStudentResult', {
        rollNumber,
        sessionId: parseInt(selectedSession),
        semesterId: parseInt(selectedSemester)
      });

      const result = response.data;
      const pdf = await generatePDF(result);
      pdf.save(`Certificate_${result.studentDetails.rollNumber}.pdf`);
      setShowPreview(false);
    } catch (error) {
      console.error("Error generating certificate:", error);
      setError("Failed to generate certificate. Please check the details and try again.");
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
      const response = await API.post("/StudentsMarksObtaineds/GetBulkResult", {
        sessionId: parseInt(selectedSession),
        semesterId: parseInt(selectedSemester),
      });

      const results = response.data;
      
      for (const result of results) {
        const pdf = await generatePDF(result);
        pdf.save(`Certificate_${result.studentDetails.rollNumber}.pdf`);
      }

      setShowPreview(false);
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
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-8">
          Certificate Generation
        </h1>

        {/* Individual Certificate Download */}
        <div className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">
            Download Individual Certificate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2">Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
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
              <label className="block mb-2">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
              >
                <option value="">Select Semester</option>
                {semesters.map((semester) => (
                  <option key={semester.semID} value={semester.semID}>
                    {semester.semesterName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter Roll Number"
                className="w-full px-4 py-2 rounded-lg border"
              />
            </div>
          </div>
          <button
            onClick={handleSingleDownload}
            disabled={loading}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiDownload />
            )}
            Download Certificate
          </button>
        </div>

        {/* Bulk Certificate Download */}
        <div className="border rounded-lg p-6 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">
            Bulk Download Certificates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2">Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
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
              <label className="block mb-2">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
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
            className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
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
          <div className={`p-4 rounded-lg ${error.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}

        {/* Hidden certificate template for PDF generation */}
        {showPreview && certificateData && (
          <div className="fixed left-[-9999px]" id="certificate-template">
            <Template data={certificateData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificate;