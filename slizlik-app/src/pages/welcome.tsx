import React, { useState, useRef } from "react";
import { Volume2, AlertTriangle, Video } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/introScreen.css";
import "../styles/button.css"
import Click from "../components/click";
import SplashScreen from "../components/SplashScreen";

interface IntroScreenProps {
  onReady: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onReady }) => {
  const [showSplash, setShowSplash] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    const audio = new Audio("/assets/welcome.mp3");
    audio.play().catch(error => {
      console.error("Ошибка воспроизведения звука:", error);
    });
    setShowSplash(true);
  };

  const handleVideoTest = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.error("Ошибка воспроизведения видео:", error);
      });
    }
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="intro-screen">
      <motion.h1
        className="intro-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎮 Добро пожаловать в СлызлыкГейм!
      </motion.h1>

      <p className="intro-subtitle">
        Прежде чем начать, давай убедимся, что у тебя всё работает:
      </p>

      <div className="intro-cards">
        <div className="custom-card">
          <div className="card-content">
            <div className="card-icon">
              <Volume2 size={24} />
            </div>
            <p>При нажатии на кнопку ты услышишь звук</p>
            <div className="custom-button">
              <Click
                soundSrc="/assets/click.mp3"
                mode="classic"
                className="sound-button"
              >
                Проверь звук
              </Click>
            </div>
          </div>
        </div>

        <div className="custom-card">
          <div className="card-content">
            <div className="card-icon">
              <Video size={24} />
            </div>
            <p>При нажатии на кнопку ты увидишь анимацию</p>
            <div className="custom-button">
              <Click
                soundSrc=""
                mode="classic"
                className="sound-button"
                onClick={handleVideoTest}
              >
                Покатать на вертолетике
              </Click>
            </div>
            <div className="video-test-container">
              <video
                ref={videoRef}
                className="video-test"
                playsInline
                muted
              >
                <source src={`${process.env.PUBLIC_URL}/assets/roll.mp4`} type="video/mp4" />
                Ваш браузер не поддерживает видео
              </video>
            </div>
          </div>
        </div>

        <div className="custom-card">
          <div className="card-content">
            <div className="card-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="card-text">
              Внимание: если у тебя не работает звук и/или анимация, то нашампуривание не вызовет зависимость
            </div>
          </div>
        </div>
      </div>

      <button className="custom-button" onClick={handleStart}>
        Начать игру
      </button>
    </div>
  );
};

export default IntroScreen;
