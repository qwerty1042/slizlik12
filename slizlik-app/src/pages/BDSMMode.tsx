import React, { useState, useEffect, useRef } from "react";
import "../styles/mode.css";
import "../styles/introScreen.css";
import "../styles/button.css";
import { Video, X } from "lucide-react";
import CloudinaryVideo from '../components/CloudinaryVideo';
import { useNavigate } from "react-router-dom";

const BdsmMode: React.FC = () => {
  const navigate = useNavigate();
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

  const handleExit = () => {
    navigate('/home');
  };

  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const container = containerRef.current.getBoundingClientRect();
    return {
      x: Math.random() * (container.width - 100),
      y: Math.random() * (container.height - 100)
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
    const maxX = container.width - 100;
    const maxY = container.height - 100;

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
      const maxX = container.width - 100;
      const maxY = container.height - 100;

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
        <button className="exit-button" onClick={handleExit}>
          <X size={24} />
        </button>
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
        <button className="exit-button" onClick={handleExit}>
          <X size={24} />
        </button>
        <div className="intro-cards" style={{ width: '100%', maxWidth: '100%' }}>
          <div className="custom-card" style={{ width: '100%', maxWidth: '100%', padding: 0 }}>
            <div className="card-content" style={{ width: '100%', padding: 0 }}>
              <div className="card-icon">
                <Video size={24} />
              </div>
              <p>Получить мотивацию</p>
              <button
                className="sound-button"
                onClick={handleVideoStart}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  margin: '10px 0',
                  width: 'auto',
                  display: 'inline-block'
                }}
              >
                Покатать на вертолетике
              </button>
              {showVideo && (
                <div className="video-wrapper" style={{ 
                  width: '90vw', 
                  maxWidth: '1200px', 
                  margin: '0 auto',
                  height: '70vh',
                  maxHeight: '800px'
                }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CloudinaryVideo
                      publicId="ulta_Slavika_pmpcnd"
                      className="game-video"
                      controls={false}
                      autoPlay={true}
                      onEnded={handleVideoEnd}
                    />
                  </div>
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
        <button className="exit-button" onClick={handleExit}>
          <X size={24} />
        </button>
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
    <div className="bdsm-mode" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <button 
        className="exit-button" 
        onClick={handleExit}
        style={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <X size={24} />
      </button>
      <div 
        className="game-container" 
        ref={containerRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img
          src="assets/pletka.png"
          alt="Плетка"
          className="draggable-element"
          style={{
            position: 'absolute',
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
            width: '100px',
            height: 'auto',
            zIndex: 10
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
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100px',
            height: 'auto',
            zIndex: 5
          }}
          draggable="false"
        />
      </div>
    </div>
  );
};

export default BdsmMode; 