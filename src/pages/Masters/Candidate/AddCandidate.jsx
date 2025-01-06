import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useThemeStore } from '../../../store/themeStore';
import API from '../../../services/api';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';

const AddCandidate = () => {
    const theme = useThemeStore((state) => state.theme);
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

    const clearFormData = () => {
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
    };

    const [semesters, setSemesters] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [categories, setCategories] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [availablePapers, setAvailablePapers] = useState([]);
    const [selectedPapers, setSelectedPapers] = useState([]);

    // Theme classes
    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
        : 'bg-white border-blue-200 shadow-xl border';

    const textClass = theme === 'dark'
        ? 'text-purple-100'
        : 'text-blue-700';

    const inputClass = theme === 'dark'
        ? 'bg-purple-900/20 border-purple-500/20 text-purple-100 placeholder-purple-400 [&>option]:bg-purple-900 [&>option]:text-purple-100'
        : 'bg-blue-50 border-blue-200 text-blue-600 placeholder-blue-400 [&>option]:bg-white [&>option]:text-blue-600';

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await API.get('Semesters');
                setSemesters(response.data);
            } catch (error) {
                console.error("Error fetching semesters:", error);
            }
        };

        const fetchSessions = async () => {
            try {
                const response = await API.get('Sessions');
                setSessions(response.data);
            } catch (error) {
                console.error("Error fetching sessions:", error);
            }
        };
        const fetchGroups = async () => {
            try {
                const response = await API.get('Groups');
                setGroups(response.data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await API.get('Categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchInstitutions = async () => {
            try {
                const response = await API.get('Institutes');
                setInstitutions(response.data);
            } catch (error) {
                console.error("Error fetching institutions:", error);
            }
        };

        const fetchPapers = async (semId) => {
            try {
                setAvailablePapers([]);
                const response = await API.get(`Papers/GetBySem/${semId}`);
                const papers = response.data.filter(paper => paper.paperCode != 0)
                setAvailablePapers(papers);
            } catch (error) {
                console.error("Error fetching papers:", error);
            }
        };

        // Clear selected papers when semester changes
        setSelectedPapers([]);
        setFormData(prev => ({
            ...prev,
            papersOpted: '' // Clear the papersOpted string
        }));

        if (formData.semID) {
            fetchPapers(formData.semID);
        } else {
            setAvailablePapers([]);
        }

        fetchSemesters();
        fetchSessions();
        fetchGroups();
        fetchCategories();
        fetchInstitutions();
    }, [formData.semID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('Candidates', {
                candidateID: formData.candidateID,
                candidateName: formData.candidateName,
                group: formData.group,
                rollNumber: formData.rollNumber,
                fName: formData.fName,
                mName: formData.mName,
                dob: formData.dob,
                institutionName: formData.institutionName,
                semID: formData.semID,
                sesID: formData.sesID,
                category: formData.category,
                papersOpted: formData.papersOpted,
            });
            toast.success("Candidate added successfully!");
            clearFormData();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to add candidate");
        }
    };

    const handlePaperSelect = (paper) => {
        if (!selectedPapers.find(p => p.paperCode === paper.paperCode)) {
            const newSelectedPapers = [...selectedPapers, paper];
            setSelectedPapers(newSelectedPapers);
            setFormData(prev => ({
                ...prev,
                papersOpted: newSelectedPapers.map(p => p.paperCode).join(',')
            }));
        }
    };

    const handleRemovePaper = (paperToRemove) => {
        const newSelectedPapers = selectedPapers.filter(
            paper => paper.paperCode !== paperToRemove.paperCode
        );
        setSelectedPapers(newSelectedPapers);
        setFormData(prev => ({
            ...prev,
            papersOpted: newSelectedPapers.map(p => p.paperCode).join(',')
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6  rounded-lg"
        >
            <div className={`rounded-lg ${cardClass} p-6 `}>
                <h2 className={`text-2xl font-bold mb-8 ${textClass}`}>
                    Add Candidate
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                                Candidate Name
                            </label>
                            <input
                                type="text"
                                name="candidateName"
                                value={formData.candidateName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                                placeholder="Enter candidate name"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                                Group
                            </label>
                            <select
                                name="group"
                                value={formData.group}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                            >
                                <option value="">Select Group</option>
                                {groups.map(group => (
                                    <option key={group.groupId} value={group.groupName}>
                                        {group.groupName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                                Roll Number
                            </label>
                            <input
                                type="text"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
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
                                Semester
                            </label>
                            <select
                                name="semID"
                                value={formData.semID}
                                onChange={handleChange}
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
                                Session
                            </label>
                            <select
                                name="sesID"
                                value={formData.sesID}
                                onChange={handleChange}
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
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.categoryId} value={category.categoryName}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                                Papers Opted
                            </label>
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-lg ${inputClass}">
                                    {selectedPapers.map((paper) => (
                                        <div
                                            key={paper.paperCode}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                                                theme === 'dark' 
                                                    ? 'bg-purple-700 text-purple-100' 
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}
                                        >
                                            <span className="text-sm">{paper.paperName} ({paper.paperCode})</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePaper(paper)}
                                                className="hover:opacity-75"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="relative">
                                    <div 
                                        className={`w-full px-4 py-2 rounded-lg border ${inputClass} max-h-60 overflow-y-auto`}
                                    >
                                        {!formData.semID ? (
                                            <p className={`text-sm ${
                                                theme === 'dark' ? 'text-purple-400' : 'text-blue-500'
                                            }`}>
                                                Please select a semester first to view available papers
                                            </p>
                                        ) : availablePapers.length === 0 ? (
                                            <p className={`text-sm ${
                                                theme === 'dark' ? 'text-purple-400' : 'text-blue-500'
                                            }`}>
                                                No papers available for this semester
                                            </p>
                                        ) : (
                                            <div className="space-y-1">
                                                {availablePapers.map((paper) => {
                                                    const isSelected = selectedPapers.some(p => p.paperCode === paper.paperCode);
                                                    return (
                                                        <div
                                                            key={paper.paperCode}
                                                            onClick={() => !isSelected && handlePaperSelect(paper)}
                                                            className={`px-2 py-1 rounded cursor-pointer flex items-center justify-between ${
                                                                theme === 'dark'
                                                                    ? 'hover:bg-purple-900/50'
                                                                    : 'hover:bg-blue-50'
                                                            }`}
                                                        >
                                                            <span>{paper.paperName} ({paper.paperCode})</span>
                                                            {isSelected && (
                                                                <CheckIcon className={`h-4 w-4 ${
                                                                    theme === 'dark' 
                                                                        ? 'text-purple-400' 
                                                                        : 'text-blue-500'
                                                                }`} />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={clearFormData}
                            className={`px-6 py-2 rounded-lg ${theme === 'dark'
                                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                : 'bg-gray-300 hover:bg-gray-400 text-black'
                                }`}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className={`px-6 py-2 rounded-lg ${theme === 'dark'
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            Add Candidate
                        </button>
                    </div>

                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} theme={theme} />
        </motion.div>
    );
};

export default AddCandidate;
