import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import API from "../../../services/api";
import { useThemeStore } from "../../../store/themeStore";

const EditCandidate = () => {
  const theme = useThemeStore((state) => state.theme);
  const [rollNumberToSearch, setRollNumberToSearch] = useState("");
  const [formData, setFormData] = useState({
    candidateID: 0,
    candidateName: "",
    group: "",
    rollNumber: "",
    fName: "",
    mName: "",
    dob: "",
    institutionName: "",
    semID: "",
    sesID: "",
    category: "",
    papersOpted: "",
  });

  const [semesters, setSemesters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [availablePapers, setAvailablePapers] = useState([]);
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    rollNumber: "",
    sesID: "",
    semID: "",
  });

  const isDataFetched = formData.candidateID !== 0;

  // Theme classes
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [semRes, sesRes, groupRes, catRes, instRes] = await Promise.all([
          API.get('Semesters'),
          API.get('Sessions'),
          API.get('Groups'),
          API.get('Categories'),
          API.get('Institutes')
        ]);

        setSemesters(semRes.data);
        setSessions(sesRes.data);
        setGroups(groupRes.data);
        setCategories(catRes.data);
        setInstitutions(instRes.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (formData.semID) {
      const fetchPapers = async () => {
        try {
          const response = await API.get(`Papers/GetBySem/${formData.semID}`);
          const papers = response.data.filter(paper => paper.paperCode !== 0);
          setAvailablePapers(papers);
        } catch (error) {
          console.error("Error fetching papers:", error);
          toast.error("Failed to fetch papers");
        }
      };
      fetchPapers();
    }
  }, [formData.semID]);

  const handleSearch = async () => {
    if (!searchFilters.rollNumber || !searchFilters.sesID || !searchFilters.semID) {
      toast.warning("Please enter roll number, session and semester to search");
      return;
    }

    setLoading(true);
    try {
      const response = await API.get(
        `Candidates/GetByDetails/${searchFilters.rollNumber}/${searchFilters.sesID}/${searchFilters.semID}`
      );
      
      const candidateData = {
        candidateID: response.data.candidateID,
        candidateName: response.data.candidateName,
        group: response.data.group,
        rollNumber: response.data.rollNumber,
        fName: response.data.fName,
        mName: response.data.mName,
        dob: response.data.dob,
        institutionName: response.data.institutionName,
        semID: searchFilters.semID,
        sesID: searchFilters.sesID,
        category: response.data.category,
        papersOpted: response.data.papersOpted,
      };

      setFormData(candidateData);
      
      if (candidateData.papersOpted) {
        const paperIds = candidateData.papersOpted.split(',').map(Number);
        setSelectedPapers(paperIds);
      }

      toast.success("Candidate found successfully!");
    } catch (error) {
      console.error("Error fetching candidate:", error);
      toast.error("Failed to find candidate with the given details");
      setFormData({
        candidateID: 0,
        candidateName: "",
        group: "",
        rollNumber: "",
        fName: "",
        mName: "",
        dob: "",
        institutionName: "",
        semID: "",
        sesID: "",
        category: "",
        papersOpted: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaperChange = (paperId) => {
    setSelectedPapers(prev => {
      const newSelection = prev.includes(paperId)
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId];
      
      setFormData(prev => ({
        ...prev,
        papersOpted: newSelection.join(',')
      }));

      return newSelection;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.candidateName || !formData.rollNumber || !formData.semID || !formData.sesID) {
      toast.warning('Please ensure all required fields are filled', {
        autoClose: 3000
      });
      return;
    }

    setLoading(true);
    toast.info('Updating candidate details...', {
      toastId: 'updating'
    });

    try {
      const response = await API.put(
        `Candidates/UpdateByDetails/${formData.rollNumber}/${formData.sesID}/${formData.semID}`, 
        {
          candidateID: parseInt(formData.candidateID),
          candidateName: formData.candidateName,
          group: formData.group || "",
          rollNumber: formData.rollNumber,
          fName: formData.fName || "",
          mName: formData.mName || "",
          dob: formData.dob || "",
          institutionName: formData.institutionName || "",
          semID: parseInt(formData.semID),
          sesID: parseInt(formData.sesID),
          category: formData.category || "",
          papersOpted: formData.papersOpted || "",
        }
      );
      
      toast.dismiss('updating');
      toast.success('Candidate updated successfully!');
    } catch (error) {
      toast.dismiss('updating');
      toast.error(`Failed to update candidate: ${error.message}`);
      console.error("Error updating candidate:", error);
    } finally {
      setLoading(false);
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
        <h2 className={`text-xl font-semibold mb-6 ${textClass}`}>Edit Candidate</h2>

        {/* Search Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Roll Number
            </label>
            <input
              type="text"
              value={searchFilters.rollNumber}
              onChange={(e) => setSearchFilters(prev => ({
                ...prev,
                rollNumber: e.target.value
              }))}
              placeholder="Enter Roll Number to Search"
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Session
            </label>
            <select
              value={searchFilters.sesID}
              onChange={(e) => setSearchFilters(prev => ({
                ...prev,
                sesID: e.target.value
              }))}
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
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Semester
            </label>
            <select
              value={searchFilters.semID}
              onChange={(e) => setSearchFilters(prev => ({
                ...prev,
                semID: e.target.value
              }))}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.semID} value={sem.semID}>
                  {sem.semesterName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`w-full px-6 py-2 rounded-lg ${buttonClass} disabled:opacity-50`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Candidate Name
            </label>
            <input
              type="text"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              disabled={!isDataFetched}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              placeholder="Enter candidate name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Roll Number
            </label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              disabled
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              placeholder="Enter roll number"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Father's Name
            </label>
            <input
              type="text"
              name="fName"
              value={formData.fName}
              onChange={handleChange}
              disabled={!isDataFetched}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              placeholder="Enter father's name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Mother's Name
            </label>
            <input
              type="text"
              name="mName"
              value={formData.mName}
              onChange={handleChange}
              disabled={!isDataFetched}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              placeholder="Enter mother's name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isDataFetched}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Institution Name
            </label>
            <select
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              disabled={!isDataFetched}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
            >
              <option value="">Select Institution</option>
              {institutions.map((institution) => (
                <option key={institution.id} value={institution.instituteName}>
                  {institution.instituteName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Session
            </label>
            <select
              name="sesID"
              value={formData.sesID}
              onChange={handleChange}
              disabled={!isDataFetched}
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
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Semester
            </label>
            <select
              name="semID"
              value={formData.semID}
              onChange={handleChange}
              disabled={!isDataFetched}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
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
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Group
            </label>
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              disabled={!isDataFetched}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.groupName}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={!isDataFetched}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
              Papers
            </label>
            <div className={`w-full px-4 py-2 rounded-lg border ${inputClass} max-h-60 overflow-y-auto`}>
              {!formData.semID ? (
                <p className={`text-sm ${theme === 'dark' ? 'text-purple-400' : 'text-blue-500'}`}>
                  Please select a semester first to view available papers
                </p>
              ) : availablePapers.length === 0 ? (
                <p className={`text-sm ${theme === 'dark' ? 'text-purple-400' : 'text-blue-500'}`}>
                  No papers available for this semester
                </p>
              ) : (
                <div className="space-y-2">
                  {availablePapers.map((paper) => (
                    <div key={paper.paperID} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`paper-${paper.paperID}`}
                        checked={selectedPapers.includes(paper.paperID)}
                        onChange={() => handlePaperChange(paper.paperID)}
                        disabled={!isDataFetched}
                        className="mr-2"
                      />
                      <label htmlFor={`paper-${paper.paperID}`} className={textClass}>
                        {paper.paperName}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading || !isDataFetched}
              className={`w-full px-6 py-2 rounded-lg ${buttonClass} disabled:opacity-50`}
            >
              {loading ? "Updating..." : "Update Candidate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCandidate;