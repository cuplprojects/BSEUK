import { useState, useEffect, useMemo } from "react";
import { useThemeStore } from "../../store/themeStore";
import API from "../../services/api";

const MarksEntry = () => {
  const theme = useThemeStore((state) => state.theme);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [papers, setPapers] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingDropdown, setLoadingDropdown] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paperDetails, setPaperDetails] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [studentsMarks, setStudentsMarks] = useState({});
  const [editableRows, setEditableRows] = useState({});
  const [originalMarks, setOriginalMarks] = useState({});
  // New table states
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Theme classes
  const cardClass =
    theme === "dark"
      ? "bg-black/40 backdrop-blur-xl border-purple-500/20"
      : "bg-white border-blue-200 shadow-sm";

  const textClass = theme === "dark" ? "text-purple-100" : "text-blue-700";

  const inputClass =
    theme === "dark"
      ? "bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400"
      : "bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await API.get("Sessions");
        setSessions(sessionResponse.data);
        const semesterResponse = await API.get("Semesters");
        setSemesters(semesterResponse.data);
        const paperResponse = await API.get("Papers");
        setPapers(paperResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <select onChange={(e) => setSelectedSession(e.target.value)}>
        <option value="">Select Session</option>
        {sessions.map((session) => (
          <option key={session.sesID} value={session.sesID}>
            {session.sessionName}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSelectedSemester(e.target.value)} disabled={!selectedSession}>
        <option value="">Select Semester</option>
        {semesters.map((semester) => (
          <option key={semester.semID} value={semester.semID}>
            {semester.semesterName}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSelectedPaper(e.target.value)} disabled={!selectedSemester}>
        <option value="">Select Paper</option>
        {papers.map((paper) => (
          <option key={paper.paperID} value={paper.paperID}>
            {paper.paperName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MarksEntry;
