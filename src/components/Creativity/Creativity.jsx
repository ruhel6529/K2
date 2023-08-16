import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Creativity.css";

function Creativity() {
  return (
    <section className="createSection">
      <Container>
        <Row className="mainRow">
          <Col className="col-12 col-lg-10">
            <div className="content">
              <h1 className="sectionTitle">
                Let your creativity break free. <br /> No matter the industry.
              </h1>
            </div>
          </Col>
          <Col className="col-12 col-lg-2">
            <div className="sectionBtn">
              <a href="#link" className="cta">
                try now
              </a>
            </div>
          </Col>
        </Row>

        <Row className="galleryRow">
          <Col className="col-12 col-lg-4">
            <div className="galleryImage gallery1"></div>
          </Col>
          <Col className="col-12 col-lg-4">
            <div className="galleryImage gallery2"></div>
          </Col>
          <Col className="col-12 col-lg-4">
            <div className="galleryImage gallery3"></div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Creativity;
