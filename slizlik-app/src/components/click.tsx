import React from 'react';
import { updateUserStats } from '../services/statsService';

interface ClickProps {
    soundSrc: string;
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    mode: 'classic' | 'bdsm' | 'slot';
}

const Click: React.FC<ClickProps> = ({ soundSrc, children, className, onClick, mode }) => {
    const handleClick = async () => {
        const audio = new Audio(soundSrc);
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });

        // Update statistics
        await updateUserStats(mode, 'Anonymous User');

        onClick?.();
    };

    return (
        <div className={`button ${className}`} onClick={handleClick}>
            {children || 'Click me'}
        </div>
    );
}

export default Click;