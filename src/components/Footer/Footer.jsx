import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./Footer.css";
import { Col, Row } from "react-bootstrap";

function Footer() {
  return (
    <footer className="footerSection">
      <Container fluid>
        <Row>
          <Col className="col-12 col-lg-6">
            <div className="footerBrand">
              <img src="/image/logo.svg" className="img-fluid" />
            </div>
          </Col>

          <Col className="col-12 col-lg-6">
            <div className="footerList">
              <div className="list">
                <ul>
                  <li>
                    <a href="#link">HOME</a>
                  </li>
                  <li>
                    <a href="#link">ABOUT</a>
                  </li>
                  <li>
                    <a href="#link">HOWTO</a>
                  </li>
                  <li>
                    <a href="#link">PRICING</a>
                  </li>
                </ul>
              </div>
              <div className="Brands">
                <ul>
                  <li>
                    <a href="#link">
                      <i className="fa-brands fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#link">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#link">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#link">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
