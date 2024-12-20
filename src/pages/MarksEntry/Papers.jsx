import React from 'react';

const Papers = () => {
    // Hardcoded papers data for now
    const papers = [
        { id: 1, name: 'Mathematics', code: 'MATH101' },
        { id: 2, name: 'Physics', code: 'PHYS101' },
        { id: 3, name: 'Chemistry', code: 'CHEM101' },
        { id: 4, name: 'Biology', code: 'BIO101' },
    ];

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Assigned Papers</h3>
            <div className="grid grid-cols-2 gap-4">
                {papers.map((paper) => (
                    <div
                        key={paper.id}
                        className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                        <p className="font-medium text-gray-700">{paper.name}</p>
                        <p className="text-sm text-gray-500">Code: {paper.code}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Papers;
