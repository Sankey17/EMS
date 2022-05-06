import React from "react"

export const Loader = () => (
  <div style={{
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    height: "100%",
    width: "100%",
    backgroundColor: "#ffffff",
    opacity: 0.6,
    zIndex: 1000
  }}>
    <div style={{position: "absolute", textAlign: "center", top: "47%", left: "47%", zIndex: 1001}}>
      <div className="sk-three-bounce">
        <div className="sk-child sk-bounce1"/>
        <div className="sk-child sk-bounce2"/>
        <div className="sk-child sk-bounce3"/>
      </div>
    </div>
  </div>
);

export const designationValue = [
  "H.R. manager",
  "Android developer",
  "Web developer",
  "Project Manager",
  "Business Development Manager",
  "Internet Marketing Head",
  "Graphic Designer",
  "COO",
  "CTO",
  "CEO/MD"
];

export const qualificationValue = [
  "Bachelor of engineering",
  "Bsc",
  "Msc",
  "BCA",
  "MCA",
  "H.S.C",
  "Diploma",
  "D2D"
];
export const totalMonths = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];
