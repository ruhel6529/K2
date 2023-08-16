import React from "react";
import Col from "react-bootstrap/Col";

function ServiceCard(props) {
  return (
    <>
      <Col className="col-12 col-lg-3">
        <div className="serviceCard">
          <div className="cardIcon">
            <img src={props.imageIcon} className="img-fluid" />
          </div>
          <div className="cardContent">
            <h5 className="cardTitle">{props.cardTitle}</h5>
            <p className="text">{props.cardText}</p>
          </div>
        </div>
      </Col>
    </>
  );
}

export default ServiceCard;
