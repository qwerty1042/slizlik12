import React from 'react';
import '../styles/mode.css';

const BDSMMode: React.FC = () => {
  return (
    <div className="mode-container">
      <h1>BDSM режим</h1>
      <div className="game-area">
        <img src="/assets/bdsm2.jpg" alt="BDSM режим" className="game-image" />
        <button className="click-button">Нажми меня!</button>
      </div>
    </div>
  );
};

export default BDSMMode; 