import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [piggyPosition, setPiggyPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const whipSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    whipSoundRef.current = new Audio('/assets/slaviku-horosho.mp3');
    
    return () => {
      if (whipSoundRef.current) {
        whipSoundRef.current.pause();
        whipSoundRef.current = null;
      }
    };
  }, []);

  const handleContinue = () => {
    setShowIntro(false);
    setShowVideoButton(true);
  };

  const handleVideoStart = () => {
    setShowVideo(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    setShowVideoButton(false);
    setShowFinalIntro(true);
  };

  const handleStartGame = () => {
    setShowFinalIntro(false);
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      setPiggyPosition({
        x: container.width / 2 - 50,
        y: container.height / 2 - 50
      });
    }
  };

  const handleExit = () => {
    navigate('/home');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;

    const newX = e.clientX - container.left;
    const newY = e.clientY - container.top;

    const maxX = container.width - 150;
    const maxY = container.height - 150;

    const newPosition = {
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    };
    
    setPosition(newPosition);
    checkDistance(newPosition);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(false);
    }
  };

  const getRandomPosition = useCallback(() => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const container = containerRef.current.getBoundingClientRect();
    const maxX = container.width - 250;
    const maxY = container.height - 250;

    const whipPos = position;

    let newX, newY;
    if (whipPos.x < container.width / 2) {
      newX = Math.random() * (maxX / 2) + maxX / 2;
    } else {
      newX = Math.random() * (maxX / 2);
    }

    if (whipPos.y < container.height / 2) {
      newY = Math.random() * (maxY / 2) + maxY / 2;
    } else {
      newY = Math.random() * (maxY / 2);
    }

    return {
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    };
  }, [position]);

  const checkDistance = useCallback((whipPosition: { x: number, y: number }) => {
    const targetElement = document.querySelector('.target-element');
    if (!targetElement) return;
    
    const targetRect = targetElement.getBoundingClientRect();
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;
    
    const whipCenter = {
      x: whipPosition.x + 75,
      y: whipPosition.y + 75
    };
    
    const targetCenter = {
      x: targetRect.left - container.left + targetRect.width / 2,
      y: targetRect.top - container.top + targetRect.height / 2
    };
    
    const distance = Math.sqrt(
      Math.pow(whipCenter.x - targetCenter.x, 2) +
      Math.pow(whipCenter.y - targetCenter.y, 2)
    );
    
    if (distance < 150) {
      if (whipSoundRef.current) {
        whipSoundRef.current.currentTime = 0;
        whipSoundRef.current.play().catch(err => console.error('Error playing sound:', err));
      }

      const newPosition = getRandomPosition();
      setPiggyPosition(newPosition);
    }
  }, [getRandomPosition]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const container = containerRef.current?.getBoundingClientRect();
      if (!container) return;

      const newX = e.clientX - container.left;
      const newY = e.clientY - container.top;

      const maxX = container.width - 150;
      const maxY = container.height - 150;

      const newPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      };
      
      setPosition(newPosition);
      checkDistance(newPosition);
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
  }, [isDragging, checkDistance]);

  const handleClick = () => {
    checkDistance(position);
  };

  useEffect(() => {
    if (videoRef.current && showVideo) {
      videoRef.current.volume = 0.5;
    }
  }, [showVideo]);



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
        <div className="intro-cards" style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>
          <div className="custom-card" style={{ 
            width: '100%', 
            maxWidth: '100%', 
            margin: 0,
            padding: 0,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(5px)',
            border: 'none'
          }}>
            <div className="card-content" style={{ width: '100%', margin: 0, padding: 0 }}>
              <div className="card-icon">
                <Video size={24} />
              </div>
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
                Получить мотивацию
              </button>
              {showVideo && (
                <div className="video-wrapper" style={{ 
                  width: '100vw', 
                  maxWidth: '100vw', 
                  margin: 0,
                  height: '70vh',
                  maxHeight: '800px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0',
                  border: 'none'
                }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CloudinaryVideo
                      publicId="ulta_Slavika_pmpcnd"
                      className="game-video"
                      controls={false}
                      autoPlay={true}
                      onEnded={handleVideoEnd}
                      loop={false}
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
        className="exit-button-bdsm" 
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
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      >
        <X 
          size={24} 
          color="#333"
          style={{
            strokeWidth: 2.5
          }}
        />
      </button>

      <style>
        {`
          .exit-button-bdsm:hover {
            background: rgba(255, 255, 255, 0.9) !important;
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
        `}
      </style>

      <div 
        className="game-container" 
        ref={containerRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={handleClick}
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
            width: '150px',
            height: 'auto',
            zIndex: 10
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          draggable="false"
        />
        <img
          src="assets/kopilka.png"
          alt="Копилка"
          className="target-element"
          style={{
            position: 'absolute',
            left: `${piggyPosition.x}px`,
            top: `${piggyPosition.y}px`,
            width: '250px',
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