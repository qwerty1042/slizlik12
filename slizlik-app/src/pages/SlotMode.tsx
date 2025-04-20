import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/mode.css';
import '../styles/introScreen.css';
import CloudinaryVideo from '../components/CloudinaryVideo';

const SlotMode: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, []);

  const handleBack = () => {
    navigate('/home');
  };

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
        🎰 Однорукий бандит
      </motion.h1>

      <p className="intro-subtitle">
        Ничего нажимать не нужно, просто наслаждайся
      </p>

      <div className="intro-cards">
        <div className="custom-card">
          <div className="card-content">
            <div className="video-wrapper">
              <CloudinaryVideo
                publicId="drochka_2_ud7cqb"
                className="game-video"
                autoPlay
                loop
                muted
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMode; 