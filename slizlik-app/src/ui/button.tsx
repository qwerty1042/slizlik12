// ui/Button.tsx
import React from "react";
import "../styles/button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`custom-button ${props.disabled ? "disabled" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
