import React from "react";

const Certificate = ({ data }) => {
  return (
    <div style={{ width: "210mm", height: "297mm", margin: "0 auto", padding: "20px", border: "1px solid black" }}>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <h1>उत्तराखण्ड विद्यालयी शिक्षा परिषद्</h1>
        <h1>BOARD OF SCHOOL EDUCATION UTTARAKHAND</h1>
        <img src={data.headerImage} alt="Logo" style={{ width: "60px", height: "60px", margin: "10px auto" }} />
        <h2>प्रारंभिक शिक्षा में द्विवर्षीय डिप्लोमा</h2>
        <h2>TWO-YEAR DIPLOMA IN ELEMENTARY EDUCATION - 2023</h2>
        <h3>MARKS STATEMENT : FIRST SEMESTER</h3>
      </div>

      {/* Student Info */}
      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td>नाम (Name):</td>
            <td style={{ borderBottom: "1px solid black" }}>{data.name}</td>
            <td>अनुक्रमांक (Roll No.):</td>
            <td style={{ borderBottom: "1px solid black" }}>{data.rollNo}</td>
          </tr>
          <tr>
            <td>माता का नाम (Mother's Name):</td>
            <td style={{ borderBottom: "1px solid black" }}>{data.mothersName}</td>
            <td>Class:</td>
            <td style={{ borderBottom: "1px solid black" }}>{data.class}</td>
          </tr>
          <tr>
            <td>पिता का नाम (Father's Name):</td>
            <td style={{ borderBottom: "1px solid black" }}>{data.fathersName}</td>
            <td>Institution's Name:</td>
            <td style={{ borderBottom: "1px solid black" }}>{data.institutionName}</td>
          </tr>
        </tbody>
      </table>

      {/* Marks Table */}
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", textAlign: "center" }}>प्रश्न पत्र कोड</th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>प्रश्न पत्र का नाम</th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>अधिकतम अंक</th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>थ्योरी</th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>प्रायोगिक</th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>आंतरिक</th>
            <th style={{ border: "1px solid black", textAlign: "center" }}>योग</th>
          </tr>
        </thead>
        <tbody>
          {data.marks.map((subject, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", textAlign: "center" }}>{subject.code}</td>
              <td style={{ border: "1px solid black", textAlign: "center" }}>{subject.name}</td>
              <td style={{ border: "1px solid black", textAlign: "center" }}>{subject.maxMarks}</td>
              <td style={{ border: "1px solid black", textAlign: "center" }}>{subject.theory}</td>
              <td style={{ border: "1px solid black", textAlign: "center" }}>{subject.practical}</td>
              <td style={{ border: "1px solid black", textAlign: "center" }}>{subject.internal}</td>
              <td style={{ border: "1px solid black", textAlign: "center" }}>{subject.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ marginTop: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td>योग (TOTAL):</td>
              <td>{data.totalMarks}</td>
              <td>परीक्षा फल (Result):</td>
              <td>{data.result}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <div style={{ display: "inline-block", marginRight: "50px" }}>
          <p>हस्ताक्षर जांचकर्ता</p>
          <p>Signature</p>
        </div>
        <div style={{ display: "inline-block" }}>
          <p>सील / मुहर</p>
          <p>Seal</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
