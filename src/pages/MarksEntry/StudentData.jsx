import React from 'react';
import PropTypes from 'prop-types';

const StudentData = ({ studentData, theme }) => {
    const textClass = theme === 'dark'
        ? 'text-white'
        : 'text-blue-900';

    const subTextClass = theme === 'dark'
        ? 'text-purple-300'
        : 'text-blue-600';

    const labelClass = theme === 'dark'
        ? 'text-purple-300'
        : 'text-blue-700';

    if (!studentData) {
        return (
            <div className={`text-center py-4 ${subTextClass}`}>
                No student data available
            </div>
        );
    }

    const fields = [
        { label: 'Name', value: studentData.name },
        { label: 'Roll Number', value: studentData.rollNo },
        { label: 'Group', value: studentData.group },
        { label: "Father's Name", value: studentData.fatherName },
        { label: "Mother's Name", value: studentData.motherName },
        { label: 'Institution', value: studentData.institution }
    ];

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={index} className="space-y-1">
                    <label className={`text-sm font-medium ${labelClass}`}>
                        {field.label}
                    </label>
                    <p className={`${textClass}`}>
                        {field.value || 'Not provided'}
                    </p>
                </div>
            ))}
        </div>
    );
};

StudentData.propTypes = {
    studentData: PropTypes.object,
    theme: PropTypes.string.isRequired,
};

export default StudentData;
