import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/splash.css';

const SplashScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Запускаем анимацию затемнения через 2.5 секунды
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Переходим на домашнюю страницу через 3 секунды
    const navigationTimer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <img 
        src="/assets/slave_sosok_2.jpg" 
        alt="Welcome" 
        className="splash-image"
      />
    </div>
  );
};

export default SplashScreen; 