// ui/Card.tsx
import React from "react";
import "../styles/card.css";

interface CardProps {
  icon?: React.ReactNode;
  text: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ icon, text, children }) => {
  return (
    <div className="custom-card">
      <div className="card-content">
        {icon && <div className="card-icon">{icon}</div>}
        <div className="card-text">{text}</div>
        {children && <div className="card-action">{children}</div>}
      </div>
    </div>
  );
};

export { Card };
