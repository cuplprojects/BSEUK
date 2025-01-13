import React from "react";
import logo from "./../../assets/logo.png";
import "./Certificate.css";
import { useState } from "react";

const semesterHindi = {
  "FIRST SEMESTER": "प्रथम सेमेस्टर",
  "SECOND SEMESTER": "द्वितीय सेमेस्टर",
  "THIRD SEMESTER": "तृतीय सेमेस्टर",
  "FOURTH SEMESTER": "चतुर्थ सेमेस्टर",
};

const semesterIdHindi = {
  "1": "प्रथम सेमेस्टर",
  "2": "द्वितीय सेमेस्टर",
  "3": "तृतीय सेमेस्टर",
  "4": "चतुर्थ सेमेस्टर",
};


const Certificate2 = ({ data, isPreview }) => {

  console.log( data.mark);

  console.log("Overall Details", data.OverAllDetails);
  const totalTheoryMax = data.marks.reduce((acc, mark) => acc + mark.theoryMax, 0);
  const totalInternalMax = data.marks.reduce((acc, mark) => acc + mark.internalMax, 0);
  const totalPracticalMax = data.marks.filter((mark) => mark.type === 2).reduce((acc, mark) => acc + mark.maxMarks, 0);
  const totalInternal = data.marks.reduce((acc, mark) => acc + mark.internal, 0);
  const totalPractical = data.marks.reduce((acc, mark) => acc + mark.practical, 0);

  // Calculate grand total based on semID condition
  const grandInternal = data.OverAllDetails.results.reduce((acc, mark) => {
    if (mark.semID !== 4) {
      return acc + mark.totalTheoryMarks + mark.totalInternalMarks;
    }
    return acc;
  }, 0);

  const grandPractical = data.OverAllDetails.results.reduce((acc, mark) => {
    if (mark.semID === 4) {
      return acc + mark.overallTotalMarks;
    }
    return acc + mark.totalPracticalMarks;
  }, 0);
 
  const grandTotal = data.OverAllDetails.results.reduce((acc, mark) => {
    if (mark.semID === 4) {
      return acc + mark.overallTotalMarks;
    }
    return acc + mark.totalTheoryMarks + mark.totalInternalMarks + mark.totalPracticalMarks;
  }, 0);

  
  const getCellStyle = (value) => ({
    border: '1px solid black',
    textAlign: 'center',
    padding: '4px 0px 12px 0px',
    backgroundColor: isPreview && !value ? '#fa968e' : 'transparent',
  });

  const renderTheoryRows = () => {
    return data.marks
      .filter((mark) => mark.type === 1)
      .map((mark, index) => (
        <tr key={index}>

          <td colSpan={mark.code === 1001 ? 2 : 0} style={{ border: '1px solid black', textAlign: 'left', padding: '4px  0px 12px 5px' }}>{mark.code === 1001 ? "" : String(mark.code).padStart(3, '0')} {mark.code === 1001 ? "" : "-"} {mark.name}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.theoryMax}</td>
          <td style={getCellStyle(mark.theory)}>{mark.theory}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.internalMax}</td>
          <td style={getCellStyle(mark.internal)}>{mark.internal}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.maxMarks}</td>
          <td style={getCellStyle(mark.total)}>{mark.total}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.pageremark === "उत्तीर्ण" ? "P" : "F"}</td>
        </tr>
      ));
  };

  const renderPracticalRows = () => {
    const practicalMarks = data.marks.filter((mark) => mark.type === 2);
    return practicalMarks.map((mark, index) => (
      <tr key={index}>
        <td colSpan="2" style={{ border: '1px solid black', textAlign: 'left', padding: '4px  0px 12px 12px' }}>{mark.name}</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.maxMarks}</td>
        <td style={getCellStyle(mark.practical)}>{mark.practical}</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.maxMarks}</td>
        <td style={getCellStyle(mark.total)}>{mark.total}</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.pageremark === "उत्तीर्ण" ? "P" : "F"}</td>
      </tr>
    ));
  }

  const renderTotalResultRows = () => {
    const dataLength = data?.OverAllDetails.results.length;
    return data?.OverAllDetails.results.map((mark, index) => (
      <tr>
        <td style={{ border: '1px solid black', textAlign: 'left', padding: "4px 0px 12px 12px" }}>
          {semesterIdHindi[`${mark?.semID}`]}
        </td>
        {/* ------------------------------------------------------ */}
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>
          {mark.semID === 4 ? "-" : mark.totalTheoryMaxMarks + mark.totalInternalMaxMarks}
        </td>
        {/* ------------------------------------------------------ */}
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>
          {mark.semID === 4 ? "-" : mark.totalTheoryMarks + mark.totalInternalMarks}
        </td>
        {/* ------------------------------------------------------ */}
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>
          {mark.semID === 4 ? mark.overallTotalMaxMarks : mark.totalPracticalMaxMarks}
        </td>
        {/* ------------------------------------------------------ */}

        {/* ------------------------------------------------------ */}
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.semID === 4 ? mark.overallTotalMarks : mark.totalPracticalMarks}</td>
        {/* ------------------------------------------------------ */}
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.overallTotalMaxMarks}</td>
        {/* ------------------------------------------------------ */}

        {/* ------------------------------------------------------ */}
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.overallTotalMarks}</td>
        {/* ------------------------------------------------------ */}
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.status === "Pass" ? "P" : "F"}</td>
        {/* ------------------------------------------------------ */}
        {index === 0 && (
          <td rowSpan={dataLength + 1} style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px', fontSize: '30px' }}>{mark.status === "Pass" ? "उत्तीर्ण" : "Incomplete"}</td>
        )}
        {/* --------------------------------------------------------- */}
      </tr>
    ));
  };

  const semesterStatuses = data?.OverAllDetails?.results
    ?.slice(0, 4)
    ?.map(result => result?.status === "Pass" ? "P" : "F") || [];

  const isPassed = semesterStatuses.length === 4 &&
    semesterStatuses.every(status => status === "P") ? "P" : "F";

  return (
    <div className="p-4 " style={{ position: "relative", fontFamily: "Times New Roman, serif" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${logo})`,
          backgroundSize: "75%",
          backgroundPosition: "center 45%",
          backgroundRepeat: "no-repeat",
          opacity: 0.25,
          zIndex: -1,
        }}
      />

      <div
        className="container border p-1  border-4 border-black"
        style={{ width: "21cm", fontSize: "0.9rem" }}
      >
        <div style={{ border: "3px solid", padding: "5px 4px 10px 4px" }}>
          <div>
            <b style={{ fontSize: "1.1rem" }}>
              Sr. No.<span>{String(data.sno).padStart(3, "0")}</span>
            </b>
          </div>
          <header className="text-center mb-3">
            <div>
              <h4
                className="text-danger"
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "0.3rem",
                  fontWeight: "bold",
                }}
              >
                उत्तराखण्ड विद्यालयी शिक्षा परिषद्
              </h4>
              <h4
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "0.3rem",
                  fontWeight: "bold",
                }}
              >
                BOARD OF SCHOOL EDUCATION UTTARAKHAND
              </h4>
            </div>
          </header>
          <div className="text-center mb-">
            <img
              src={logo}
              alt="Logo"
              className="logo"
              style={{
                height: "120px",
                width: "120px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          </div>
          <div className="text-center mb-3">
            <h4
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.3rem",
                fontWeight: "bold",
              }}
            >
              प्रारम्भिक शिक्षा में द्विवर्षीय डिप्लोमा
            </h4>
            <h4
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.3rem",
                fontWeight: "bold",
              }}
            >
              TWO-YEAR DIPLOMA IN ELEMENTARY EDUCATION -{" "}
              {data.entersession || data.session.split("-")[0]}
            </h4>
          </div>
          <div className="text-center mb-3">
            <h5 style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>
              अंक विवरणिका :{" "}
              <span id="sem-hindi">
                {semesterHindi[data.semester.toUpperCase()]}
              </span>
            </h5>
            <h5
              style={{
                fontSize: "1.2rem",
                marginBottom: "0.3rem",
                fontWeight: "bold",
                textTransform: "upperCase",
              }}
            >
              <u>MARKS STATEMENT : {data.semester}</u>
            </h5>
          </div>

          <section className="mb-4">
            <div className="mb-3" style={{ display: "grid", gridTemplateColumns: " 2fr 1fr 1fr" }}>
              <div className="">
                <b>नाम <br />Name</b>{" "}
                <span className="ms-2" style={{ textTransform: "upperCase" }}>
                  <b>{data.name}</b>
                </span>
              </div>
              <div><b>अनुक्रमांक <br />Roll No.</b>{" "}
                <span className="ms-2"><b>{data.rollNo}</b></span>
              </div>
              <div><b>वर्ग<br />Group</b>{" "}
                <span className="ms-2">
                  <b>{data.group}</b>
                </span>
              </div>
            </div>

            <div
              className="row mb-3"
              style={{ display: "grid", gridTemplateColumns: " 1fr 1fr " }}
            >
              <div style={{}}>
                <b>
                  माता का नाम <br />
                  Mother's Name
                </b>{" "}
                <span className="ms-2" style={{ textTransform: "upperCase" }}>
                  <b>{data.mothersName}</b>
                </span>
              </div>
              <div style={{}}>
                <b>
                  पिता का नाम <br />
                  Father's Name
                </b>{" "}
                <span className="ms-2" style={{ textTransform: "upperCase" }}>
                  <b>{data.fathersName}</b>
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <b>
                  संस्थान का नाम <br />
                  Institution's Name
                </b>{" "}
                <span className="ms-2" style={{ textTransform: "upperCase" }}>
                  <b>{data.institutionName}</b>
                </span>
              </div>
            </div>
          </section>

          <div className="responsive" >
            <table border="2" className="table-bordered" width="100%" style={{ borderCollapse: 'collapse', fontSize: "0.8rem", padding: "4px" }}>
              <thead>
                <tr>
                  <th rowSpan="2" colSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>विषय / विद्यालय अनुभव <br />Subject / School Internship</th>
                  <th colSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>बाह्य आकलन</th>
                  <th colSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>आंतरिक आकालन</th>
                  <th rowSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>योग पूर्णांक</th>
                  <th rowSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>योग प्राप्तांक</th>
                  <th rowSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>परीक्षाफल</th>
                </tr>
                <tr>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>अधिकतम अंक</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>प्राप्तांक</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>अधिकतम अंक</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>प्राप्तांक</th>
                </tr>
              </thead>
              <tbody>
                <td
                  rowSpan="7"
                  style={{
                    border: '1px solid black',
                    padding: '25px',
                    textAlign: 'center',
                    verticalAlign: 'middle', // Ensures proper alignment of content
                    position: 'relative', // Allows for better placement of rotated text
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      transformOrigin: 'center',
                      whiteSpace: 'nowrap',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-90deg)',
                    }}>
                    शिक्षण योजना निर्माण एवं <br /> शिक्षण
                  </span>
                </td>
                {renderTheoryRows()}
                {renderPracticalRows()}
              </tbody>
              <tr>
                <td colSpan="2" style={{ border: '1px solid black', textAlign: 'left', fontWeight: 'bold', padding: "4px 4px 12px 4px" }}><b>चतुर्थ सेमेस्टर के प्राप्तांकों का योग</b></td>
                <td style={{ border: '1px solid black', textAlign: 'center', padding: "4px 0px 12px 0px" }}>{totalTheoryMax}</td>
                <td style={{ border: '1px solid black', textAlign: 'center', padding: "4px 0px 12px 0px" }}>{data.totalExternalMarksObtained}</td>
                <td style={{ border: '1px solid black', textAlign: 'center', padding: "4px 0px 12px 0px" }}>{totalInternalMax + totalPracticalMax}</td>
                <td style={{ border: '1px solid black', textAlign: 'center', padding: "4px 0px 12px 0px" }}>{totalInternal + totalPractical}</td>
                <td style={{ border: '1px solid black', textAlign: 'center', padding: "4px 0px 12px 0px" }}>{totalInternalMax + totalPracticalMax + totalTheoryMax}</td>
                <td style={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold', padding: "4px 0px 12px 0px" }}>{data.totalMarks}</td>
                <td style={{ border: '1px solid black', textAlign: 'center', padding: "4px 0px 12px 0px" }}></td>
              </tr>
            </table>
            <div className="d-block" style={{ marginBottom: '12px' }}> <b>सम्पूर्ण  परीक्षाफल - </b> </div>
            {/* ------------------------------------------------------------------ */}
            <table border="2" className="table-bordered" style={{ borderCollapse: 'collapse', fontSize: "0.8rem", padding: "4px" }} width="100%">
              <thead>
                <tr>
                  <th rowSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>सेमेस्टर</th>
                  <th colSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>सैद्धांतिक </th>
                  <th colSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>क्रियात्मक / प्रयोगात्मक </th>
                  <th colSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>योग </th>
                  <th rowSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>परीक्षाफल </th>
                  <th rowSpan="2" colSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>सम्पूर्ण  परीक्षाफल / श्रेणी </th>
                </tr>
                <tr>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>पूर्णांक</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>प्राप्तांक</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>पूर्णांक</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>प्राप्तांक</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>पूर्णांक</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: "4px 0px 12px 0px" }}>प्राप्तांक</th>
                </tr>
              </thead>
              <tbody>
                {renderTotalResultRows()}
                <tr>
                  <th colSpan="" className="text-left" style={{ border: '1px solid black', padding: '4px 0px 12px 12px' }}>महायोग </th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: '4px 0px 12px 0px' }}>{data?.OverAllDetails.semMarks}</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: '4px 0px 12px 0px' }}>{grandInternal} </th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: '4px 0px 12px 0px' }}>{data?.OverAllDetails.totalPracticalMarks} </th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: '4px 0px 12px 0px' }}> {grandPractical}</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: '4px 0px 12px 0px' }}>{data?.OverAllDetails.total}</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: '4px 0px 12px 0px' }}> {grandTotal}</th>
                  <th colSpan="" className="text-center" style={{ border: '1px solid black', padding: '4px 0px 12px 0px' }}>{isPassed ? "P" : "F"} </th>
                </tr>
              </tbody>
            </table>
            {/* ------------------------------------------------------------------ */}
          </div>

          <div className="footer mt-3" style={{ fontSize: "0.9rem" }}>
            {/* <div>
            परीक्षाफल - <span id="re"><b>{data.result}</b></span>
          </div> */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', margin: "25px 10px 0px 10px" }}>
              <div>
                <div>हस्ताक्षर जाँचकर्ता</div>
                <div>दिनांक -</div>
              </div>
              <div>
                <div>हस्ताक्षर प्राचार्य</div>
                <div>सील/मुहर</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate2;