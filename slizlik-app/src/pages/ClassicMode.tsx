import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserStats, getUserStats } from '../services/statsService';
import { motion } from 'framer-motion';
import '../styles/mode.css';
import '../styles/introScreen.css';

const ClassicMode: React.FC = () => {
  const [clicks, setClicks] = useState(() => {
    const saved = localStorage.getItem('clicks_classic');
    return saved ? parseInt(saved) : 0;
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();
  const nickname = localStorage.getItem('userNickname') || '';
  const CLICK_GOAL = 1488;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (video) {
        video.currentTime = 0;
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const userStats = getUserStats();
    if (userStats && userStats.classic) {
      setClicks(userStats.classic.clicks || 0);
    }
  }, []);

  const handleClick = async () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    localStorage.setItem('clicks_classic', newClicks.toString());
    
    try {
      await updateUserStats('classic', nickname);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
      
      // Воспроизведение звука с задержкой
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(error => {
            console.error('Error playing audio:', error);
          });
        }
      }, 300); // 300ms задержка
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  const progress = Math.min((clicks / CLICK_GOAL) * 100, 100);

  return (
    <div className="intro-screen">
      <button className="exit-button" onClick={handleBack}>
        Выйти
      </button>
      
      <motion.h1
        className="intro-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎮 1 кебаб плz
      </motion.h1>

      <p className="intro-subtitle">
        Нашампурь Славика от души! Цель: {CLICK_GOAL} кликов
      </p>

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
            <div className="video-wrapper" style={{ 
              width: '100vw', 
              maxWidth: '100vw', 
              margin: 0,
              height: '50vh',
              maxHeight: '800px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0',
              border: 'none'
            }}>
              <video
                ref={videoRef}
                className="game-video"
                preload="auto"
                playsInline
                aria-label="Game preview video"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              >
                <source src="/assets/1_kebab.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео
              </video>
            </div>
            
            <div className="game-controls" style={{
              padding: '10px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div className="clicks-counter" style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                Количество кликов: {clicks}
              </div>
              <div className="progress-container" style={{
                width: '80%',
                maxWidth: '400px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '3px',
                margin: '5px 0'
              }}>
                <div 
                  className="progress-bar" 
                  style={{ 
                    background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                    height: '20px',
                    borderRadius: '8px',
                    transition: 'width 0.3s ease',
                    width: `${progress}%`
                  }}
                >
                  <span className="progress-text" style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'block',
                    lineHeight: '20px',
                    textAlign: 'center',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
              </div>
              <button 
                className="click-button"
                onClick={handleClick}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                Нашампурить
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src="/assets/O.mp3" preload="auto" />
    </div>
  );
};

export default ClassicMode; 