// src/components/UI/LoadingScreen.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Logo/Name */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-bold text-white mb-2 tracking-wider">
          ISAAC
        </h1>
        <div className="text-xl text-green-400 tracking-[0.3em] font-light">
          CREATIVE DEVELOPER
        </div>
      </motion.div>

      {/* Loading Bar */}
      <div className="w-80 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Progress Text */}
      <motion.div 
        className="text-white mt-4 font-mono text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Math.round(progress)}%
      </motion.div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              opacity: 0
            }}
            animate={{
              y: -10,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;