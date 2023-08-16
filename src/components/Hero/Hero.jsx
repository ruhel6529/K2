import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Hero.css";

function Hero() {
  return (
    <section className="heroSection">
      <Container>
        <Row>
          <Col className="col-12">
            <div className="heroContent">
              <h1 className="heroTitle">
                A SIMPLE APPROACH TO <span>PRODUCT DESIGN</span>
              </h1>
              <p className="text">AI background replacer</p>
              <a href="#link" className="cta">
                try now
              </a>
            </div>
            
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;
