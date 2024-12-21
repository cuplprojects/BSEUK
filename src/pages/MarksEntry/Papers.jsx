import React from 'react';

const Papers = ({ papers = [], theme }) => {
    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border-r border-purple-500/20'
        : 'bg-white border-slate-200 shadow-lg';
    const textClass = theme === 'dark' ? 'text-white' : 'text-blue-900';

    if (!Array.isArray(papers) || papers.length === 0) {
        return (
            <div className={`p-4 rounded-lg ${textClass}`}>
                {papers ? 'No papers found for this semester' : 'No papers data available'}
            </div>
        );
    }

    return (
        <div className="p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {papers.map(({ paperID, paperName, paperCode, paperTypee }) => (
                    <div
                        key={paperID}
                        className={`border rounded-lg p-4 ${cardClass} hover:scale-105 transition-transform duration-200`}
                    >
                        <p className={`font-medium ${textClass}`}>{paperName || 'Unknown Paper'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Papers;
