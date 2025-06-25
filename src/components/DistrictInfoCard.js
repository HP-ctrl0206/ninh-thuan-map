import React from 'react';
import './DistrictInfoCard.css';

const DistrictInfoCard = ({ district }) => {
  if (!district) return null;

  return (
    <div className="info-card">
      <img src={district.image} alt={district.name} />
      <div className="info-card-content">
        <h2>{district.name}</h2>
        <p>{district.history}</p>
      </div>
    </div>
  );
};

export default DistrictInfoCard;
