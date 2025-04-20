import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/loadingScreen.css';
import slaveImage from '../assets/slave_sosok_2.jpg';

interface LoadingScreenProps {
    onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                className="loading-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.img
                    src={slaveImage}
                    alt="Loading"
                    className="loading-logo"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default LoadingScreen; 