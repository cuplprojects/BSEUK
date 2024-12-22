import React from "react";

const Template = ({ data }) => {
  return (
    <div className="p-10 bg-white w-[210mm] h-[297mm] mx-auto border border-gray-300 relative">
      {/* Watermark */}
      <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] opacity-10">
        <img src={data.watermarkImage} alt="Watermark" className="w-full h-full object-contain" />
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-lg font-bold">उत्तराखण्ड विद्यालयी शिक्षा परिषद्</h1>
        <h1 className="text-lg font-bold">BOARD OF SCHOOL EDUCATION UTTARAKHAND</h1>
        <div className="flex justify-center my-2">
          <img src={data.headerImage} alt="Logo" className="w-16 h-16" />
        </div>
        <h2 className="text-md font-bold">प्रारंभिक शिक्षा में द्विवर्षीय डिप्लोमा</h2>
        <h2 className="text-md font-bold">TWO-YEAR DIPLOMA IN ELEMENTARY EDUCATION - 2023</h2>
        <h3 className="text-md mt-2">MARKS STATEMENT : FIRST SEMESTER</h3>
      </div>

      {/* Personal Information */}
      <div className="mt-4">
        <div className="flex justify-between">
          <div>
            <p><span className="font-bold">नाम:</span> {data.name}</p>
            <p><span className="font-bold">Mother's Name:</span> {data.mothersName}</p>
            <p><span className="font-bold">Father's Name:</span> {data.fathersName}</p>
          </div>
          <div>
            <p><span className="font-bold">अनुक्रमांक:</span> {data.rollNo}</p>
            <p><span className="font-bold">Class:</span> {data.class}</p>
            <p><span className="font-bold">Institution's Name:</span> {data.institutionName}</p>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <table className="table-auto border-collapse border border-gray-500 w-full mt-4 text-sm">
        <thead>
          <tr>
            <th className="border border-gray-500 px-2">प्रश्न पत्र कोड</th>
            <th className="border border-gray-500 px-2">प्रश्न पत्र का नाम</th>
            <th className="border border-gray-500 px-2">अधिकतम अंक</th>
            <th className="border border-gray-500 px-2">थ्योरी</th>
            <th className="border border-gray-500 px-2">प्रायोगिक</th>
            <th className="border border-gray-500 px-2">योग</th>
          </tr>
        </thead>
        <tbody>
          {data.marks.map((subject, index) => (
            <tr key={index}>
              <td className="border border-gray-500 px-2">{subject.code}</td>
              <td className="border border-gray-500 px-2">{subject.name}</td>
              <td className="border border-gray-500 px-2">{subject.maxMarks}</td>
              <td className="border border-gray-500 px-2">{subject.theory}</td>
              <td className="border border-gray-500 px-2">{subject.practical}</td>
              <td className="border border-gray-500 px-2">{subject.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="flex justify-between mt-8">
        <div>
          <p><span className="font-bold">Total Marks:</span> {data.totalMarks}</p>
          <p><span className="font-bold">Result:</span> {data.result}</p>
        </div>
        <div className="text-center">
          <p>हस्ताक्षर जांचकर्ता</p>
          <p>Signature</p>
        </div>
        <div className="text-center">
          <p>सील / मुहर</p>
          <p>Seal</p>
        </div>
      </div>
    </div>
  );
};

export default Template;
