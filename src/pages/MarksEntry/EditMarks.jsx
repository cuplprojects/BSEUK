import React from 'react';

const EditMarks = ({ paperID, paperName, theme }) => {
    const textClass = theme === 'dark' ? 'text-purple-300' : 'text-blue-600';

    return (
        <div className="mt-4">
            <div className={textClass}>
                <p>Selected Paper Details:</p>
                <p>ID: {paperID}</p>
                <p>Name: {paperName}</p>
            </div>
        </div>
    );
};

export default EditMarks;