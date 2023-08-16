import React from "react";
import { Col } from "react-bootstrap";
import "./Step.css";

function StepCompent(prop) {
  return (
    <>
      <Col className="col-12 col-lg-6">
        <div className="content">
          <p className="text">{prop.subTitle}</p>
          <h1 className="sectionTitle">{prop.SectionTitle}</h1>
        </div>
      </Col>

      <Col className="col-12 col-lg-6">
        <div className="stepImage">
          <img src="./image/step.png" alt="step" className="img-fluid" />
        </div>
      </Col>
    </>
  );
}

export default StepCompent;

