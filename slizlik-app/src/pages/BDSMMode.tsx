import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/mode.css';

interface Position {
    x: number;
    y: number;
}

const BdsmMode: React.FC = () => {
    const navigate = useNavigate();
    const [kopilkaPos, setKopilkaPos] = useState<Position>({ x: 50, y: 50 });
    const [pletkaPos, setPletkaPos] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragOffset = useRef<Position>({ x: 0, y: 0 });
    const [showIntro, setShowIntro] = useState(true);
    const [showVideo, setShowVideo] = useState(false);
    const [showFinalIntro, setShowFinalIntro] = useState(false);
    const [showGame, setShowGame] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const getRandomPosition = useCallback(() => {
        if (!containerRef.current) return { x: 50, y: 50 };
        const container = containerRef.current.getBoundingClientRect();
        return {
            x: Math.random() * (container.width - 300),
            y: Math.random() * (container.height - 300)
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Проверяем, что нажата левая кнопка мыши (button === 0)
        if (e.button !== 0) return;
        
        e.preventDefault(); // Предотвращаем стандартное поведение
        
        const container = containerRef.current?.getBoundingClientRect();
        if (container) {
            // Сохраняем смещение курсора относительно центра плетки
            dragOffset.current = {
                x: e.clientX - container.left - pletkaPos.x,
                y: e.clientY - container.top - pletkaPos.y
            };
            
            setIsDragging(true);
        }
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        e.preventDefault();
        
        const container = containerRef.current.getBoundingClientRect();
        
        const newPletkaPos = {
            x: e.clientX - container.left - dragOffset.current.x,
            y: e.clientY - container.top - dragOffset.current.y
        };
        
        const maxX = container.width - 200;
        const maxY = container.height - 200;
        
        newPletkaPos.x = Math.max(0, Math.min(newPletkaPos.x, maxX));
        newPletkaPos.y = Math.max(0, Math.min(newPletkaPos.y, maxY));
        
        setPletkaPos(newPletkaPos);

        const distance = Math.sqrt(
            Math.pow(newPletkaPos.x - kopilkaPos.x, 2) +
            Math.pow(newPletkaPos.y - kopilkaPos.y, 2)
        );

        if (distance < 300) {
            setKopilkaPos(getRandomPosition());
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            }
        }
    }, [isDragging, kopilkaPos, getRandomPosition]);

    const handleMouseUp = (e: React.MouseEvent) => {
        // Проверяем, что отпущена левая кнопка мыши
        if (e.button === 0) {
            setIsDragging(false);
        }
    };

    const handleContinue = () => {
        setShowIntro(false);
        setShowVideo(true);
        
        // Добавляем автоматическое воспроизведение видео
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error('Error playing video:', error);
            });
        }
    };

    const handleVideoEnd = () => {
        setShowVideo(false);
        setShowFinalIntro(true);
    };

    const handleStartGame = () => {
        setShowFinalIntro(false);
        setShowGame(true);
    };

    useEffect(() => {
        // Добавляем обработчики на window для отслеживания движения мыши за пределами элемента
        window.addEventListener('mousemove', handleMouseMove as any);
        window.addEventListener('mouseup', handleMouseUp as any);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp as any);
        };
    }, [isDragging, kopilkaPos, handleMouseMove]); // Добавляем handleMouseMove в зависимости

    return (
        <div className="mode-container" ref={containerRef}>
            <audio ref={audioRef} src="/assets/slaviku-horosho.mp3" preload="auto" />
            <button 
                className="exit-button"
                onClick={() => navigate('/home')}
            >
                Выйти
            </button>
            {showIntro && (
                <div className="bdsm-intro">
                    <h1>BDSM Mode</h1>
                    <p>Добро пожаловать в BDSM-комнату!</p>
                    <p>Даже если у вас есть свои причины, почему вы хотите наказать Славика, я все равно дам еще одну мотивацию.</p>
                    <button className="continue-button" onClick={handleContinue}>
                        Продолжить
                    </button>
                </div>
            )}
            
            {showVideo && (
                <div className="video-container">
                    <div className="video-wrapper">
                        <video
                            ref={videoRef}
                            className="game-video"
                            preload="auto"
                            playsInline
                            controls={false}
                            onEnded={handleVideoEnd}
                        >
                            <source src="/assets/ulta_Slavika.mp4" type="video/mp4" />
                            Ваш браузер не поддерживает видео
                        </video>
                    </div>
                </div>
            )}
            
            {showFinalIntro && (
                <div className="bdsm-intro final-intro">
                    <h1>Пора наказать Славика!</h1>
                    <p>Теперь ты можете перетащить плетку на копилку.</p>
                    <p>Каждый раз, когда плетка будет касатся копилки, Славик будет убегать.</p>
                    <p>Чтобы взять плетку зажми левую кнопку мыши. Далее догоняй слызлыка</p>
                    <p>Попробуй поймать его!</p>
                    <button className="continue-button" onClick={handleStartGame}>
                        Начать...
                    </button>
                </div>
            )}
            
            {showGame && (
                <>
                    <div className="bdsm-mode"></div>
                    <div 
                        className="draggable-element pletka"
                        style={{
                            left: `${pletkaPos.x}px`,
                            top: `${pletkaPos.y}px`,
                            cursor: isDragging ? 'grabbing' : 'grab',
                            userSelect: 'none'
                        }}
                        onMouseDown={handleMouseDown}
                    >
                        <img src="/assets/pletka.png" alt="Плетка" draggable="false" />
                    </div>
                    <div 
                        className="target-element kopilka"
                        style={{
                            left: `${kopilkaPos.x}px`,
                            top: `${kopilkaPos.y}px`
                        }}
                    >
                        <img src="/assets/kopilka.png" alt="Копилка" draggable="false" />
                    </div>
                </>
            )}
        </div>
    );
};

export default BdsmMode; 