import React from 'react';

const Papers = ({ papers, theme }) => {
    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border-r border-purple-500/20'
        : 'bg-white border-slate-200 shadow-lg';

    const textClass = theme === 'dark'
        ? 'text-white'
        : 'text-blue-900';

    const subTextClass = theme === 'dark'
        ? 'text-purple-300'
        : 'text-blue-600';

    return (
        <div className={`p-4 rounded-lg`}>
            <div className="grid grid-cols-2 gap-4">
                {papers.map((paper) => (
                    <div
                        key={paper.id}
                        className={`border rounded-lg p-4 ${cardClass} hover:scale-105 transition-transform duration-200`}
                    >
                        <p className={`font-medium ${textClass}`}>{paper.name}</p>
                        <p className={`text-sm ${subTextClass}`}>Code: {paper.code}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Papers;
