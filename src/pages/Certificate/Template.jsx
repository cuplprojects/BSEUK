import React from "react";
import logo from "./../../assets/logo.png";
import data from "./data.json";
import "./Certificate.css";

const semesterHindi = {
  "FIRST SEMESTER": "प्रथम सेमेस्टर",
  "SECOND SEMESTER": "द्वितीय सेमेस्टर",
  "THIRD SEMESTER": "तृतीय सेमेस्टर",
  "FOURTH SEMESTER": "चतुर्थ सेमेस्टर",
};

const paperType2Count = data.result.marks.filter((mark) => mark.paperType === 2).length;
console.log("Count of paperType === 2:", paperType2Count);


const Certificate = () => {
  const renderTheoryRows = () => {
    return data.result.marks
      .filter((mark) => mark.paperType === 1) // Filter for theory papers
      .map((mark, index) => (
        <tr key={index}>
          <td>{mark.paperid}</td>
          <td>{mark.paperName}</td>
          <td>{mark.maxMarks}</td>
          <td>{mark.internalMarks}</td>
          <td>{mark.internalMarksObtained}</td>
          <td>{mark.externalMarks}</td>
          <td>{mark.externalMarksObtained}</td>
          <td colSpan="2">_</td>
          <td colSpan="2">_</td>
          <td>{mark.totalMarksObtained}</td>
        </tr>
      ));
  };

  const renderPracticalRows = () => {
    const practicalMarks = data.result.marks.filter((mark) => mark.paperType === 2); // Filter for practical papers
    return practicalMarks.map((mark, index) => (
      <tr key={index}>
        {index === 0 && (
          <td rowSpan={practicalMarks.length} className="text-center">
            अभ्यास क्रम
          </td>
        )}
        <td>{mark.paperName}</td>
        <td>{mark.maxMarks}</td>
        <td>_</td>
        <td>_</td>
        <td>_</td>
        <td>_</td>
        <td colSpan="2">{mark.maxMarks}</td>
        <td colSpan="2">{mark.marksObtained}</td>
        <td>{mark.totalMarksObtained}</td>
      </tr>
    ));
  };


  return (
    <div className="p-4 outer-border">
      <div className="container border border-5 p-4" style={{ width: "21cm", height: "29.7cm" }}>
        <header className="text-center mb-4">
          <div className="d-flex justify-content-start">
            <b>Sr. No.<span>001</span></b>
          </div>
          <div>
            <h4>उत्‍तराखण्‍ड विद्यालयी शिक्षा परिषद</h4>
            <h4>BOARD OF SCHOOL EDUCATION UTTARAKHAND</h4>
          </div>
        </header>

        <div className="text-center mb-3">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="text-center mb-4">
          <h4>उत्‍तराखण्‍ड विद्यालयी शिक्षा परिषद</h4>
          <h4>
            TWO-YEAR DIPLOMA IN ELEMENTARY EDUCATION - {data.session}
          </h4>
        </div>

        <div className="text-center mb-4">
          <h5>अंक विवरण : <span id="sem-hindi">
            <span id="sem-hindi">{semesterHindi[data.sem.toUpperCase()]}</span>
          </span></h5>
          <h5>
            <u>MARKS STATEMENT : <span id="sem-english">{data.sem}</span></u>
          </h5>
        </div>

        <section className="mb-4">
          <div className="row mb-3">
            <div className="col-md-4">
              <b>नाम / Name:</b>
              <span className="ms-2">{data.name}</span>
            </div>
            <div className="col-md-4">
              <b>अनुक्रमांक / Roll No.:</b>
              <span className="ms-2">{data.rollNo}</span>
            </div>
            <div className="col-md-4">
              <b>वर्ग / Group:</b>
              <span className="ms-2">{data.group}</span>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <b>माता का नाम / Mother's Name:</b>
              <span className="ms-2">{data.mName}</span>
            </div>
            <div className="col-md-6">
              <b>पिता का नाम / Father's Name:</b>
              <span className="ms-2">{data.fName}</span>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <b>संस्थान का नाम / Institution's Name:</b>
              <span className="ms-2">{data.institutionName}</span>
            </div>
          </div>
        </section>

        <div className="reponsive">
          <table border="2" cellPadding="3px" className="table-bordered">
            <thead>
              <tr>
                <th rowSpan="3" className="text-center">प्रश्न पत्र कोड</th>
                <th rowSpan="3" className="text-center">प्रश्न पत्र का नाम</th>
                <th rowSpan="3" className="text-center">अधिकतम अंक</th>
                <th colSpan="4" className="text-center">सैद्धांतिक</th>
                <th colSpan="4" className="text-center">क्रियात्मक / प्रयोगात्मक</th>
                <th rowSpan="3" className="text-center">योग</th>
              </tr>
              <tr>
                <th colSpan="2" className="text-center">बाह्य</th>
                <th colSpan="2" className="text-center">आंतरिक</th>
                <th colSpan="2" className="text-center">पूर्णांक</th>
                <th colSpan="2" className="text-center">प्राप्तांक</th>
              </tr>
            </thead>
            <tbody>
              {renderTheoryRows()}
              {renderPracticalRows()}
              <tr>
                <td colSpan="2" className="text-start"><b>योग (Total)</b></td>
                <td>{data.result.totalMaxMarks}</td>
                <td>{data.result.TotalInternalMaxMarks}</td>
                <td>{data.result.TotalInternalMarksObtained}</td>
                <td>{data.result.TotalExternalMaxMarks}</td>
                <td>{data.result.TotalExternalMarksObtained}</td>
                <td colSpan="2">{data.result.TotalPracticalMaxMarks}</td>
                <td colSpan="2">{data.result.TotalPracticalMarksObtained}</td>
                <td><b>{data.result.totalMarksObtained}</b></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="footer">
          <div class="d-flex justify-content-start mt-2">परीक्षाफल - <span id="re"><b>{data.result.remark}</b></span></div>
          <div class="d-flex justify-content-between mt-5">
            <div class="left-box">
              <div class="signature-checker">
                हस्ताक्षर ज़ाँचकार्ता <span></span>
              </div>
              <div class="date">
                दिनांक -
              </div>
            </div>
            <div class="right-box d-flex flex-column align-items-center">
              <div class="signature-principal">
                हस्ताक्षर प्रचार्य
              </div>
              <div class="seal">
                सील/मोहर
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Certificate;
