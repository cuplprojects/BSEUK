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

  console.log(data.mark);

  // console.log("Overall Details", data.OverAllDetails);
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
    border: '1px solid #C00000',
    textAlign: 'center',
    padding: '4px 0px 12px 0px',
    backgroundColor: isPreview && !value ? '#fa968e' : 'transparent',
    fontWeight: "800",
    fontSize: "20px"
  });

  const renderTheoryRows = () => {
    return data.marks
      .filter((mark) => mark.type === 1)
      .map((mark, index) => (
        <tr key={index}>
          <td colSpan={mark.code === 1001 ? 2 : 0} style={{ border: '1px solid #C00000', textAlign: 'left', padding: '0px  0px 0px 5px', color: "#C00000", fontSize: "15px" }}>{mark.code === 1001 ? "" : String(mark.code).padStart(3, '0')} {mark.code === 1001 ? "" : "-"} {mark.name}</td>
          <td style={{ border: '1px solid #C00000', textAlign: 'center', padding: '0px  0px 12px 0px', color: "#C00000", fontSize: "1rem" }}>{mark.theoryMax}</td>
          <td style={getCellStyle(mark.theory)}>{mark.theory}</td>
          <td style={{ border: '1px solid #C00000', textAlign: 'center', padding: '0px  0px 12px 0px', color: "#C00000", fontSize: "1rem" }}>{mark.internalMax}</td>
          <td style={getCellStyle(mark.internal)}>{mark.internal}</td>
          <td style={{ border: '1px solid #C00000', textAlign: 'center', padding: '0px  0px 12px 0px', color: "#C00000", fontSize: "1rem" }}>{mark.maxMarks}</td>
          <td style={getCellStyle(mark.total)}>{mark.total}</td>
          <th className="text-center" style={{ borderRight: '2px solid #C00000',borderBottom :"1px solid #C00000",borderTop: index === 0 ? '1px solid #C00000' : '1px solid #C00000', padding: '4px 0px 12px 0px', fontSize: "1.5rem" }}>{isPassed ? "P" : "F"} </th>
        </tr>
      ));
  };

  const renderPracticalRows = () => {
    const practicalMarks = data.marks.filter((mark) => mark.type === 2);
    return practicalMarks.map((mark, index) => (
      <tr key={index} >
        <td colSpan="2" style={{ border: '1px solid #C00000', borderTop: index === 0 ? '2px solid #C00000' : '1px solid #C00000', textAlign: 'left', padding: '4px  0px 12px 12px', color: "#C00000", fontSize: "1rem" }}>{mark.name}</td>
        <td style={{ border: '1px solid #C00000', borderTop: index === 0 ? '2px solid #C00000' : '1px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', color: "#C00000", fontSize: "20px" }}>-</td>
        <td style={{ border: '1px solid #C00000', borderTop: index === 0 ? '2px solid #C00000' : '1px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', fontSize: "20px" }}>-</td>
        <td style={{ border: '1px solid #C00000', borderTop: index === 0 ? '2px solid #C00000' : '1px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', color: "#C00000", fontSize: "20px" }}>{mark.maxMarks}</td>
        <td style={{ ...getCellStyle(mark.practical), borderTop: index === 0 ? '2px solid #C00000' : '1px solid #C00000' }}>{mark.practical}</td>
        <td style={{ border: '1px solid #C00000', borderTop: index === 0 ? '2px solid #C00000' : '1px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', color: "#C00000", fontSize: "20px" }}>{mark.maxMarks}</td>
        <td style={{ ...getCellStyle(mark.practical), borderTop: index === 0 ? '2px solid #C00000' : '1px solid #C00000' }}>{mark.total}</td>
        <td style={{ borderBottom: '1px solid #C00000', borderRight:"2px solid #C00000",borderTop: index === 0 ? '2px solid #C00000' : '',  textAlign: 'center', padding: '4px  0px 12px 0px',fontSize:"20px" }}><b>{mark.pageremark === "उत्तीर्ण" ? "P" : "F"}</b></td>
      </tr>
    ));
  }

  const renderTotalResultRows = () => {
    const dataLength = data?.OverAllDetails.results.length;
    return data?.OverAllDetails.results.map((mark, index) => (
      <tr>
        <td style={{
          borderLeft: '2px solid #C00000',
          borderBottom: '1px solid #C00000',
          borderTop: index === 0 ? '' : '1px solid #C00000',
          textAlign: 'left',
          padding: "4px 0px 12px 12px",
          color: "#C00000"
        }}>
          {semesterIdHindi[`${mark?.semID}`]}
        </td>
        {/* ------------------------------------------------------ */}
        <td style={{ borderLeft: '2px solid #C00000', borderRight: '2px solid #C00000', borderBottom: '2px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', color: "#C00000", fontSize: "20px" }}>
          {mark.semID === 4 ? "-" : mark.totalTheoryMaxMarks + mark.totalInternalMaxMarks}
        </td>
        {/* ------------------------------------------------------ */}
        <td style={{ borderBottom: '2px solid #C00000', borderRight: '2px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', fontSize: "20px" }}>
          {mark.semID === 4 ? "-" : mark.totalTheoryMarks + mark.totalInternalMarks}
        </td>
        {/* ------------------------------------------------------ */}
        <td style={{ borderRight: '2px solid #C00000', borderBottom: '2px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', color: "#C00000", fontSize: "20px" }}>
          {mark.semID === 4 ? mark.overallTotalMaxMarks : mark.totalPracticalMaxMarks}
        </td>
        {/* ------------------------------------------------------ */}

        {/* ------------------------------------------------------ */}
        <td style={{ borderBottom: '2px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', fontSize: "20px" }}>{mark.semID === 4 ? mark.overallTotalMarks : mark.totalPracticalMarks}</td>
        {/* ------------------------------------------------------ */}
        <td style={{ borderLeft: '2px solid #C00000', borderBottom: '2px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', color: "#C00000", fontSize: "20px" }}>{mark.overallTotalMaxMarks}</td>
        {/* ------------------------------------------------------ */}

        {/* ------------------------------------------------------ */}
        <td style={{ borderLeft: '2px solid #C00000', borderBottom: '2px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', fontSize: "20px" }}>{mark.overallTotalMarks}</td>
        {/* ------------------------------------------------------ */}
        <td style={{ borderLeft: '2px solid #C00000', borderBottom: '2px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', fontSize: "20px" }}>{mark.status === "Pass" ? "PASS" : "FAIL"}</td>
        {/* ------------------------------------------------------ */}
        {index === 0 && (
          <td rowSpan={dataLength + 1} style={{ borderLeft: '2px solid #C00000', borderBottom: '2px solid #C00000', borderRight: '2px solid #C00000', textAlign: 'center', padding: '4px  0px 12px 0px', fontSize: '30px' }}>{mark.status === "Pass" ? (
            <>
              उत्तीर्ण <br /> {data.rank}
            </>
          ) : (
            "Incomplete"
          )}
          </td>
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
          backgroundSize: "500px 800px", // Custom width and height
          backgroundPosition: "center 45%",
          backgroundRepeat: "no-repeat",
          opacity: 0.2,
          zIndex: -1,
        }}
      />

      <div
        className="container border p-1  border-4 "
        style={{ width: "21cm", fontSize: "0.9rem", borderColor: "#C00000" }}
      >
        <div style={{ border: "3px solid #C00000", padding: "5px 4px 10px 4px" }}>
          <div>
            <b style={{ fontSize: "1.5rem" }}>
              {/* Sr. No.<span>{String(data.sno).padStart(3, "0")}</span> */}
              <span style={{ color: "#4F6228" }}>Sr. No.</span> <span>{data.awardsheetnumber}</span>
            </b>
          </div>
          <header className="text-center mb-3">
            <div>
              <h4
                className="text-danger"
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "0.3rem",
                  fontWeight: "bold",
                  color: "#4F6228"
                }}
              >
                <i>उत्तराखण्ड विद्यालयी शिक्षा परिषद्</i>
              </h4>
              <h4
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "0.2rem",
                  fontWeight: "bold",
                  color: "#4F6228"
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
                height: "180px",
                width: "120px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          </div>
          <div className="text-center mb-1">
            <h4
              style={{
                fontSize: "1.8rem",
                marginBottom: "",
                fontWeight: "bold",
                color: "#4F6228",
                fontFamily: "Times New Roman",
              }}
            >
              <i>प्रारम्भिक शिक्षा में द्विवर्षीय डिप्लोमा-{" "}
                20{data.entersession || data.session.split("-")[1]}</i>

            </h4>
            <h4
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                fontWeight: "bold",
                color: "#4F6228",
                fontFamily: "Times New Roman",
              }}
            >
              <i>TWO-YEAR DIPLOMA IN ELEMENTARY EDUCATION -{" "}
                20{data.entersession || data.session.split("-")[1]}</i>

            </h4>
          </div>
          <div className="text-center mb-3">
            <h5 style={{ fontSize: "1.5rem", marginBottom: "0.3rem", color: "#4F6228", fontFamily: "Times New Roman", }} className="fw-bold">
              <span>अंक विवरणिका :{" "}</span>
              <span id="sem-hindi">
                {semesterHindi[data.semester.toUpperCase()]}
              </span>
            </h5>
            <h5
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.3rem",
                fontWeight: "bold",
                textTransform: "upperCase",
                color: "#4F6228"
              }}
            >
              <u>MARKS STATEMENT : {data.semester}</u>
            </h5>
          </div>

          <section className="mb-4" >
            <div className="mb-3" style={{ display: "grid", gridTemplateColumns: " 2fr 1fr 1fr" }}>
              <div className="">
                <span style={{ color: "#C00000" }} className=""><b>नाम <br />Name</b>{" "}</span>
                <span className="ms-2" style={{ textTransform: "upperCase", fontSize: "1rem" }}>
                  <b>{data.name}</b>
                </span>
              </div>
              <div>
                <span style={{ color: "#C00000" }} ><b>अनुक्रमांक <br />Roll No.</b>{" "}</span>
                <span className="ms-2" style={{ textTransform: "upperCase", fontSize: "1rem" }}><b>{data.rollNo}</b></span>
              </div>
              <div>
                <span style={{ color: "#C00000" }} ><b>वर्ग<br />Group</b>{" "}</span>
                <span className="ms-2" style={{ textTransform: "upperCase", fontSize: "1rem" }}>
                  <b>{data.group}</b>
                </span>
              </div>
            </div>

            <div
              className="row mb-3"
              style={{ display: "grid", gridTemplateColumns: " 1fr 1fr " }}
            >
              <div style={{}}>
                <b style={{ color: "#C00000" }} >
                  माता का नाम <br />
                  Mother's Name
                </b>{" "}
                <span className="ms-2" style={{ textTransform: "upperCase", fontSize: "1rem" }}>
                  <b>{data.mothersName}</b>
                </span>
              </div>
              <div style={{}}>
                <b style={{ color: "#C00000" }} >
                  पिता का नाम <br />
                  Father's Name
                </b>{" "}
                <span className="ms-2" style={{ textTransform: "upperCase", fontSize: "1rem" }}>
                  <b>{data.fathersName}</b>
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <b style={{ color: "#C00000" }} >
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
            <table className="table-bordered" width="100%" style={{ borderCollapse: 'collapse', fontSize: "0.8rem", padding: "4px" }}>
              <thead>
                <tr style={{ borderTop: "2px solid #C00000", borderLeft: "2px solid #C00000" }}>
                  <td rowSpan="2" colSpan="2" className="text-center" style={{ border: "1px solid #C00000", borderLeft: "2px solid #C00000", padding: "4px 0px 12px 0px", color: "#C00000" }}>विषय / विद्यालय अनुभव  <br />SUBJECT / SCHOOL INTERNSHIP</td>
                  <td colSpan="2" className="text-center" style={{ padding: "4px 0px 12px 0px", border: "1px solid #C00000", color: "#C00000" }}>बाह्य आकलन</td>
                  <td colSpan="2" className="text-center" style={{ padding: "4px 0px 12px 0px", border: "1px solid #C00000", color: "#C00000" }}>आंतरिक आकलन</td>
                  <td rowSpan="2" className="text-center" style={{ padding: "4px 0px 12px 0px", border: "1px solid #C00000", color: "#C00000" }}>योग <br /> पूर्णांक</td>
                  <td rowSpan="2" className="text-center" style={{ padding: "4px 0px 12px 0px", border: "1px solid #C00000", color: "#C00000" }}>योग <br />प्राप्तांक</td>
                  <td rowSpan="2" className="text-center" style={{ padding: "4px 0px 12px 0px", borderTop: "1px solid #C00000", color: "#C00000", borderRight: '2px solid #C00000', borderBottom: '1px solid #C00000' }}>परीक्षाफल</td>
                </tr>
                <tr>
                  <td colSpan="" className="text-center" style={{ padding: "4px 0px 12px 0px", border: "1px solid #C00000", color: "#C00000" }}>अधिकतम <br /> अंक</td>
                  <td colSpan="" className="text-center" style={{ padding: "4px 0px 12px 0px", border: "1px solid #C00000", color: "#C00000" }}>प्राप्तांक</td>
                  <td colSpan="" className="text-center" style={{ padding: "4px 0px 12px 0px", border: "1px solid #C00000", color: "#C00000" }}>अधिकतम <br /> अंक</td>
                  <td colSpan="" className="text-center" style={{ padding: "4px 0px 12px 0px", border: "1px solid #C00000", color: "#C00000" }}>प्राप्तांक</td>
                </tr>
              </thead>
              <tbody>
                <td
                  rowSpan="7"
                  style={{
                    padding: '25px',
                    textAlign: 'center',
                    verticalAlign: 'middle', // Ensures proper alignment of content
                    position: 'relative', // Allows for better placement of rotated text
                    border: "1px solid #C00000"
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      transformOrigin: 'center',
                      whiteSpace: 'nowrap',
                      position: 'absolute',
                      top: '50%',
                      left: '40%',
                      transform: 'translate(-50%, -50%) rotate(-90deg)',
                      color: "#C00000",
                      fontWeight: "500",
                      fontSize: "1.2rem"
                    }}>
                    शिक्षण योजना निर्माण एवं <br /> शिक्षण
                  </span>
                </td>
                {renderTheoryRows()}
                {renderPracticalRows()}
              </tbody>
              <tr>
                <td colSpan="2" style={{ textAlign: 'left', padding: "4px 4px 12px 4px", color: "#C00000", borderRight: "1px solid #C00000", borderTop: "1px solid #C00000", borderLeft: "1px solid #C00000", borderBottom: "2px solid #C00000", fontSize: "1rem" }}>चतुर्थ सेमेस्टर के प्राप्तांकों का योग</td>
                <td style={{ border: "1px solid #C00000", borderBottom: "2px solid #C00000", textAlign: 'center', padding: "4px 0px 12px 0px", color: "#C00000", fontSize: "20px" }}>{totalTheoryMax}</td>
                <td style={{ border: "1px solid #C00000", borderBottom: "2px solid #C00000", textAlign: 'center', padding: "4px 0px 12px 0px", fontSize: "20px" }}>{data.totalExternalMarksObtained}</td>
                <td style={{ border: "1px solid #C00000", borderBottom: "2px solid #C00000", textAlign: 'center', padding: "4px 0px 12px 0px", color: "#C00000", fontSize: "20px" }}>{totalInternalMax + totalPracticalMax}</td>
                <td style={{ border: "1px solid #C00000", borderBottom: "2px solid #C00000", textAlign: 'center', padding: "4px 0px 12px 0px", fontSize: "20px" }}>{totalInternal + totalPractical}</td>
                <td style={{ border: "1px solid #C00000", borderBottom: "2px solid #C00000", textAlign: 'center', padding: "4px 0px 12px 0px", color: "#C00000", fontSize: "20px" }}>{totalInternalMax + totalPracticalMax + totalTheoryMax}</td>
                <td style={{ border: "1px solid #C00000", textAlign: 'center', fontWeight: 'bold', padding: "4px 0px 12px 0px", fontSize: "20px", borderBottom: "2px solid #C00000", }}>{data.totalMarks}</td>
                <td style={{ borderRight: "2px solid #C00000", borderBottom: "2px solid #C00000", textAlign: 'center', padding: "4px 0px 12px 0px" }}></td>
              </tr>
            </table>
            <div className="d-block" style={{ marginBottom: '12px', color: "#C00000", fontSize: "1rem" }}> सम्पूर्ण  परीक्षाफल - </div>
            {/* ------------------------------------------------------------------ */}
            <table className="table-bordered" style={{ borderCollapse: 'collapse', fontSize: "0.8rem", padding: "4px" }} width="100%">
              <thead>
                <tr>
                  <td rowSpan="2"
                    className="text-center"
                    style={{
                      borderTop: '2px solid #C00000',
                      borderLeft: '2px solid #C00000',
                      borderBottom: '2px solid #C00000',
                      padding: "4px 0px 12px 0px", color: "#C00000",
                      fontSize: "1rem"
                    }}>सेमेस्टर</td>

                  <td colSpan="2" className="text-center"
                    style={{
                      borderTop: '2px solid #C00000',
                      borderRight: '2px solid #C00000',
                      borderBottom: '2px solid #C00000',
                      borderLeft: '2px solid #C00000',
                      padding: "4px 0px 12px 0px",
                      color: "#C00000",
                      fontSize: "1rem"
                    }}>सैद्धान्तिक</td>

                  <td colSpan="2" className="text-center"
                    style={{
                      borderTop: '2px solid #C00000',
                      borderBottom: '2px solid #C00000',
                      padding: "4px 0px 12px 0px",
                      color: "#C00000",
                      fontSize: "1rem"
                    }}>क्रियात्मक / प्रयोगात्मक </td>

                  <td colSpan="2" className="text-center"
                    style={{
                      borderTop: '2px solid #C00000',
                      borderBottom: '2px solid #C00000',
                      borderLeft: '2px solid #C00000',
                      padding: "4px 0px 12px 0px",
                      color: "#C00000",
                      fontSize: "1rem"
                    }}>योग </td>

                  <td rowSpan="2" className="text-center"
                    style={{
                      borderTop: '2px solid #C00000',
                      borderBottom: '2px solid #C00000',
                      borderLeft: '2px solid #C00000',

                      padding: "4px 0px 12px 0px",
                      color: "#C00000",
                      fontSize: "1rem"
                    }}>परीक्षाफल </td>

                  <td rowSpan="2" colSpan="2" className="text-center"
                    style={{
                      border: '2px solid #C00000',
                      padding: "4px 0px 12px 0px",
                      color: "#C00000",
                      fontSize: "1rem"
                    }}>सम्पूर्ण  परीक्षाफल / श्रेणी </td>
                </tr>
                <tr>
                  <td colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', borderLeft: '2px solid #C00000', borderRight: '2px solid #C00000', padding: "4px 0px 12px 0px", color: "#C00000", fontSize: "1rem" }}>पूर्णांक</td>
                  <td colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', borderRight: '2px solid #C00000', padding: "4px 0px 12px 0px", color: "#C00000", fontSize: "1rem" }}>प्राप्तांक</td>
                  <td colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', borderRight: '2px solid #C00000', padding: "4px 0px 12px 0px", color: "#C00000", fontSize: "1rem" }}>पूर्णांक</td>
                  <td colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', padding: "4px 0px 12px 0px", color: "#C00000", fontSize: "1rem" }}>प्राप्तांक</td>
                  <td colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', borderLeft: '2px solid #C00000', padding: "4px 0px 12px 0px", color: "#C00000", fontSize: "1rem" }}>पूर्णांक</td>
                  <td colSpan="" className="text-center" style={{ borderBottom: '2pxsolid #C00000', borderLeft: '2px solid #C00000', borderBottom: '2px solid #C00000', padding: "4px 0px 12px 0px", color: "#C00000", fontSize: "1rem" }}>प्राप्तांक</td>
                </tr>
              </thead>
              <tbody>
                {renderTotalResultRows()}
                <tr>
                  <td colSpan="" className="text-left" style={{ borderBottom: '2px solid #C00000', borderTop: '1px solid #C00000', borderLeft: '2px solid #C00000', padding: '4px 0px 12px 12px', color: "#C00000", fontSize: "1rem" }}>महायोग </td>

                  <th colSpan="" className="text-center" style={{ padding: '4px 0px 12px 0px', color: "#C00000", fontSize: "20px", borderLeft: '2px solid #C00000', borderBottom: '2px solid #C00000', borderRight: '2px solid #C00000' }}>{data?.OverAllDetails.semMarks}</th>

                  <th colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', borderRight: '2px solid #C00000', padding: '4px 0px 12px 0px', fontSize: "20px" }}>{grandInternal} </th>
                  <th colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', borderRight: '2px solid #C00000', padding: '4px 0px 12px 0px', color: "#C00000", fontSize: "20px" }}>{data?.OverAllDetails.totalPracticalMarks} </th>
                  <th colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', padding: '4px 0px 12px 0px', fontSize: "20px" }}> {grandPractical}</th>
                  <th colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', borderLeft: '2px solid #C00000', padding: '4px 0px 12px 0px', color: "#C00000", fontSize: "20px" }}>{data?.OverAllDetails.total}</th>
                  <th colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', borderLeft: '2px solid #C00000', padding: '4px 0px 12px 0px', fontSize: "20px" }}> {grandTotal}</th>
                  <th colSpan="" className="text-center" style={{ borderBottom: '2px solid #C00000', borderLeft: '2px solid #C00000', padding: '4px 0px 12px 0px', fontSize: "20px" }}>{isPassed ? "PASS" : "FAIL"} </th>
                </tr>
              </tbody>
            </table>
            {/* ------------------------------------------------------------------ */}
          </div>

          <div className="footer " style={{ fontSize: "1rem" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', margin: "65px 10px 10px 10px", marginTop: "100px" }}>
              <div>
                <div style={{ color: "#C00000" }}>हस्ताक्षर जाँचकर्ता</div>
                <div style={{ color: "#C00000" }}>दिनांक -</div>
              </div>
              <div>
                <div style={{ color: "#C00000" }}>हस्ताक्षर प्राचार्य</div>
                <div style={{ color: "#C00000" }}>सील/मुहर</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate2;