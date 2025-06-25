// src/components/Sections/HTMLContent.jsx
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HTMLContent = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to section index
  const sectionProgress = useTransform(scrollYProgress, [0, 1], [0, 3]);
  
  useEffect(() => {
    const unsubscribe = sectionProgress.onChange((value) => {
      setCurrentSection(Math.round(value));
    });
    
    return () => unsubscribe();
  }, [sectionProgress]);

  const projects = [
    {
      title: "3D Portfolio Website",
      description: "Interactive three.js experience with modern animations",
      tech: ["React", "Three.js", "GSAP", "Tailwind"],
      link: "#"
    },
    {
      title: "E-commerce Platform",
      description: "Full-stack application with real-time features",
      tech: ["Next.js", "Node.js", "MongoDB", "Stripe"],
      link: "#"
    },
    {
      title: "Mobile App Design",
      description: "UI/UX design for a fintech mobile application",
      tech: ["Figma", "React Native", "TypeScript"],
      link: "#"
    }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      
      {/* Hero Section Content */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: currentSection === 0 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center pointer-events-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.button 
            className="btn-primary"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 30px rgba(0,255,136,0.5)" 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            View My Work ↓
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Work Section Content */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: currentSection === 1 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-8 pointer-events-auto">
          <motion.h2 
            className="text-5xl font-bold text-white mb-12 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Featured Projects
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="card-glass"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 40px rgba(0,255,136,0.1)" 
                }}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <motion.a
                  href={project.link}
                  className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  View Project →
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* About Section Content */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: currentSection === 2 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-8 text-center pointer-events-auto">
          <motion.h2 
            className="text-5xl font-bold text-white mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            About Me
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            I'm a creative developer passionate about building immersive digital experiences. 
            I specialize in combining cutting-edge web technologies with stunning visual design 
            to create websites that don't just look amazing—they feel alive.
          </motion.p>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">5+</h3>
              <p className="text-gray-300">Years Experience</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">50+</h3>
              <p className="text-gray-300">Projects Completed</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">∞</h3>
              <p className="text-gray-300">Lines of Code</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Section Content */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: currentSection === 3 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto px-8 text-center pointer-events-auto">
          <motion.h2 
            className="text-5xl font-bold text-white mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Let's Work Together
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Ready to bring your next project to life? Let's create something extraordinary together.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.a
              href="mailto:isaac@example.com"
              className="btn-primary"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 30px rgba(0,255,136,0.5)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
            
            <motion.a
              href="#"
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Resume
            </motion.a>
          </motion.div>
          
          {/* Social Links */}
          <motion.div 
            className="flex justify-center space-x-6 mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
              <motion.a
                key={social}
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                {social}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HTMLContent;