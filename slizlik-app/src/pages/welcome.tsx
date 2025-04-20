import React from "react";
import { Volume2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import "../styles/introScreen.css";
import "../styles/button.css"
import Click from "../components/click";

interface IntroScreenProps {
  onReady: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onReady }) => {
  const handleStart = () => {
    const audio = new Audio("/assets/welcome.mp3");
  audio.play().catch(error => {
    console.error("Ошибка воспроизведения звука:", error);
  });
    onReady();
  };

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
        Прежде чем начать, давай убедимся, что у тебя работает звук:
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
              <AlertTriangle size={24} />
            </div>
            <div className="card-text">
              Внимание: если у тебя не работает звук, то нашампуривание не вызовет зависимость
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
