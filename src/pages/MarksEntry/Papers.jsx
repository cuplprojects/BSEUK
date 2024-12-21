import React from 'react';

const Papers = ({ papers = [], theme, onSelectPaper }) => {
    const cardClass =
        theme === 'dark'
            ? 'bg-black/40 backdrop-blur-xl border-r border-purple-500/20'
            : 'bg-white border-slate-200 shadow-lg';
    const textClass = theme === 'dark' ? 'text-white' : 'text-blue-900';

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

    // Filter papers by paperType (1: Papers, 2: Practicals)
    const papersSection = papers.filter((paper) => paper.paperType === 1);
    const practicalsSection = papers.filter((paper) => paper.paperType === 2);

    return (
        <div className="p-4">
            {/* Papers Section */}
            {papersSection.length > 0 && (
                <div className="mb-6">
                    <h3 className={`text-2xl font-semibold ${textClass} mb-4`}>
                        Papers
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {papersSection.map((paper) => {
                            const paperId = paper.paperID || paper.PaperID;
                            const paperName = paper.paperName || paper.PaperName;
                            const paperCode = paper.paperCode || paper.PaperCode;
                            const paperType = paper.paperType || paper.PaperType;

                            return (
                                <div
                                    key={paperId}
                                    className={`border rounded-lg p-3 ${cardClass} hover:scale-105 transition-transform duration-200 w-full sm:w-1/2 lg:w-1/3 xl:w-1/6`}
                                    onClick={() => onSelectPaper(paper)} // Trigger onSelectPaper when a paper is clicked
                                >
                                    <p className={`text-base font-semibold ${textClass}`}>
                                        {paperName}
                                    </p>
                                    {/* <p className={`text-sm ${textClass}`}>
                                        {paperType}
                                    </p> */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Practicals Section */}
            {practicalsSection.length > 0 && (
                <div>
                    <h3 className={`text-2xl font-semibold ${textClass} mb-4`}>
                        Practicals
                    </h3>
                    <div className="flex flex-wrap gap-4 ">
                        {practicalsSection.map((paper) => {
                            const paperId = paper.paperID || paper.PaperID;
                            const paperName = paper.paperName || paper.PaperName;
                            const paperCode = paper.paperCode || paper.PaperCode;

                            return (
                                <div
                                    key={paperId}
                                    className={`border rounded-lg p-3 ${cardClass} hover:scale-105 transition-transform duration-200 w-full sm:w-1/2 lg:w-1/3 xl:w-1/6`}
                                    onClick={() => onSelectPaper(paper)} // Trigger onSelectPaper when a paper is clicked
                                >
                                    <p className={`text-base font-semibold ${textClass}`}>
                                        {paperName}
                                    </p>
                                    {/* <p className={`text-sm ${textClass}`}>
                                        {paperCode}
                                    </p> */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Papers;
