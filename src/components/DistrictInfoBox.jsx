import React from 'react';
import './DistrictInfoBox.css';

const DistrictInfoBox = ({ info, onClose }) => {
  if (!info) return null;

  return (
    <div className="info-box">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>{info.name}</h2>
      <img src={info.image} alt={info.name} />
      <pre>{info.history}</pre>
    </div>
  );
};

export default DistrictInfoBox;
