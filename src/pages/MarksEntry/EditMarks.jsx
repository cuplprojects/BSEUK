import React from "react";

const EditMarks = ({ paperID, paperName, paperCode,paperType , theme }) => {
  const textClass = theme === "dark" ? "text-purple-300" : "text-blue-600";

  return (
    <div className="mt-4">
      <p className={`text-xl font-bold ${textClass}`}>Selected Paper Details:</p>
      <div className={`${textClass} font-bold`}>
        <p>ID: {paperID ? paperID : "Unavailable"}</p>
        <p>Name: {paperName ? paperName : "Unavailable"}</p>
        <p>Code: {paperCode ? paperCode : "Unavailable"}</p>
        <p>Type: {paperType ? paperType : "Unavailable"}</p>
      </div>
    </div>
  );
};

export default EditMarks;
