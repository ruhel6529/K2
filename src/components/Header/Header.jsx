import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

function Header() {
  const user = null;  // Mock user state: null for unauthenticated, non-null for authenticated
  return (
    <header className="headerSection" id="header">
      <Navbar expand="lg" className="fixed-top">
        <Container>
          <Navbar.Brand href="#home">
            <img src="/image/logo.svg" alt="logo" className="img-fluid" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#steps">How to</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <Nav.Link href="#link">Contact</Nav.Link>
            </Nav>
            <a href={user ? "/profile" : "/login"} className="cta account">
  Account
</a>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
