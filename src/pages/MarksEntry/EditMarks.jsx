import React from "react";

const EditMarks = ({ paperID, paperName, paperCode, theme }) => {
  const textClass = theme === "dark" ? "text-purple-300" : "text-blue-600";

  return (
    <div className="mt-4">
      <p className={`text-lg font-medium ${textClass}`}>Selected Paper Details:</p>
      <div className={textClass}>
        <p>ID: {paperID}</p>
        <p>Name: {paperName}</p>
        <p>Code: {paperCode}</p>
      </div>
    </div>
  );
};

export default EditMarks;
