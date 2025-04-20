import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  title: string;
  ps?: string;
  image: string;
  mode: string;
}

const Card: React.FC<CardProps> = ({ title, image, mode, ps }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${mode}`);
  };

  return (
    <div className="card" onClick={handleCardClick} role="button" tabIndex={0}>
      <img src={image} alt={title} />
      <div className="content-wrapper">
        <h3>{title}</h3>
        {ps && <p>{ps}</p>}
      </div>
    </div>
  );
};

export default Card; 