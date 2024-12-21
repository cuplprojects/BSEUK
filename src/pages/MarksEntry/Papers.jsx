import React from 'react';

const Papers = ({ papers = [], theme }) => {
    const cardClass = theme === 'dark'
        ? 'bg-black/40 backdrop-blur-xl border-r border-purple-500/20'
        : 'bg-white border-slate-200 shadow-lg';

    const textClass = theme === 'dark'
        ? 'text-white'
        : 'text-blue-900';

    const subTextClass = theme === 'dark'
        ? 'text-purple-300'
        : 'text-blue-600';

    if (!Array.isArray(papers)) {
        return (
            <div className={`p-4 rounded-lg ${textClass}`}>
                No papers data available
            </div>
        );
    }

    if (papers.length === 0) {
        return (
            <div className={`p-4 rounded-lg ${textClass}`}>
                No papers found for this semester
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-lg`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {papers.map((paper) => {
                    const paperId = paper.paperID || paper.PaperID;
                    const paperName = paper.paperName || paper.PaperName;
                    const paperCode = paper.paperCode || paper.PaperCode;
                    const paperType = paper.paperTypee || paper.PaperTypee || 'Unknown Type';

                    return (
                        <div
                            key={paperId}
                            className={`border rounded-lg p-4 ${cardClass} hover:scale-105 transition-transform duration-200`}
                        >
                            <p className={`font-medium ${textClass}`}>{paperName}</p>
                            
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Papers;
