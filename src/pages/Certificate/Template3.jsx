import React from "react";
import logo from "./../../assets/logo.png";
import "./Certificate.css";

const semesterHindi = {
  "FIRST SEMESTER": "प्रथम सेमेस्टर",
  "SECOND SEMESTER": "द्वितीय सेमेस्टर",
  "THIRD SEMESTER": "तृतीय सेमेस्टर",
  "FOURTH SEMESTER": "चतुर्थ सेमेस्टर",
};

const Certificate3 = ({ data, isPreview }) => {
  const paperType2Count = data?.marks.filter((mark) => mark.paperType === 2).length;

  const renderTheoryRows = () => {
    return data.marks
      .filter((mark) => mark.type === 1)
      .map((mark, index) => (
        <tr key={index}>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.code}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.name}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.maxMarks}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.theoryMax}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.theory}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.internalMax}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.internal}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.total}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.pageremark === "उत्तीर्ण" ? "P" : "F"}</td>
        </tr>
      ));
  };

  const renderPracticalRows = () => {
    const practicalMarks = data.marks.filter((mark) => mark.type === 2);
    return practicalMarks.map((mark, index) => (
      <tr key={index}>
        {index === 0 && (
          <td rowSpan={practicalMarks.length} style={{ border: '1px solid black', textAlign: 'center', padding: '4px' }}>
            अभ्यास क्रम
          </td>
        )}
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.name}</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.maxMarks}</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.maxMarks}</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.practical}</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.total}</td>
        <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.pageremark === "उत्तीर्ण" ? "P" : "F"}</td>
      </tr>
    ));
  }
    const renderInternshipRows = () => {
      const practicalMarks = data.marks.filter((mark) => mark.type === 3);
      return practicalMarks.map((mark, index) => (
        <tr key={index}>
          {index === 0 && (
            <td colSpan={2} style={{ border: '1px solid black', textAlign: 'center', padding: '4px' }}>
              {mark.name}
            </td>
          )}
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.maxMarks}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>-</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.maxMarks}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.practical}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.total}</td>
          <td style={{ border: '1px solid black', textAlign: 'center', padding: '4px  0px 12px 0px' }}>{mark.pageremark === "Pass" ? "P" : "F"}</td>
        </tr>
      ));
  };

  return (
    <div className="p-4 outer-border" style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${logo})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.2,
          zIndex: -1,
        }}
      />

      <div
        className="container border border-5 p-4 pb-5"
        style={{ width: "21cm", fontSize: "0.9rem" }}
      >
        <div >
          <b style={{ fontSize: "0.8rem" }}>
            Sr. No.<span>{String(data.sno).padStart(3, '0')}</span>
          </b>
        </div>
        <header className="text-center mb-3">
          <div>
            <h4 className="text-danger" style={{ fontSize: "1.1rem", marginBottom: "0.3rem", fontWeight: 'bold' }}>उत्‍तराखण्‍ड विद्यालयी शिक्षा परिषद</h4>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "0.3rem", fontWeight: 'bold' }}>BOARD OF SCHOOL EDUCATION UTTARAKHAND</h4>
          </div>
        </header>

        <div className="text-center mb-2">
          <img src={logo} alt="Logo" className="logo" style={{ height: "80px", display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        </div>

        <div className="text-center mb-3">
          <h4 style={{ fontSize: "1.1rem", marginBottom: "0.3rem", fontWeight: 'bold' }}>प्रारम्भिक शिक्षा में द्विवर्षीय डिप्लोमा</h4>
          <h4 style={{ fontSize: "1.1rem", marginBottom: "0.3rem", fontWeight: 'bold' }}>
            TWO-YEAR DIPLOMA IN ELEMENTARY EDUCATION - {data.entersession || data.session} 
            {/* {data.session.split('-')[0]} */}
          </h4>
        </div>

        <div className="text-center mb-3">
          <h5 style={{ fontSize: "1rem", marginBottom: "0.3rem" }}>अंक विवरण : <span id="sem-hindi">
            {semesterHindi[data.semester.toUpperCase()]}
          </span></h5>
          <h5 style={{ fontSize: "1rem", marginBottom: "0.3rem", fontWeight: 'bold' }}>
            <u>MARKS STATEMENT : {data.semester}</u>
          </h5>
        </div>

        <section className="mb-4">
          <div className="mb-3" style={{ display: 'grid', gridTemplateColumns: ' 2fr 1fr 1fr' }}>
            <div><b>नाम <br />Name:</b> <span className="ms-2">{data.name}</span></div>
            <div><b>अनुक्रमांक <br />Roll No.:</b> <span className="ms-2">{data.rollNo}</span></div>
            <div><b>वर्ग <br />Group:</b> <span className="ms-2">{data.group}</span></div>
          </div>

          <div className="row mb-3" style={{ display: 'grid', gridTemplateColumns: ' 1fr 1fr ' }}>
            <div style={{}}><b>माता का नाम <br />Mother's Name:</b> <span className="ms-2">{data.mothersName}</span></div>
            <div style={{}}><b>पिता का नाम <br />Father's Name:</b> <span className="ms-2">{data.fathersName}</span></div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <b>संस्थान का नाम <br />Institution's Name:</b> <span className="ms-2">{data.institutionName}</span>
            </div>
          </div>
        </section>

        <div className="responsive">
          <table border="2" className="table-bordered" style={{ borderCollapse: 'collapse', fontSize: "0.8rem", padding: "4px" }}>
            <thead>
              <tr>
                <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: '4px' }}>प्रश्न पत्र कोड</th>
                <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: '4px' }}>प्रश्न पत्र का नाम</th>
                <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: '4px' }}>अधिकतम अंक</th>
                <th colSpan="4" className="text-center" style={{ border: '1px solid black', padding: '4px' }}>सैद्धांतिक</th>
                <th colSpan="2" rowSpan={2} className="text-center" style={{ border: '1px solid black', padding: '4px' }}>क्रियात्मक / प्रयोगात्मक</th>
                <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: '4px' }}>योग</th>
                <th rowSpan="4" className="text-center" style={{ border: '1px solid black', padding: '4px' }}>परीक्षाफल</th>
              </tr>
              <tr>
                <th colSpan="2" className="text-center" style={{ border: '1px solid black', padding: '4px' }}>बाह्य</th>
                <th colSpan="2" className="text-center" style={{ border: '1px solid black', padding: '4px' }}>आंतरिक</th>
              </tr>
              <tr>
                <th className="text-center" style={{ border: '1px solid black', padding: '4px' }}>पूर्णांक</th>
                <th className="text-center" style={{ border: '1px solid black', padding: '4px' }}>प्राप्तांक</th>
                <th className="text-center" style={{ border: '1px solid black', padding: '4px' }}>पूर्णांक</th>
                <th className="text-center" style={{ border: '1px solid black', padding: '4px' }}>प्राप्तांक</th>
                <th className="text-center" style={{ border: '1px solid black', padding: '4px' }}>पूर्णांक</th>
                <th className="text-center" style={{ border: '1px solid black', padding: '4px' }}>प्राप्तांक</th>
              </tr>
            </thead>
            <tbody>
              {renderTheoryRows()}
              {renderPracticalRows()}
              {/* {renderInternshipRows()} */}
              <tr>
                <td colSpan="2" style={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold', padding: "4px 4px 12px 4px" }}><b>योग (Total)</b></td>
                <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px" }}>{data.maxMarks}</td>
                <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px" }}>{data.totalInternalMaxMarks}</td>
                <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px" }}>{data.totalInternalMarksObtained}</td>
                <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px" }}>{data.totalExternalMaxMarks}</td>
                <td style={{ border: '1px solid black', padding: "4px  0px 12px 0px" }}>{data.totalExternalMarksObtained}</td>
                <td colSpan="2" style={{ border: '1px solid black', padding: "4px  0px 12px 0px" }}>{data.totalPracticalMaxMarks}</td>
                <td style={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold', padding: "4px  0px 12px 0px" }}>{data.totalMarks}</td>
                <td></td>
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
              <div>हस्ताक्षर ज़ाँचकार्ता</div>
              <div>दिनांक -</div>
            </div>
            <div>
              <div>हस्ताक्षर प्रचार्य</div>
              <div>सील/मोहर</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate3;
