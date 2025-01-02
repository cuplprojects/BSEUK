import React, { useState, useEffect } from "react";
import { FiDownload, FiLoader } from "react-icons/fi";
import API from "../../services/api";
import Template from "./Template";
import Template2 from "./Template2";
import Template3 from "./Template3";
import Template4 from "./Template4";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import logo from "./../../assets/logo.png";
import "./Certificate.css";
import JSZip from "jszip";

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
  const [entersession, setEntersession] = useState("");

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
    const studentDetails = result.studentDetails;
    const resultData = studentDetails.result;
    console.log(result);

    if (studentDetails.sem === "First Semester") {
      return {
        sno: studentDetails.candidateID,
        name: studentDetails.name,
        mothersName: studentDetails.mName,
        fathersName: studentDetails.fName,
        rollNo: studentDetails.rollNo,
        group: studentDetails.group,
        institutionName: studentDetails.institutionName,
        session: studentDetails.session,
        semester: studentDetails.sem,

        marks: resultData.marksDetails.map((mark) => ({
          code: mark.paperCode,
          type: mark.paperType,
          name: mark.paperName,
          maxMarks: mark.rowMaxTotal,
          theoryMax: mark.theoryPaperMaxMarks,
          theory: mark.theoryPaperMarks,
          practical: mark.practicalMarks,
          internalMax: mark.internalMaxMarks,
          internal: mark.internalMarks,
          total: mark.rowTotal,
        })),
        totalMarks: resultData.totalMarksObtained,
        maxMarks: resultData.totalMaxMarks,
        result: resultData.remarks,
        watermarkImage: logo,
        headerImage: logo,
      };
    } else if (studentDetails.sem === "Second Semester") {
      return {
        sno: studentDetails.candidateID,
        name: studentDetails.name,
        mothersName: studentDetails.mName,
        fathersName: studentDetails.fName,
        rollNo: studentDetails.rollNo,
        group: studentDetails.group,
        institutionName: studentDetails.institutionName,
        session: studentDetails.session,
        semester: studentDetails.sem,
        marks: resultData.marksDetails.map((mark) => ({
          code: mark.paperCode,
          type: mark.paperType,
          name: mark.paperName,
          maxMarks: mark.rowMaxTotal,
          theoryMax: mark.theoryPaperMaxMarks,
          theory: mark.theoryPaperMarks,
          practical: mark.practicalMarks,
          internalMax: mark.internalMaxMarks,
          internal: mark.internalMarks,
          total: mark.rowTotal,
          pageremark: mark.paperRemarks,
        })),
        totalMarks: resultData.totalMarksObtained,
        maxMarks: resultData.totalMaxMarks,
        result: resultData.remarks,
        watermarkImage: logo,
        headerImage: logo,
      };
    } else if (studentDetails.sem === "Third Semester") {
      return {
        sno: studentDetails.candidateID,
        name: studentDetails.name,
        mothersName: studentDetails.mName,
        fathersName: studentDetails.fName,
        rollNo: studentDetails.rollNo,
        group: studentDetails.group,
        institutionName: studentDetails.institutionName,
        session: studentDetails.session,
        semester: studentDetails.sem,
        marks: resultData.marksDetails.map((mark) => ({
          code: mark.paperCode,
          type: mark.paperType,
          name: mark.paperName,
          maxMarks: mark.rowMaxTotal,
          theoryMax: mark.theoryPaperMaxMarks,
          theory: mark.theoryPaperMarks,
          practical: mark.practicalMarks,
          internalMax: mark.internalMaxMarks,
          internal: mark.internalMarks,
          total: mark.rowTotal,
        })),
        totalMarks: resultData.totalMarksObtained,
        maxMarks: resultData.totalMaxMarks,
        result: resultData.remarks,
        watermarkImage: logo,
        headerImage: logo,
        entersession: entersession,
      };
    } else if (studentDetails.sem === "Fourth Semester") {
      return {
        sno: studentDetails.candidateID,
        name: studentDetails.name,
        rollNo: studentDetails.rollNo,
        fathersName: studentDetails.fName,
        mothersName: studentDetails.mName,
        institutionName: studentDetails.institutionName,
        group: studentDetails.group,
        session: studentDetails.session,
        semester: studentDetails.sem,
        marks: resultData.marksDetails.map((mark) => ({
          code: mark.paperID,
          type: mark.paperType,
          name: mark.paperName,
          maxMarks: mark.rowMaxTotal,
          theoryMax: mark.theoryPaperMaxMarks,
          theory: mark.theoryPaperMarks,
          practical: mark.practicalMarks,
          internalMax: mark.internalMaxMarks,
          internal: mark.internalMarks,
          total: mark.rowTotal,
          pageremark: mark.paperRemarks,
        })),
        totalMarks: resultData.totalMarksObtained,
        maxMarks: resultData.totalMaxMarks,
        result: resultData.remarks,
        watermarkImage: logo,
        headerImage: logo,
      };
    }
  };

  const generatePDF = async (result) => {
    const data = formatCertificateData(result);
    console.log(data);
    setCertificateData(data);
    setShowPreview(true);

    // Wait for the template to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    const template = document.getElementById("certificate-template");
    const canvas = await html2canvas(template, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

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
      const response = await API.post(
        "/StudentsMarksObtaineds/GetStudentResult",
        {
          rollNumber,
          sessionId: parseInt(selectedSession),
          semesterId: parseInt(selectedSemester),
        }
      );

      const result = response.data;
      const pdf = await generatePDF(result);
      console.log(result);
      pdf.save(
        `Certificate_${result.studentDetails.rollNo}_${result.studentDetails.sem}.pdf`
      );
      setShowPreview(false);
    } catch (error) {
      console.error("Error generating certificate:", error);
      setError(
        "Failed to generate certificate. Please check the details and try again."
      );
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
      // Fetch the list of candidates first
      const candidatesResponse = await API.post("/Candidates/GetStudents", {
        sesID: parseInt(selectedSession),
        semID: parseInt(selectedSemester),
      });

      const candidates = candidatesResponse.data;
      const pdfPromises = candidates.map(async (candidate) => {
        try {
          console.log(`Processing candidate: ${candidate.rollNumber}`); // Log candidate processing
          const resultResponse = await API.post(
            "/StudentsMarksObtaineds/GetStudentResult",
            {
              rollNumber: candidate.rollNumber,
              sessionId: parseInt(selectedSession),
              semesterId: parseInt(selectedSemester),
            }
          );

          // Check if the result contains a message indicating no scores found
          if (
            resultResponse.data.message &&
            resultResponse.data.message === "No scores found for the student."
          ) {
            console.warn(
              `Skipping candidate ${candidate.rollNumber}: No scores found.`
            );
            return null; // Skip this candidate
          }

          const result = resultResponse.data;
          console.log("printing result" + result);
          const pdf = await generatePDF(result);
          console.log(`Generated PDF for candidate: ${candidate.rollNumber}`); // Log successful PDF generation
          return { pdf, rollNumber: candidate.rollNumber };
        } catch (error) {
          // Check for 404 error and skip the candidate
          if (error.response && error.response.status === 404) {
            console.warn(
              `Skipping candidate ${candidate.rollNumber}: Data not found.`
            );
            return null; // Skip this candidate
          }
          console.error(
            `Error processing candidate ${candidate.rollNumber}:`,
            error
          ); // Log error details
          throw error; // Rethrow other errors
        }
      });

      // Wait for all PDFs to be generated and filter out any null values
      const pdfs = (await Promise.all(pdfPromises)).filter(
        (pdf) => pdf !== null
      );

      // Create a ZIP file
      const zip = new JSZip();
      pdfs.forEach(({ pdf, rollNumber }) => {
        zip.file(`Certificate_${rollNumber}.pdf`, pdf.output("blob"), {
          binary: true,
        });
      });

      // Generate the ZIP file and trigger download
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = `Certificates_${selectedSession}_${selectedSemester}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
        <h1 className="text-3xl font-bold mb-8">Certificate Generation</h1>
        <div className="border rounded-lg p-6 bg-white shadow">
          <div>
            <h2 className="block mb-2 text-xl font-semibold mb-4">
              Enter Session For Certificate Generation
            </h2>
            <input
              type="text"
              value={entersession}
              onChange={(e) => setEntersession(e.target.value)}
              placeholder="Enter Your Session "
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>
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
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 mt-5"
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiDownload />}
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
            {loading ? <FiLoader className="animate-spin" /> : <FiDownload />}
            Download All Certificates
          </button>
        </div>

        {error && (
          <div
            className={`p-4 rounded-lg ${
              error.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {/* Hidden certificate template for PDF generation */}
        {showPreview && certificateData && (
          <div className="fixed left-[-9999px]" id="certificate-template">
            {certificateData.semester === "Second Semester" ? (
              <Template2 data={certificateData} />
            ) : certificateData.semester === "Third Semester" ? (
              <Template3 data={certificateData} />
            ) : certificateData.semester === "Fourth Semester" ? (
              <Template4 data={certificateData} />
            ) : (
              <Template data={certificateData} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificate;
