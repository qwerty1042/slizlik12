import React, { useState, useEffect, useRef } from "react";
import "../styles/mode.css";
import "../styles/introScreen.css";
import "../styles/button.css";
import { Video } from "lucide-react";
import CloudinaryVideo from '../components/CloudinaryVideo';

const BdsmMode: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showVideoButton, setShowVideoButton] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showFinalIntro, setShowFinalIntro] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    setShowIntro(false);
    setShowVideoButton(true);
  };

  const handleVideoStart = () => {
    setShowVideo(true);
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    setShowVideoButton(false);
    setShowFinalIntro(true);
  };

  const handleStartGame = () => {
    setShowFinalIntro(false);
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

  if (showIntro) {
    return (
      <div className="bdsm-intro">
        <h1>BDSM Mode</h1>
        <p>Добро пожаловать в BDSM-комнату!</p>
        <p>Даже если у вас есть свои причины, почему вы хотите наказать Славика, я все равно дам еще одну мотивацию.</p>
        <button className="continue-button" onClick={handleContinue}>
          Продолжить
        </button>
      </div>
    );
  }

  if (showVideoButton) {
    return (
      <div className="intro-screen">
        <div className="intro-cards">
          <div className="custom-card">
            <div className="card-content">
              <div className="card-icon">
                <Video size={24} />
              </div>
              <p>При нажатии на кнопку ты увидишь анимацию</p>
              <div className="custom-button">
                <button
                  className="sound-button"
                  onClick={handleVideoStart}
                >
                  Покатать на вертолетике
                </button>
              </div>
              {showVideo && (
                <div className="video-wrapper">
                  <CloudinaryVideo
                    publicId="ulta_Slavika_n1ee6q"
                    className="game-video"
                    controls={false}
                    autoPlay={true}
                    onEnded={handleVideoEnd}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showFinalIntro) {
    return (
      <div className="bdsm-intro final-intro">
        <h1>Пора наказать Славика!</h1>
        <p>Теперь ты можете перетащить плетку на копилку.</p>
        <p>Каждый раз, когда плетка будет касатся копилки, Славик будет убегать.</p>
        <p>Чтобы взять плетку зажми левую кнопку мыши. Далее догоняй слызлыка</p>
        <p>Попробуй поймать его!</p>
        <button className="continue-button" onClick={handleStartGame}>
          Начать...
        </button>
      </div>
    );
  }

  return (
    <div className="bdsm-mode">
      <div className="game-container" ref={containerRef}>
        <img
          src="assets/pletka.png"
          alt="Плетка"
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
          alt="Копилка"
          className="target-element"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          draggable="false"
        />
      </div>
    </div>
  );
};

export default BdsmMode; 