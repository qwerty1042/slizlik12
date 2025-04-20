import React, { useRef, useEffect } from 'react';
import '../styles/mode.css';

const SlotMode: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, []);

  return (
    <div className="mode-container">
      <h1>Однорукий бандит</h1>
      <div className="video-wrapper">
        <video 
          ref={videoRef}
          className="slot-video" 
          autoPlay 
          loop
          playsInline
          muted
        >
          <source src="/assets/drochka_2.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео
        </video>
      </div>
    </div>
  );
};

export default SlotMode; 