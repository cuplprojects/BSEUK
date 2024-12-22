import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import StudentData from "./StudentData";
import Papers from "./Papers";
import EditMarks from "./EditMarks";
import { useThemeStore } from "../../store/themeStore";
import axios from "axios";

const MarksEntryForm = () => {
  const { studentId } = useParams();
  const theme = useThemeStore((state) => state.theme);
  const [studentData, setStudentData] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [semesterName, setSemesterName] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (studentId) {
        try {
          setLoading(true);
          const studentResponse = await axios.get(
            `https://localhost:7133/api/Candidates/${studentId}`
          );
          const student = studentResponse.data;
          setStudentData(student);

          const [sessionResponse, semesterResponse] = await Promise.all([
            axios.get(`https://localhost:7133/api/Sessions/${student.sesID}`),
            axios.get(`https://localhost:7133/api/Semesters/${student.semID}`),
          ]);

          setSessionName(sessionResponse.data.sessionName);
          setSemesterName(semesterResponse.data.semesterName);

          const papersResponse = await axios.get(
            "https://localhost:7133/api/Papers"
          );
          const allPapers = papersResponse.data;

          const filteredPapers = allPapers.filter(
            (paper) => parseInt(paper.semID) === parseInt(student.semID)
          );

          const enrichedPapers = await Promise.all(
            filteredPapers.map(async (paper) => {
              try {
                const paperTypeResponse = await axios.get(
                  `https://localhost:7133/api/PaperTypes/${paper.paperType}`
                );
                return {
                  ...paper,
                  paperTypee: paperTypeResponse.data.paperTypee,
                  paperID: paper.paperID || paper.PaperID,
                  paperName: paper.paperName || paper.PaperName,
                  paperCode: paper.paperCode || paper.PaperCode,
                };
              } catch (error) {
                return {
                  ...paper,
                  paperTypee: "Unknown Type",
                  paperID: paper.paperID || paper.PaperID,
                  paperName: paper.paperName || paper.PaperName,
                  paperCode: paper.paperCode || paper.PaperCode,
                };
              }
            })
          );
          setPapers(enrichedPapers);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAllData();
  }, [studentId]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1
          className={`text-3xl font-bold ${
            theme === "dark"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-800"
              : "text-blue-700"
          }`}
        >
          Marks Entry Form
        </h1>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Student Data in first column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`border rounded-lg p-6 ${
              theme === "dark"
                ? "bg-black/40 backdrop-blur-xl border-r border-purple-500/20"
                : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            <h2
              className={`text-xl font-semibold ${
                theme === "dark" ? "text-white" : "text-blue-900"
              } mb-4`}
            >
              Candidate Information
            </h2>
            {loading ? (
              <div
                className={`flex justify-center items-center py-4 ${
                  theme === "dark" ? "text-purple-300" : "text-blue-600"
                }`}
              >
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-current"></div>
                <span className="ml-2">Loading student data...</span>
              </div>
            ) : (
              <StudentData
                studentData={studentData}
                sessionName={sessionName}
                semesterName={semesterName}
                theme={theme}
              />
            )}
          </motion.div>

          {/* Papers spanning the remaining 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`border rounded-lg p-6 col-span-3 ${
              theme === "dark"
                ? "bg-black/40 backdrop-blur-xl border-r border-purple-500/20"
                : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            
            {loading ? (
              <div
                className={`flex justify-center items-center py-4 ${
                  theme === "dark" ? "text-purple-300" : "text-blue-600"
                }`}
              >
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-current"></div>
                <span className="ml-2">Loading papers...</span>
              </div>
            ) : (
              <>
                <Papers
                  papers={papers}
                  theme={theme}
                  onSelectPaper={setSelectedPaper}
                  selectedPaper={selectedPaper}
                />
              </>
            )}
          </motion.div>
        </div>

        {/* EditMarks Full Width below the other sections */}
        <div className="mt-6">
          {selectedPaper && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`border rounded-lg p-6 ${
                theme === "dark"
                  ? "bg-black/40 backdrop-blur-xl border-r border-purple-500/20"
                  : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <h2
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-blue-900"
                } mb-4`}
              >
                Enter Marks
              </h2>
              <EditMarks
                paperID={selectedPaper.paperID}
                paperName={selectedPaper.paperName}
                paperCode={selectedPaper.paperCode}
                paperType={selectedPaper.paperType}
                theme={theme}
                studentId={studentId}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MarksEntryForm;
