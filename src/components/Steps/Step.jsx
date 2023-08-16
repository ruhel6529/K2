import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import StepCompent from "./StepCompent";
import "./Step.css";

function Step() {
  return (
    <section className="stepSection">
      <Container>
        <Row className="stepRow">
          <StepCompent
            subTitle="Step 1"
            SectionTitle="Select the picture of your product, on a transparent background and upload it "
          />
          <StepCompent
            subTitle="Step 2"
            SectionTitle="Choose a preset or prompt your own background"
          />
          <StepCompent
            subTitle="Step 3"
            SectionTitle="Refine the request and complete your work"
          />
        </Row>
      </Container>

      <Container fluid>
        <Row className="formRow">
          <Col className="col-12">
            <div className="content">
              <h1 className="subscribeTitle">Get the latest from KRATSIA</h1>
              <p className="subText">
                Receive the latest news, updates and announcements
              </p>
            </div>
            <div className="formWrapper">
              <form className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your email address"
                />
                <a href="#" className="cta">
                  Subscribe
                </a>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Step;
