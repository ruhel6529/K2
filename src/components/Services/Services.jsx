import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ServiceCard from "./ServiceCard";
import "./Services.css";

function Services() {
  return (
    <section className="serviceSection">
      <Container fluid>
        <Row>
          <ServiceCard
            imageIcon="/image/Service1.png"
            cardTitle="Maximum creativity"
            cardText="Welcome to your account hub, your gateway to topping up credits and exploring your gallery of saved photos."
          />
          <ServiceCard
            imageIcon="/image/Service2.png"
            cardTitle="Save your images"
            cardText="Welcome to your account hub, your gateway to topping up credits and exploring your gallery of saved photos."
          />
          <ServiceCard
            imageIcon="/image/Service3.png"
            cardTitle="Write your own prompts"
            cardText="Welcome to your account hub, your gateway to topping up credits and exploring your gallery of saved photos."
          />
          <ServiceCard
            imageIcon="/image/Service4.png"
            cardTitle="Edit to perfection"
            cardText="Welcome to your account hub, your gateway to topping up credits and exploring your gallery of saved photos."
          />
        </Row>
      </Container>
    </section>
  );
}

export default Services;
