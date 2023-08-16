import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./About.css";

function About() {
  return (
    <section className="aboutSection">
      <Container>
        <Row className="aboutRow">
          <Col className="col-12">
          </Col>

          <Col className="col-12 col-lg-6">
            <div className="aboutImage">
              {/* <img
                src="/image/aboutImage.png"
                alt="aboutImage"
                className="img-fluid"
              /> */}
            </div>
          </Col>
          <Col className="col-12 col-lg-6">
            <div className="aboutContent">
              <h5 className="subTitle">About</h5>
              <h1 className="aboutTitle">
                We are an Artificial Inteligence Research & Development company
              </h1>
              <p className="text">
                Our mission is to harness the potential of artificial
                intelligence and empower you to effortlessly transform any image
                with a few simple prompts, without the need for extensive
                software knowledge.
              </p>
              <p className="text textTwo">
                Experience the
                <strong>
                  most intuitive, user friendly AI background replacer tailored
                  to both businesses and individual users
                </strong>
                in  product design and beyond.
              </p>
            </div>
            
          </Col>
        </Row>
        <h1 className="sectionTitle">
  <span className="missionStatement">Our mission?</span> Provide affordable, ground-breaking AI technology.
  <br />
With <span>KRATSIA</span> creativity knows no bounds.
</h1>

      </Container>
    </section>
  );
}

export default About;
