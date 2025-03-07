import React from "react";
import logo from "./../../assets/logo.png";
import "./Certificate.css";

const semesterHindi = {
  "FIRST SEMESTER": "प्रथम सेमेस्टर",
  "SECOND SEMESTER": "द्वितीय सेमेस्टर",
  "THIRD SEMESTER": "तृतीय सेमेस्टर",
  "FOURTH SEMESTER": "चतुर्थ सेमेस्टर",
};

const Certificate2 = ({ data, isPreview }) => {
  const paperType2Count = data?.marks.filter((mark) => mark.paperType === 2).length;
  const getCellStyle = (value) => ({
    border: '1px solid black',
    textAlign: 'left',
    padding: '4px 0px 12px 2px',
    backgroundColor: isPreview && !value ? '#fa968e' : 'transparent',
  });

  console.log(data.marks);
  const totalTheoryMax = data.marks.reduce((acc, mark) => acc + mark.theory, 0);
  const totalInternalMax = data.marks.reduce((acc, mark) => acc + mark.internal, 0);
  const practicalMax = data.marks.reduce((acc, mark) => acc + mark.practical, 0);


  const renderTheoryRows = () => {
    return data.marks
      .filter((mark) => mark.type === 1)
      .map((mark, index) => (
        <tr key={index}>
          <td style={getCellStyle(mark.code)}><center><b>{String(mark.code).padStart(3, '0')}</b></center></td>
          <td style={getCellStyle(mark.name)}>{mark.name}</td>
          <td style={getCellStyle(mark.maxMarks)}><b><center>{mark.maxMarks}</center></b></td>
          <td style={getCellStyle(mark.theoryMax)}><center>{mark.theoryMax}</center></td>
          <td style={getCellStyle(mark.isAbsent ? 'A' : mark.theory)}><center>{mark.isAbsent ? 'A' : mark.theory}</center></td>
          <td style={getCellStyle(mark.internalMax)}><center>{mark.internalMax}</center></td>
          <td style={getCellStyle(mark.isAbsent ? 'A' : mark.internal)}><center>{mark.isAbsent ? 'A' : mark.internal}</center></td>
          <td colSpan={2} style={getCellStyle('-')}><center>-</center></td>
          <td style={getCellStyle(mark.isAbsent ? "A" : mark.total)}><center>{mark.isAbsent ? "A" : mark.total}</center></td>
          <td style={getCellStyle(mark.pageremark === "उत्तीर्ण" ? "P" : "F")}><center>{mark.pageremark === "उत्तीर्ण" ? "P" : "F"}</center></td>
        </tr>
      ));
  };

  const renderPracticalRows = () => {
    const practicalMarks = data.marks.filter((mark) => mark.type === 2);
    return practicalMarks.map((mark, index) => (
      <tr key={index}>
        {index === 0 && (
          <td rowSpan={practicalMarks.length} style={{ border: '1px solid black', padding: "4px 0px 12px 0px", textAlign: "center", verticalAlign: "top" }}>
            अभ्यास क्रम
          </td>
        )}
        <td style={getCellStyle(mark.name)}>{mark.name}</td>
        <td style={getCellStyle(mark.maxMarks)}><b><center>{mark.maxMarks}</center></b></td>
        <td style={getCellStyle('-')}><center>-</center></td>
        <td style={getCellStyle('-')}><center>-</center></td>
        <td style={getCellStyle('-')}><center>-</center></td>
        <td style={getCellStyle('-')}><center>-</center></td>
        <td colSpan={2} style={getCellStyle(mark.isAbsent ? "A" : mark.practical)}>
          <center>{mark.isAbsent ? "A" : mark.practical}</center></td>
        <td style={getCellStyle(mark.isAbsent ? "A" : mark.total)}><center>{mark.isAbsent ? "A" : mark.total}</center></td>
        <td style={getCellStyle(mark.pageremark === "उत्तीर्ण" ? "P" : "F")}>
          <center>{mark.pageremark === "उत्तीर्ण" ? "P" : "F"}</center></td>
      </tr>
    ));
  };

  const renderInternshipRows = () => {
    const practicalMarks = data.marks.filter((mark) => mark.type === 3);
    return practicalMarks.map((mark, index) => (
      <tr key={index}>
        {index === 0 && (
          <td colSpan={2} style={getCellStyle(mark.name)}>
            {mark.name}
          </td>
        )}
        <td style={getCellStyle(mark.maxMarks)}><b><center>{mark.maxMarks}</center></b></td>
        <td style={getCellStyle('-')}><center>-</center></td>
        <td style={getCellStyle('-')}><center>-</center></td>
        <td style={getCellStyle('-')}><center>-</center></td>
        <td style={getCellStyle('-')}><center>-</center></td>
        <td colSpan={2} style={getCellStyle(mark.isAbsent ? "A" : mark.practical)}><center>{mark.isAbsent ? "A" : mark.practical}</center></td>
        <td style={getCellStyle(mark.isAbsent ? "A" : mark.total)}><center>{mark.isAbsent ? "A" : mark.total}</center></td>
        <td style={getCellStyle(mark.pageremark === "उत्तीर्ण" ? "P" : "F")}><center>{mark.pageremark === "उत्तीर्ण" ? "P" : "F"}</center></td>
      </tr>
    ));
  };

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
          backgroundSize: "600px 700px", // Replace with your desired width and height in pixels
          backgroundPosition: "center 50%",
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
              {/* Sr. No.<span>{String(data.sno).padStart(3, "0")}</span> */}
              Sr. No.<span>{awardsheetnumber}</span>
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

          <div className="responsive">
            <table border="2" className="table-bordered" style={{ borderCollapse: 'collapse', fontSize: "0.8rem", padding: "4px" }}>
              <thead>
                <tr>
                  <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: "4px 3px 12px 3px" }}>प्रश्‍न्पत्र कोड</th>
                  <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: "4px 3px 12px 3px", width: '50%' }}>प्रश्‍न्पत्र का नाम</th>
                  <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: "4px 3px 12px 3px" }}>अधिकतम अंक</th>
                  <th colSpan="4" className="text-center" style={{ border: '1px solid black', padding: "4px 3px 12px 3px" }}>सैद्धांतिक</th>
                  <th colSpan="2" rowSpan={3} className="text-center" style={{ border: '1px solid black', padding: "4px 3px 12px 3px" }}>क्रिया०/प्रयो०/विद्यालय अनुभव प्राप्तांक  </th>
                  <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: "4px 3px 12px 3px", width: '7%' }}> <span style={{
                    display: 'inline-block',
                    transformOrigin: 'center',
                    whiteSpace: 'nowrap',
                    position: 'absolute',
                    transform: 'translate(-45%, -40%) rotate(-90deg)',
                    padding: '0px 0px 10px 0px'
                  }}>प्राप्तांकों का <br /> योग</span></th>
                  <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: "4px 3px 12px 3px", width: '7%' }}>
                    <span style={{
                      display: 'inline-block',
                      transformOrigin: 'center',
                      whiteSpace: 'nowrap',
                      position: 'absolute',
                      transform: 'translate(-50%, -40%) rotate(-90deg)',
                      padding: '0px 0px 10px 0px'
                    }}>परीक्षाफल</span></th>
                </tr>
                <tr>
                  <th colSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 3px 12px 3px" }}>बाह्य</th>
                  <th colSpan="2" className="text-center" style={{ border: '1px solid black', padding: "4px 3px 12px 3px" }}>आंतरिक</th>
                </tr>
                <tr>
                  <th className="text-center" style={{ border: '1px solid black', padding: "4px 3px 10px 3px" }}>पूर्णांक</th>
                  <th className="text-center" style={{ border: '1px solid black', padding: "4px 3px 10px 3px" }}>प्राप्तांक</th>
                  <th className="text-center" style={{ border: '1px solid black', padding: "4px 3px 10px 3px" }}>पूर्णांक</th>
                  <th className="text-center" style={{ border: '1px solid black', padding: "4px 3px 10px 3px" }}>प्राप्तांक</th>
                </tr>
              </thead>
              <tbody>
                {renderTheoryRows()}
                {renderPracticalRows()}
                {renderInternshipRows()}
                <tr>
                  <td colSpan="2" style={{ border: '1px solid black', textAlign: 'left', fontWeight: 'bold', padding: "4px 4px 12px 4px" }}><b>योग (Total)</b></td>
                  <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px", textAlign: 'center', }}><b>{data.maxMarks}</b></td>
                  <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px", textAlign: 'center' }}>{data.totalExternalMaxMarks}</td>
                  <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px", textAlign: "center" }}>{totalTheoryMax}</td>
                  <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px", textAlign: 'center' }}>{data.totalInternalMaxMarks}</td>
                  <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px", textAlign: "center" }}>{totalInternalMax}</td>
                  <td colSpan="2" style={{ border: '1px solid black', padding: "4px  0px 12px 0px", textAlign: "center" }}>{practicalMax}</td>
                  <td style={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold', padding: "4px  0px 12px 0px", fontSize: "1rem", }}>{data.totalMarks}</td>
                  <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px", textAlign: 'center' }}></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="footer mt-3" style={{ fontSize: "0.9rem" }}>
            <div>
              परीक्षाफल - <span id="re"><b>{data.result}</b></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: "60px" }}>
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
