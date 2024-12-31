import React from 'react';
import PropTypes from 'prop-types';

const StudentData = ({ studentData, sessionName, semesterName, theme }) => {
    const textClass = theme === 'dark'
        ? 'text-white'
        : 'text-blue-900';

    const labelClass = theme === 'dark'
        ? 'text-purple-300'
        : 'text-blue-700';

    if (!studentData) {
        return null;
    }

    const fields = [
        { label: 'Name', value: studentData.candidateName },
        { label: 'Roll Number', value: studentData.rollNumber },
        { label: 'Group', value: studentData.group },
        { label: "Father's Name", value: studentData.fName },
        { label: "Mother's Name", value: studentData.mName },
        { label: 'Date of Birth', value: studentData.dob },
        { label: 'Institution', value: studentData.institutionName },
        { label: 'Session', value: sessionName },
        { label: 'Semester', value: semesterName },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {fields.map((field, index) => (
                <div 
                    key={index} 
                    className={`${
                        // Make certain fields span full width
                        (field.label === 'Name' || 
                         field.label === "Father's Name" ||
                         field.label === "Mother's Name" || 
                         field.label === 'Institution') 
                            ? 'col-span-full' 
                            : ''
                    }`}
                >
                    <div className="flex flex-col">
                        <label className={`text-xs font-medium ${labelClass}`}>
                            {field.label}
                        </label>
                        <p className={`${textClass} text-sm font-medium truncate`}>
                            {field.value || 'Not provided'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

StudentData.propTypes = {
    studentData: PropTypes.shape({
        candidateName: PropTypes.string,
        rollNumber: PropTypes.string,
        group: PropTypes.string,
        fName: PropTypes.string,
        mName: PropTypes.string,
        dob: PropTypes.string,
        institutionName: PropTypes.string,
        semID: PropTypes.number,
        sesID: PropTypes.number,
    }),
    sessionName: PropTypes.string,
    semesterName: PropTypes.string,
    theme: PropTypes.string.isRequired,
};

export default StudentData;
