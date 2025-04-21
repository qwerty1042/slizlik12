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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [piggyPosition, setPiggyPosition] = useState({ x: 0, y: 0 });
  const [hitCount, setHitCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const whipSoundRef = useRef<HTMLAudioElement | null>(null);
  const screamSoundRef = useRef<HTMLAudioElement | null>(null);

  // Инициализация звуков
  useEffect(() => {
    whipSoundRef.current = new Audio('/assets/hlist.mp3');
    screamSoundRef.current = new Audio('/assets/scream.mp3');
    
    return () => {
      if (whipSoundRef.current) {
        whipSoundRef.current.pause();
        whipSoundRef.current = null;
      }
      if (screamSoundRef.current) {
        screamSoundRef.current.pause();
        screamSoundRef.current = null;
      }
    };
  }, []);

  const handleContinue = () => {
    setShowIntro(false);
    setShowVideoButton(true);
  };

  const handleVideoStart = () => {
    setShowVideo(true);
    // Предзагрузка видео
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
    // Устанавливаем начальную позицию копилки в центре
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

    const newPosition = {
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    };
    
    setPosition(newPosition);
    
    // Проверяем расстояние до копилки при каждом движении
    checkDistance(newPosition);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(false);
    }
  };

  // Функция для проверки расстояния между плеткой и копилкой
  const checkDistance = useCallback((whipPosition: { x: number, y: number }) => {
    const targetElement = document.querySelector('.target-element');
    if (!targetElement) return;
    
    const targetRect = targetElement.getBoundingClientRect();
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;
    
    const whipCenter = {
      x: whipPosition.x + 75, // Половина ширины плетки
      y: whipPosition.y + 75  // Примерная половина высоты плетки
    };
    
    const targetCenter = {
      x: targetRect.left - container.left + targetRect.width / 2,
      y: targetRect.top - container.top + targetRect.height / 2
    };
    
    const distance = Math.sqrt(
      Math.pow(whipCenter.x - targetCenter.x, 2) +
      Math.pow(whipCenter.y - targetCenter.y, 2)
    );
    
    if (distance < 200) {
      // Воспроизводим звуки
      if (whipSoundRef.current) {
        whipSoundRef.current.currentTime = 0;
        whipSoundRef.current.play().catch(err => console.error('Error playing whip sound:', err));
      }
      
      if (screamSoundRef.current) {
        screamSoundRef.current.currentTime = 0;
        screamSoundRef.current.play().catch(err => console.error('Error playing scream sound:', err));
      }
      
      // Увеличиваем счетчик попаданий
      setHitCount(prev => prev + 1);
      
      // Перемещаем копилку в случайное место
      setPiggyPosition(getRandomPosition());
    }
  }, []);

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

      const newPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      };
      
      setPosition(newPosition);
      
      // Проверяем расстояние до копилки при каждом движении
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
  }, [isDragging, dragOffset, checkDistance]);

  const handleClick = () => {
    // Проверяем расстояние при клике
    checkDistance(position);
  };

  // Добавляем эффект для установки громкости видео
  useEffect(() => {
    if (videoRef.current && showVideo) {
      videoRef.current.volume = 0.5; // Устанавливаем громкость на 50%
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
        <div className="intro-cards" style={{ width: '100%', maxWidth: '100%' }}>
          <div className="custom-card" style={{ 
            width: '100%', 
            maxWidth: '100%', 
            padding: 0,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(5px)'
          }}>
            <div className="card-content" style={{ width: '100%', padding: 0 }}>
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
                  width: '90vw', 
                  maxWidth: '1200px', 
                  margin: '0 auto',
                  height: '70vh',
                  maxHeight: '800px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '10px',
                  padding: '10px'
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
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '18px',
          zIndex: 20
        }}>
          Попаданий: {hitCount}
        </div>
      </div>
    </div>
  );
};

export default BdsmMode; 