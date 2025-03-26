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
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useThemeStore } from "../../store/themeStore";
import { FaEye } from "react-icons/fa";
import PreviewModal from "./PreviewModal";

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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  const theme = useThemeStore((state) => state.theme);

  const cardClass =
    theme === "dark"
      ? "bg-black/40 backdrop-blur-xl border-purple-500/20"
      : "bg-white border-blue-200 shadow-xl";

  const textClass = theme === "dark" ? "text-purple-100" : "text-blue-700";

  const inputClass =
    theme === "dark"
      ? "bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&>option]:bg-purple-900 [&>option]:text-purple-100"
      : "bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&>option]:bg-white [&>option]:text-blue-600";

  const buttonClass =
    theme === "dark"
      ? "bg-purple-600 hover:bg-purple-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  const bulkButtonClass =
    theme === "dark"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-green-600 hover:bg-green-700 text-white";

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

  useEffect(() => {
    const checkLockStatus = async () => {
      if (selectedSession && selectedSemester) {
        try {
          const response = await API.post(
            "/LockStatus/getbysessionandsemester",
            {
              sesID: parseInt(selectedSession),
              semID: parseInt(selectedSemester),
            }
          );
          console.log("Lock status response:", response.data);
          setIsLocked(response.data.isLocked);
        } catch (error) {
          console.error("Error checking lock status:", error);
          setIsLocked(false);
        }
      }
    };

    console.log("Selected Session:", selectedSession);
    console.log("Selected Semester:", selectedSemester);

    if (selectedSession && selectedSemester) {
      checkLockStatus();
    }
  }, [selectedSession, selectedSemester]);

  const formatCertificateData = (result, result2) => {
    const studentDetails = result.studentDetails;
    const resultData = studentDetails.result;
    const OverAllDetails = result2;
    console.log(resultData);
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
        awardsheetnumber: studentDetails.awardsheetNumber,
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
          isAbsent: mark.isAbsent,
        })),
        totalMarks: resultData.totalMarksObtained,
        maxMarks: resultData.totalMaxMarks,
        totalExternalMaxMarks: resultData.totalExternalMaxMarks,
        totalExternalMarksObtained: resultData.totalExternalMarksObtained,
        totalInternalMarksObtained: resultData.totalInternalMarksObtained,
        totalInternalMaxMarks: resultData.totalInternalMaxMarks,
        totalPracticalMarksObtained: resultData.totalPracticalMarksObtained,
        totalPracticalMaxMarks: resultData.totalPracticalMaxMarks,
        result: resultData.remarks,
        watermarkImage: logo,
        headerImage: logo,
        entersession: entersession,
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
        awardsheetnumber: studentDetails.awardsheetNumber,
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
          isAbsent: mark.isAbsent,
        })),
        totalMarks: resultData.totalMarksObtained,
        maxMarks: resultData.totalMaxMarks,
        totalExternalMaxMarks: resultData.totalExternalMaxMarks,
        totalExternalMarksObtained: resultData.totalExternalMarksObtained,
        totalInternalMarksObtained: resultData.totalInternalMarksObtained,
        totalInternalMaxMarks: resultData.totalInternalMaxMarks,
        totalPracticalMarksObtained: resultData.totalPracticalMarksObtained,
        totalPracticalMaxMarks: resultData.totalPracticalMaxMarks,
        result: resultData.remarks,
        watermarkImage: logo,
        headerImage: logo,
        entersession: entersession,
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
        awardsheetnumber: studentDetails.awardsheetNumber,
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
          isAbsent: mark.isAbsent,
          pageremark: mark.paperRemarks,
        })),
        totalMarks: resultData.totalMarksObtained,
        maxMarks: resultData.totalMaxMarks,
        totalExternalMaxMarks: resultData.totalExternalMaxMarks,
        totalExternalMarksObtained: resultData.totalExternalMarksObtained,
        totalInternalMarksObtained: resultData.totalInternalMarksObtained,
        totalInternalMaxMarks: resultData.totalInternalMaxMarks,
        totalPracticalMarksObtained: resultData.totalPracticalMarksObtained,
        totalPracticalMaxMarks: resultData.totalPracticalMaxMarks,
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
        awardsheetnumber: studentDetails.awardsheetNumber,
        rank: studentDetails.rank,
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
          isAbsent: mark.isAbsent,
        })),
        totalMarks: resultData.totalMarksObtained,
        maxMarks: resultData.totalMaxMarks,
        totalExternalMaxMarks: resultData.totalExternalMaxMarks,
        totalExternalMarksObtained: resultData.totalExternalMarksObtained,
        totalInternalMarksObtained: resultData.totalInternalMarksObtained,
        totalInternalMaxMarks: resultData.totalInternalMaxMarks,
        totalPracticalMarksObtained: resultData.totalPracticalMarksObtained,
        totalPracticalMaxMarks: resultData.totalPracticalMaxMarks,
        result: resultData.remarks,
        watermarkImage: logo,
        headerImage: logo,
        entersession: entersession,
        OverAllDetails,
      };
    }
  };

  const generatePDF = async (result, result2, options = {}) => {
    const data = formatCertificateData(result, result2);
    // console.log(data)
    setCertificateData(data);
    setShowPreview(true);

    // Wait for the template to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    const template = document.getElementById("certificate-template");
    const canvas = await html2canvas(template, {
      scale: 3, 
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1); 

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add the image to the PDF with compression
    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
    return { pdf, fileName: `Certificate_${data.rollNo}.pdf` };
  };

  const handlePreview = async () => {
    if (!rollNumber || !selectedSession || !selectedSemester) {
      setError("Please enter roll number and select session and semester");
      return;
    }
    setIsPreview(true);
    setLoading(true);
    setError(null);

    try {
      // const datatosend = {
      //   rollNumber: rollNumber,
      //   sessionId: selectedSession,
      //   semesterId: selectedSemester,
      // };
      // const auditresult = await API.post(
      //   "/StudentsMarksObtaineds/AuditforSingle",
      //   datatosend
      // );
      // const data = auditresult.data;

      const response = await API.post(
        "/StudentsMarksObtaineds/GetStudentResult",
        {
          rollNumber,
          sessionId: parseInt(selectedSession),
          semesterId: parseInt(selectedSemester),
        }
      );
      const response2 = await API.get(
        `/StudentsMarksObtaineds/GetAllYearsResult/${rollNumber}`
      );

      const result = response.data;
      const result2 = response2.data;

      const formattedData = formatCertificateData(result, result2);
      setCertificateData(formattedData);
      setIsPreviewModalOpen(true);
      //      else {
      //   toast.warn(
      //     "Insufficient Data to Generate Certificate, Please check not all marks have been entered for the Student"
      //   );
      // }
    } catch (error) {
      console.error("Error generating preview:", error);
      setError(
        "Failed to generate preview. Please check the details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSingleDownload = async () => {
    if (!rollNumber || !selectedSession || !selectedSemester) {
      setError("Please enter roll number and select session and semester");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const datatosend = {
        rollNumber: rollNumber,
        sessionId: selectedSession,
        semesterId: selectedSemester,
      };
      //-----------------------------------------------------
      // const auditresult = await API.post(
      //   "/StudentsMarksObtaineds/AuditforSingle",
      //   datatosend
      // );
      // const data = auditresult.data;
      //------------------------------------------------------
      const response = await API.post(
        "/StudentsMarksObtaineds/GetStudentResult",
        {
          rollNumber,
          sessionId: parseInt(selectedSession),
          semesterId: parseInt(selectedSemester),
        }
      );
      const response2 = await API.get(
        `/StudentsMarksObtaineds/GetAllYearsResult/${rollNumber}`
      );

      const result = response.data;
      const result2 = response2.data;

      const {pdf, fileName} = await generatePDF(result, result2, { quality: 'high' });
      pdf.save(fileName);
      setShowPreview(false);
      //------------------------------------------------------
      // if (data) {
      //   const response = await API.post(
      //     "/StudentsMarksObtaineds/GetStudentResult",
      //     {
      //       rollNumber,
      //       sessionId: parseInt(selectedSession),
      //       semesterId: parseInt(selectedSemester),
      //     }
      //   );
      //   const response2 = await API.get(
      //     `/StudentsMarksObtaineds/GetAllYearsResult/${rollNumber}`
      //   );

      //   const result = response.data;
      //   const result2 = response2.data;

      //   const pdf = await generatePDF(result, result2);
      //   pdf.save(
      //     `Certificate_${result.studentDetails.rollNo}_${result.studentDetails.sem}.pdf`
      //   );
      //   setShowPreview(false);
      // } else {
      //   toast.warn(
      //     "Insufficient Data to Generate Certificate, Please check not all marks have been entered for the Student"
      //   );
      // }
      //------------------------------------------------------
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
      const candidatesResponse = await API.post("/Candidates/GetStudents", {
        sesID: parseInt(selectedSession),
        semID: parseInt(selectedSemester),
      });
  
      const candidates = candidatesResponse.data;
      const results = [];
  
      // Process candidates sequentially instead of using Promise.all
      for (const candidate of candidates) {
        try {
          const datatosend = {
            rollNumber: candidate.rollNumber,
            sessionId: parseInt(selectedSession),
            semesterId: parseInt(selectedSemester),
          };
  
          const auditresult = await API.post(
            "/StudentsMarksObtaineds/AuditforSingle",
            datatosend
          );
  
          if (!auditresult.data) {
            results.push({ rollNumber: candidate.rollNumber, reason: "Incomplete data" });
            continue;
          }
  
          const resultResponse = await API.post(
            "/StudentsMarksObtaineds/GetStudentResult",
            datatosend
          );
  
          if (resultResponse.data.message === "No scores found for the student.") {
            results.push({ rollNumber: candidate.rollNumber, reason: "No scores found" });
            continue;
          }
  
          const result = resultResponse.data;
          const response2 = await API.get(
            `/StudentsMarksObtaineds/GetAllYearsResult/${candidate.rollNumber}`
          );
          const result2 = response2.data;
  
          const { pdf, fileName } = await generatePDF(result, result2, { quality: 'high' });
          results.push({ candidate, pdf, fileName });
  
        } catch (error) {
          if (error.response?.status === 404) {
            results.push({ rollNumber: candidate.rollNumber, reason: "Data not found" });
          } else {
            console.error(`Error processing candidate ${candidate.rollNumber}:`, error);
            results.push({ rollNumber: candidate.rollNumber, reason: "Processing error" });
          }
        }
      }
  
      const pdfs = results.filter((result) => result.pdf);
      const skipped = results.filter((result) => !result.pdf);
  
      if (pdfs.length > 0) {
        const zip = new JSZip();
        pdfs.forEach(({ pdf, fileName }) => {
          zip.file(fileName, pdf.output("blob"), {
            binary: true,
          });
        });
  
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = zipUrl;
        a.download = `Certificates_${selectedSession}_${selectedSemester}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(zipUrl);
      }
  
      if (skipped.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(skipped);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SkippedCandidates");
  
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const excelBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const excelUrl = URL.createObjectURL(excelBlob);
  
        const a = document.createElement("a");
        a.href = excelUrl;
        a.download = `SkippedCandidates_${selectedSession}_${selectedSemester}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(excelUrl);
      }
  
      setError("Certificates and skipped list generated successfully!");
    } catch (error) {
      console.error("Error generating certificates:", error);
      setError("Failed to generate certificates. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
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
        theme={theme === "dark" ? "dark" : "light"}
      />
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className={`text-3xl font-bold mb-8 ${textClass}`}>
          Certificate Generation
        </h1>

        {/* Session Input Section */}
        <div className={`rounded-lg p-6 ${cardClass}`}>
          <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
            Enter Session For Certificate Generation
          </h2>
          <input
            type="text"
            value={entersession}
            onChange={(e) => setEntersession(e.target.value)}
            placeholder="Enter Your Session"
            className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
          />
        </div>

        {/* Individual Certificate Section */}
        <div className={`rounded-lg p-6 ${cardClass}`}>
          <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
            Download Individual Certificate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                Session
              </label>
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
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                Semester
              </label>
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
            <div>
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter Roll Number"
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handlePreview}
              disabled={loading}
              className={`w-full px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-5 ${buttonClass} disabled:opacity-50`}
            >
              {loading ? <FaEye className="animate-spin" /> : <FaEye />}
              Preview Certificate
            </button>
            <button
              onClick={handleSingleDownload}
              disabled={loading || !isLocked}
              className={`w-full px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-5 ${buttonClass} disabled:opacity-50`}
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiDownload />}
              {!isLocked ? "Download Locked" : "Download Certificate"}
            </button>
          </div>
        </div>

        {/* Bulk Certificate Section */}
        <div className={`rounded-lg p-6 ${cardClass}`}>
          <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
            Bulk Download Certificates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                Session
              </label>
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
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                Semester
              </label>
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
            disabled={loading || !isLocked}
            className={`w-full px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${bulkButtonClass} disabled:opacity-50`}
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiDownload />}
            {!isLocked ? "Download Locked" : "Download All Certificates"}
          </button>
        </div>

        {/* Error/Success Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              error.includes("success")
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200"
                : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200"
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Hidden certificate template */}
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
      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      >
        {certificateData && (
          <div className="w-full max-w-4xl">
            {certificateData.semester === "Second Semester" ? (
              <Template2 data={certificateData} isPreview={isPreview} />
            ) : certificateData.semester === "Third Semester" ? (
              <Template3 data={certificateData} isPreview={isPreview} />
            ) : certificateData.semester === "Fourth Semester" ? (
              <Template4 data={certificateData} isPreview={isPreview} />
            ) : (
              <Template data={certificateData} isPreview={isPreview} />
            )}
          </div>
        )}
      </PreviewModal>
    </motion.div>
  );
};

export default Certificate;
