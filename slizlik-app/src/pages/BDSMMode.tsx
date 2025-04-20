import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mode.css";
import CloudinaryVideo from '../components/CloudinaryVideo';

const BdsmMode: React.FC = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, []);

  const handleContinue = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    setShowFinalScreen(true);
  };

  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const container = containerRef.current.getBoundingClientRect();
    return {
      x: Math.random() * (container.width - 200),
      y: Math.random() * (container.height - 200)
    };
  };

  useEffect(() => {
    setPosition(getRandomPosition());
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only respond to left mouse button
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    const newX = e.clientX - container.left - dragOffset.x;
    const newY = e.clientY - container.top - dragOffset.y;

    // Keep within bounds
    const maxX = container.width - 200;
    const maxY = container.height - 200;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(false);
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const container = containerRef.current?.getBoundingClientRect();
      if (!container) return;

      const newX = e.clientX - container.left - dragOffset.x;
      const newY = e.clientY - container.top - dragOffset.y;

      // Keep within bounds
      const maxX = container.width - 200;
      const maxY = container.height - 200;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleClick = () => {
    const draggableElement = document.querySelector('.draggable-element');
    const targetElement = document.querySelector('.target-element');
    
    if (draggableElement && targetElement) {
      const draggableRect = draggableElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      const draggableCenter = {
        x: draggableRect.left + draggableRect.width / 2,
        y: draggableRect.top + draggableRect.height / 2
      };
      
      const targetCenter = {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2
      };
      
      const distance = Math.sqrt(
        Math.pow(draggableCenter.x - targetCenter.x, 2) +
        Math.pow(draggableCenter.y - targetCenter.y, 2)
      );
      
      if (distance < 300) {
        setPosition(getRandomPosition());
      }
    }
  };

  if (showVideo) {
    return (
      <div className="video-wrapper">
        <CloudinaryVideo
          publicId="ulta_Slavika"
          className="game-video"
          controls={false}
          autoPlay={true}
          onEnded={handleVideoEnd}
        />
      </div>
    );
  }

  if (showFinalScreen) {
    return (
      <div className="final-screen">
        <h1>Поздравляем!</h1>
        <p>Вы успешно прошли BDSM режим!</p>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    );
  }

  return (
    <div className="bdsm-mode">
      <div className="game-container" ref={containerRef}>
        <img
          src="assets/pletka.png"
          className="draggable-element"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          draggable="false"
        />
        <img
          src="assets/kopilka.png"
          className="target-element"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          draggable="false"
        />
      </div>
      <button className="continue-button" onClick={handleContinue}>
        Продолжить
      </button>
    </div>
  );
};

export default BdsmMode; 