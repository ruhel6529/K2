import React from 'react';

const PriceCard = ({ details }) => {
  const { title, highlight, price, frequency, credits, imgUrls, buttonText } = details;

  return (
    <div className="priceCard">
      <div className="cardHeading">
        <h5 className="priceTitle">{title}</h5>
        {highlight && <p className="highlightText">{highlight}</p>}
      </div>
      <div className="price">
  <h5>{price}<span className="priceText">{frequency}</span></h5>
</div>

      <ul className="list">
        {credits.map((credit, index) => (
          <li key={index}>
            <img src={imgUrls[index]} className="img-fluid" alt="price" />
            <span>{credit}</span>
          </li>
        ))}
      </ul>
      <div className="priceBtn">
        <a href="#link" className="cta">
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default PriceCard;
