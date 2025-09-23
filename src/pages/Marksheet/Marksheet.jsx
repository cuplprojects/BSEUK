import React from "react";

const Marksheet = () => {
    const a4Style = {
        width: "210mm",      // A4 width
        height: "297mm",     // A4 height
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        margin: "16px auto",
        padding: "8mm",
        boxSizing: "border-box",
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        position: "relative",
    };

    return (
        <div style={a4Style}>
            <div style={{ border: "3px solid red", height: "100%", borderRadius: "2%", padding: "10px" }}>
                <div className="serial-number" style={{ fontWeight: "bold" }}>
                    <span style={{ color: "##3F42AD", margin: "0px 15px 0px 10px" }}>S.No.</span> 001
                </div>
                <div style={{ textAlign: "center", margin: "20px 0",width:"100%" }}>
                    <svg
                        viewBox="0 0 500 150"
                        width="100%"
                        height="250"
                        style={{ overflow: "visible" }}
                    >
                        {/* Define a concave arc path (half-circle at the top) */}
                        <path
                            id="arcPath"
                            d="M 40 190 A 200 200 0 0 1 450 200"
                            fill="transparent"
                            />
                        <text
                            fontSize="36"
                            fontWeight="bold"
                            letterSpacing="-6"
                            fontFamily="Arial, sans-serif"
                            fill="#ff0000"
                            letterSpacing="-5"
                            textAnchor="middle"
                        >
                            <textPath href="#arcPath" startOffset="50%">
                                <span style={{fontFamily:""}}></span>
                                उत्तराखण्ड विद्यालयी शिक्षा परिषद् रामनगर (नैनीताल)
                            </textPath>
                        </text>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Marksheet;
