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

      <div className="intro-cards">
        <div className="custom-card">
          <div className="card-content">
            <div className="video-wrapper">
              <video
                ref={videoRef}
                className="game-video"
                preload="auto"
                playsInline
                aria-label="Game preview video"
              >
                <source src="/assets/1_kebab.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео
              </video>
            </div>
            
            <div className="game-controls">
              <div className="clicks-counter">
                Количество кликов: {clicks}
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${progress}%` }}
                >
                  <span className="progress-text">
                    {progress.toFixed(1)}%
                  </span>
                </div>
              </div>
              <button 
                className="click-button"
                onClick={handleClick}
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