import React, { useState, useEffect, useRef } from 'react';
import { updateUserStats, getUserStats } from '../services/statsService';
import '../styles/mode.css';

const ClassicMode: React.FC = () => {
  const [clicks, setClicks] = useState(() => {
    const saved = localStorage.getItem('clicks_classic');
    return saved ? parseInt(saved) : 0;
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const nickname = localStorage.getItem('userNickname') || '';

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
      }, 300); // 500ms задержка
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return (
    <div className="mode-container">
      <h1>Classic Mode</h1>
      <div className="game-content">
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
          <button 
            className="click-button"
            onClick={handleClick}
            aria-label="Increment clicks and play video"
          >
            Нашампурить Славика
          </button>
        </div>
        <audio 
          ref={audioRef} 
          src="/assets/O.mp3" 
          preload="auto"
        />
      </div>
    </div>
  );
};

export default ClassicMode; 