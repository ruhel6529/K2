import React from "react";
import { Container, Row } from "react-bootstrap";
import "./Pricing.css";
import PriceCard from './PriceCard';

function Pricing() {
  let priceDetails = [
    {
      title: "Basic",
      price: "$17",
      frequency: "/monthly",
      credits: ["40 credits"],
      imgUrls: ["./image/price1.png"],
      buttonText: "try for free",
    },
    {
      title: "Ultra",
      price: "$24",
      frequency: "/monthly",
      credits: ["100 credits", "?"],
      imgUrls: ["./image/price1.png", "./image/price1.png", ],
      buttonText: "try for free",
    },
    {
      title: "PRO",
      price: "$39",
      frequency: "/monthly",
      credits: ["400 credits", "?", "?",],
      imgUrls: ["./image/price1.png", "./image/price1.png", "./image/price2.png",],
      buttonText: "try for free",
    },
  ];

  return (
    <section className="pricingSection">
      <Container>
        <Row>
          <div className="sectionHeading">
            <h1 className="sectionTitle">Affordable pricing</h1>
            <h5 className="subTitle">
              Bill me <span>monthly</span> • yearly
            </h5>
          </div>
        </Row>

        <Row className="pricingRow">
          {priceDetails.map((details, index) => (
            <PriceCard key={index} details={details} />
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Pricing;
