import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
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

  const handleExit = () => {
    navigate('/home');
  };

  return (
    <div className="intro-screen">
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

      <div className="intro-cards" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="custom-card" style={{ 
          width: '100%', 
          maxWidth: '100%', 
          padding: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)'
        }}>
          <div className="card-content" style={{ width: '100%', padding: 0 }}>
            <div className="video-wrapper" style={{ 
              width: '90vw', 
              maxWidth: '1200px', 
              margin: '0 auto',
              height: '70vh',
              maxHeight: '800px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '10px',
              padding: '10px'
            }}>
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
    </div>
  );
};

export default SlotMode; 