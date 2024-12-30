import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useThemeStore } from '../../../store/themeStore';
import API from '../../../services/api';

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
        groupId: "",  // Added groupId field
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
            groupId: "",  // Reset groupId
        });
    };

    const [semesters, setSemesters] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [groups, setGroups] = useState([]);
    // Theme classes
    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border-purple-500/20'
        : 'bg-white border-blue-200 shadow-sm';

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

        fetchSemesters();
        fetchSessions();
        fetchGroups();
    }, []);

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
                groupId: formData.groupId,  // Added groupId field
            });
            console.log("Success:", response.data);
            toast.success("Candidate added successfully!");
            clearFormData();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to add candidate");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 shadow-lg rounded-lg"
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
                                name="groupId"
                                value={formData.groupId}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                            >
                                <option value="">Select Group</option>
                                {groups.map(group => (
                                    <option key={group.groupId} value={group.groupId}>
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
                            <input
                                type="text"
                                name="institutionName"
                                value={formData.institutionName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                                placeholder="Enter institution name"
                            />
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
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                                placeholder="Enter Category"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                                Papers Opted
                            </label>
                            <input
                                type="text"
                                name="papersOpted"
                                value={formData.papersOpted}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border ${inputClass}`}
                                placeholder="Enter paper codes separated by commas"
                            />
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
