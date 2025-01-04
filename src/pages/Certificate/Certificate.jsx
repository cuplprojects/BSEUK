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
import { useThemeStore } from "../../store/themeStore";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const theme = useThemeStore((state) => state.theme);
  
  const cardClass = theme === 'dark'
    ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
    : 'bg-white border-blue-200 shadow-xl';

  const textClass = theme === 'dark'
    ? 'text-purple-100'
    : 'text-blue-700';

  const inputClass = theme === 'dark'
    ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&>option]:bg-purple-900 [&>option]:text-purple-100'
    : 'bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&>option]:bg-white [&>option]:text-blue-600';

  const buttonClass = theme === 'dark'
    ? 'bg-purple-600 hover:bg-purple-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  const bulkButtonClass = theme === 'dark'
    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
    : 'bg-green-600 hover:bg-green-700 text-white';

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
        toast.error("Failed to load sessions and semesters");
      }
    };
    fetchData();
  }, []);

  useEffect(()=>{
    
  })

  const formatCertificateData = (result, result2) => {
    const studentDetails = result.studentDetails;
    const resultData = studentDetails.result;
    const OverAllDetails = result2

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
        entersession: entersession
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
        entersession: entersession
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
        entersession: entersession,
        OverAllDetails
      };
    }
  };

  const generatePDF = async (result, result2) => {
    const data = formatCertificateData(result, result2);
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
    if (!selectedSession || !selectedSemester || !rollNumber) {
      toast.warning("Please fill in all fields", {
        autoClose: 3000
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loadingToast = toast.loading("Generating certificate...");
      
      // Your existing certificate generation logic
      const result = await API.get(
        `Candidates/GetCertificateData/${selectedSession}/${selectedSemester}/${rollNumber}`
      );
      const result2 = await API.get(
        `StudentsMarksObtaineds/GetStudentMarks/${selectedSession}/${selectedSemester}/${rollNumber}`
      );

      if (!result.data || !result2.data) {
        toast.update(loadingToast, {
          render: "No data found for the given criteria",
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
        return;
      }

      const formattedData = formatCertificateData(result.data, result2.data);
      setCertificateData(formattedData);
      setShowPreview(true);

      // Generate PDF
      await generatePDF();

      toast.update(loadingToast, {
        render: "Certificate downloaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

    } catch (error) {
      toast.error(error.message || "Failed to generate certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDownload = async () => {
    if (!selectedSession || !selectedSemester) {
      toast.warning("Please select both session and semester", {
        autoClose: 3000
      });
      return;
    }

    // if (!entersession) {
    //   toast.warning("Please enter the session for certificate", {
    //     autoClose: 3000
    //   });
    //   return;
    // }

    setLoading(true);
    const loadingToast = toast.loading("Generating certificates...");

    try {
      const response = await API.get(
        `Candidates/GetAllCertificateData/${selectedSession}/${selectedSemester}`
      );

      if (!response.data || response.data.length === 0) {
        toast.update(loadingToast, {
          render: "No candidates found for the selected criteria",
          type: "warning",
          isLoading: false,
          autoClose: 3000
        });
        return;
      }

      // Your existing bulk download logic
      const zip = new JSZip();
      let processedCount = 0;

      for (const candidate of response.data) {
        // Process each candidate
        processedCount++;
        const progress = Math.round((processedCount / response.data.length) * 100);
        
        toast.update(loadingToast, {
          render: `Processing certificates: ${progress}%`,
          type: "info",
          isLoading: true
        });

        // Your existing certificate generation logic for each candidate
      }

      // Final success message
      toast.update(loadingToast, {
        render: `Successfully downloaded ${response.data.length} certificates!`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

    } catch (error) {
      toast.update(loadingToast, {
        render: error.message || "Failed to generate certificates",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
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
        theme={theme === 'dark' ? 'dark' : 'light'}
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
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>Session</label>
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
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>Semester</label>
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
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter Roll Number"
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              />
            </div>
          </div>
          <button
            onClick={handleSingleDownload}
            disabled={loading}
            className={`w-full px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-5 ${buttonClass} disabled:opacity-50`}
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiDownload />}
            Download Certificate
          </button>
        </div>

        {/* Bulk Certificate Section */}
        <div className={`rounded-lg p-6 ${cardClass}`}>
          <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
            Bulk Download Certificates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>Session</label>
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
              <label className={`block mb-2 text-sm font-medium ${textClass}`}>Semester</label>
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
            className={`w-full px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${bulkButtonClass} disabled:opacity-50`}
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiDownload />}
            Download All Certificates
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
    </motion.div>
  );
};

export default Certificate;
