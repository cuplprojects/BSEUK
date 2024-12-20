import React from 'react';
import PropTypes from 'prop-types';

const StudentData = ({
    candidateID,
    candidateName,
    group,
    rollNumber,
    fName,
    mName,
    dob,
    institutionName,
    semID,
    sesID,
}) => {
    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Candidate Details</h3>
            <div className="space-y-2">
                <p><strong>Candidate ID:</strong> {candidateID}</p>
                <p><strong>Name:</strong> {candidateName}</p>
                <p><strong>Group:</strong> {group}</p>
                <p><strong>Roll Number:</strong> {rollNumber}</p>
                <p><strong>Father's Name:</strong> {fName}</p>
                <p><strong>Mother's Name:</strong> {mName}</p>
                <p><strong>Date of Birth:</strong> {dob}</p>
                <p><strong>Institution:</strong> {institutionName}</p>
                <p><strong>Semester:</strong> {semID}</p>
                <p><strong>Session:</strong> {sesID}</p>
            </div>
        </div>
    );
};

StudentData.propTypes = {
    candidateID: PropTypes.number.isRequired,
    candidateName: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    rollNumber: PropTypes.string.isRequired,
    fName: PropTypes.string.isRequired,
    mName: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    institutionName: PropTypes.string.isRequired,
    semID: PropTypes.number.isRequired,
    sesID: PropTypes.number.isRequired,
};

export default StudentData;
