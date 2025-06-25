// src/components/UI/Navigation.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { name: 'Home', href: '#home', index: 0 },
    { name: 'Work', href: '#work', index: 1 },
    { name: 'About', href: '#about', index: 2 },
    { name: 'Contact', href: '#contact', index: 3 }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Main Navigation */}
      <motion.nav 
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-black/20 backdrop-blur-lg rounded-full px-8 py-4 border border-white/10 shadow-2xl">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all duration-300 ${
                  activeSection === item.index 
                    ? 'text-green-400' 
                    : 'text-white hover:text-green-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(item.index)}
              >
                {item.name}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Side Navigation Dots */}
      <motion.div 
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <motion.button
              key={item.index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === item.index 
                  ? 'bg-green-400 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveSection(item.index)}
            />
          ))}
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-8 right-8 z-40 md:hidden bg-black/20 backdrop-blur-lg rounded-full p-3 border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className="block w-4 h-0.5 bg-white mb-1"></span>
          <span className="block w-4 h-0.5 bg-white mb-1"></span>
          <span className="block w-4 h-0.5 bg-white"></span>
        </div>
      </motion.button>
    </>
  );
};

export default Navigation;