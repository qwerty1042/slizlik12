import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserStats, getUserStats } from '../services/statsService';

interface CardProps {
  title: string;
  ps?: string;
  image: string;
  mode: string;
}

const Card: React.FC<CardProps> = ({ title, image, mode, ps }) => {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(() => {
    const saved = localStorage.getItem(`clicks_${mode}`);
    return saved ? parseInt(saved) : 0;
  });
  const nickname = localStorage.getItem('userNickname') || '';

  const loadStats = useCallback(() => {
    const userStats = getUserStats();
    if (userStats && (mode === 'classic' || mode === 'bdsm' || mode === 'slot')) {
      const savedClicks = userStats[mode].clicks || 0;
      setClicks(savedClicks);
      localStorage.setItem(`clicks_${mode}`, savedClicks.toString());
    }
  }, [mode]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleCardClick = async () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    localStorage.setItem(`clicks_${mode}`, newClicks.toString());
    
    try {
      await updateUserStats(mode, nickname);
      navigate(`/${mode}`);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return (
    <div className="card" onClick={handleCardClick} role="button" tabIndex={0}>
      <img src={image} alt={title} />
      <div className="content-wrapper">
        <h3>{title}</h3>
        {ps && <p>{ps}</p>}
        <p>Клики: {clicks}</p>
      </div>
    </div>
  );
};

export default Card; 