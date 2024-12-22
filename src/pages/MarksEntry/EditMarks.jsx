import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiSave, FiAlertCircle, FiLoader, FiX } from "react-icons/fi";

const EditMarks = ({ paperID, paperName, paperCode, paperType, theme, studentId }) => {
  const [marks, setMarks] = useState({
    theoryMarks: "",
    internalMarks: "",
    practicalMarks: "",
  });
  
  const [maxMarks, setMaxMarks] = useState({
    theoryMax: 0,
    internalMax: 0,
    practicalMax: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Reset marks and fetch data when paper changes
  useEffect(() => {
    // Reset states when paper changes
    setMarks({
      theoryMarks: "",
      internalMarks: "",
      practicalMarks: "",
    });
    setSuccess(false);
    setError(null);
    setInitialLoading(true);

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch paper details for max marks
        const paperResponse = await axios.get(
          `https://localhost:7133/api/Papers/${paperID}`
        );
        
        if (paperResponse.data) {
          setMaxMarks({
            theoryMax: paperResponse.data.theoryPaperMaxMarks || 0,
            internalMax: paperResponse.data.interalMaxMarks || 0,
            practicalMax: paperResponse.data.practicalMaxMarks || 0,
          });
        }

        // Fetch existing marks for this student and paper
        const marksResponse = await axios.get(
          `https://localhost:7133/api/StudentsMarksObtaineds/GetStudentPaperMarks/${studentId}/${paperID}`
        );

        if (marksResponse.data) {
          setMarks({
            theoryMarks: marksResponse.data.theoryPaperMarks || "",
            internalMarks: marksResponse.data.interalMarks || "",
            practicalMarks: marksResponse.data.practicalMaxMarks || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Don't show error for no existing marks
        if (!error.response || error.response.status !== 404) {
          setError("Failed to load paper details");
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    if (studentId && paperID) {
      fetchData();
    }
  }, [studentId, paperID]);

  const validateMarks = (value, maxValue) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return "Please enter a valid number";
    if (numValue < 0) return "Marks cannot be negative";
    if (numValue > maxValue) return `Marks cannot exceed ${maxValue}`;
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarks(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate marks based on paper type
    if (paperType === 1) {
      const theoryError = validateMarks(marks.theoryMarks, maxMarks.theoryMax);
      const internalError = validateMarks(marks.internalMarks, maxMarks.internalMax);
      if (theoryError || internalError) {
        setError(theoryError || internalError);
        return;
      }
    } else {
      const practicalError = validateMarks(marks.practicalMarks, maxMarks.practicalMax);
      if (practicalError) {
        setError(practicalError);
        return;
      }
    }

    try {
      setLoading(true);
      await axios.post("https://localhost:7133/api/StudentsMarksObtaineds", {
        candidateID: studentId,
        paperID: paperID,
        theoryPaperMarks: paperType === 1 ? Number(marks.theoryMarks) : null,
        interalMarks: paperType === 1 ? Number(marks.internalMarks) : null,
        practicalMaxMarks: paperType === 2 ? Number(marks.practicalMarks) : null,
      });
      setSuccess(true);
    } catch (error) {
      setError("Failed to save marks. Please try again.");
      console.error("Error saving marks:", error);
    } finally {
      setLoading(false);
    }
  };

  const textClass = theme === "dark" ? "text-purple-300" : "text-blue-600";
  const inputClass = theme === "dark"
    ? "bg-purple-900/20 border-purple-500/20 text-purple-100"
    : "bg-blue-50 border-blue-200 text-blue-900";

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className={`flex items-center gap-3 ${theme === 'dark' ? 'text-purple-300' : 'text-blue-600'}`}>
          <FiLoader className="w-6 h-6 animate-spin" />
          <span>Loading paper details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${textClass} font-bold flex justify-between items-start`}>
        <div>
          <p>Paper: {paperName}</p>
          <p>Code: {paperCode}</p>
          <p>Type: {paperType === 1 ? "Theory" : "Practical"}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setMarks({
              theoryMarks: "",
              internalMarks: "",
              practicalMarks: "",
            });
            setSuccess(false);
            setError(null);
          }}
          className={`p-2 rounded-lg hover:bg-opacity-80 ${
            theme === "dark"
              ? "bg-purple-600/20 text-purple-300"
              : "bg-blue-100 text-blue-600"
          }`}
          title="Clear marks"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {paperType === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block mb-2 ${textClass}`}>
                Theory Marks (Maximum: {maxMarks.theoryMax})
              </label>
              <input
                type="number"
                name="theoryMarks"
                value={marks.theoryMarks}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                placeholder="Enter theory marks"
                min="0"
                max={maxMarks.theoryMax}
              />
            </div>
            <div>
              <label className={`block mb-2 ${textClass}`}>
                Internal Marks (Maximum: {maxMarks.internalMax})
              </label>
              <input
                type="number"
                name="internalMarks"
                value={marks.internalMarks}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                placeholder="Enter internal marks"
                min="0"
                max={maxMarks.internalMax}
              />
            </div>
          </div>
        ) : (
          <div>
            <label className={`block mb-2 ${textClass}`}>
              Practical Marks (Maximum: {maxMarks.practicalMax})
            </label>
            <input
              type="number"
              name="practicalMarks"
              value={marks.practicalMarks}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
              placeholder="Enter practical marks"
              min="0"
              max={maxMarks.practicalMax}
            />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-red-500"
          >
            <FiAlertCircle />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-green-500"
          >
            <FiAlertCircle />
            <span>Marks saved successfully!</span>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            theme === "dark"
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } disabled:opacity-50`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FiSave />
              <span>Save Marks</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditMarks;
