import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Animated Floating Particles
function FloatingParticles() {
  const mesh = useRef();
  const { viewport, mouse } = useThree();
  
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ],
        scale: Math.random() * 0.3 + 0.1,
        rotation: [Math.random(), Math.random(), Math.random()],
        speed: Math.random() * 0.02 + 0.01
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.05;
      mesh.current.rotation.y = time * 0.03;
      
      // Mouse interaction
      mesh.current.rotation.x += mouse.y * 0.1;
      mesh.current.rotation.y += mouse.x * 0.1;
    }
  });

  return (
    <group ref={mesh}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position} scale={particle.scale}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color={i % 3 === 0 ? "#00ff88" : i % 3 === 1 ? "#cc00ff" : "#ffffff"} 
            transparent 
            opacity={0.6}
            emissive={i % 3 === 0 ? "#00ff88" : i % 3 === 1 ? "#cc00ff" : "#ffffff"}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Interactive Main Sphere
function InteractiveSphere() {
  const sphereRef = useRef();
  const { mouse } = useThree();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (sphereRef.current) {
      // Base rotation
      sphereRef.current.rotation.x = time * 0.1;
      sphereRef.current.rotation.y = time * 0.15;
      
      // Mouse interaction
      sphereRef.current.position.x = mouse.x * 0.5;
      sphereRef.current.position.y = mouse.y * 0.5;
      
      // Breathing effect
      const scale = 1 + Math.sin(time * 2) * 0.1;
      sphereRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 32]}>
      <MeshDistortMaterial
        color="#ff44ff"
        distort={0.6}
        speed={3}
        roughness={0.1}
        metalness={0.8}
        emissive="#ff44ff"
        emissiveIntensity={0.3}
      />
    </Sphere>
  );
}

// Loading Screen with animated text
function LoadingScreen({ progress, onComplete }) {
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #000000, #1a1a1a)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4rem)',
          fontWeight: 900,
          margin: '0 0 1rem 0',
          background: 'linear-gradient(135deg, #00ff88, #ffffff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'glow 2s ease-in-out infinite alternate'
        }}>
          IZEQUIEL SALAS
        </h1>
        <p style={{ 
          fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
          color: '#00ff88', 
          marginBottom: '2rem',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          Loading Portfolio...
        </p>
        
        <div style={{
          width: '300px',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px',
          overflow: 'hidden',
          margin: '0 auto 1rem',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00ff88, #cc00ff, #00ff88)',
            borderRadius: '3px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
          }} />
        </div>
        
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          {Math.round(progress)}%
        </p>
      </div>
      
      <style jsx>{`
        @keyframes glow {
          from { filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.5)); }
          to { filter: drop-shadow(0 0 30px rgba(204, 0, 255, 0.5)); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// Enhanced Navigation with hamburger menu
function Navigation({ activeSection, setActiveSection, isMobile, showMobileMenu, setShowMobileMenu }) {
  const sections = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👨‍💻' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ];

  if (isMobile) {
    return (
      <>
        {/* Hamburger Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          {showMobileMenu ? '✕' : '☰'}
        </button>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <nav style={{
            position: 'fixed',
            top: '4rem',
            right: '1rem',
            zIndex: 999,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setShowMobileMenu(false);
                }}
                style={{
                  background: activeSection === section.id 
                    ? 'rgba(0, 255, 136, 0.3)' 
                    : 'transparent',
                  border: activeSection === section.id 
                    ? '1px solid #00ff88' 
                    : '1px solid transparent',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  color: activeSection === section.id ? '#00ff88' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        )}
      </>
    );
  }
  
  // Desktop Navigation
  return (
    <nav style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          style={{
            background: activeSection === section.id 
              ? 'rgba(0, 255, 136, 0.3)' 
              : 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            border: activeSection === section.id 
              ? '1px solid #00ff88' 
              : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: activeSection === section.id ? '#00ff88' : 'white',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            if (activeSection !== section.id) {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== section.id) {
              e.target.style.background = 'rgba(0, 0, 0, 0.7)';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          <span>{section.icon}</span>
          {section.label}
        </button>
      ))}
    </nav>
  );
}

// Enhanced Glassmorphism Card with animations
function GlassCard({ children, style = {}, animate = true }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '2rem',
        margin: '1rem 0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        transform: isHovered && animate ? 'translateY(-5px)' : 'translateY(0)',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

// Section transition wrapper
function Section({ isActive, children, className = "" }) {
  return (
    <div style={{
      opacity: isActive ? 1 : 0,
      transform: isActive ? 'translateX(0)' : 'translateX(-20px)',
      transition: 'all 0.5s ease',
      display: isActive ? 'block' : 'none'
    }}>
      {children}
    </div>
  );
}

// Main App Component
function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Loading simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10 + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen progress={progress} onComplete={handleLoadingComplete} />;
  }

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at center, #000000 0%, #0a0a0a 50%, #000000 100%)',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: isMobile ? 'auto' : 'hidden'
    }}>
      {/* Navigation */}
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isMobile={isMobile}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* 3D Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-10, -10, 5]} intensity={1} color="#00ff88" />
          <pointLight position={[0, 10, -10]} intensity={0.8} color="#cc00ff" />
          
          <InteractiveSphere />
          <FloatingParticles />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate 
            autoRotateSpeed={0.3}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* Content Sections */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        padding: isMobile ? '6rem 1rem 2rem' : '0 5%'
      }}>
        {/* Hero Section */}
        <Section isActive={activeSection === 'hero'}>
          <div style={{
            height: isMobile ? 'auto' : '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <h1 style={{
                fontSize: isMobile ? '2.5rem' : 'clamp(3rem, 8vw, 5rem)',
                fontWeight: 900,
                margin: '0 0 1rem 0',
                background: 'linear-gradient(135deg, #00ff88, #ffffff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                animation: 'fadeInUp 1s ease'
              }}>
                IZEQUIEL<br />SALAS
              </h1>
              <p style={{
                fontSize: isMobile ? '1.2rem' : 'clamp(1.2rem, 4vw, 2rem)',
                color: '#00ff88',
                margin: '0 0 1rem 0',
                fontWeight: 300,
                animation: 'fadeInUp 1s ease 0.2s both'
              }}>
                Full Stack Developer
              </p>
              <p style={{
                fontSize: isMobile ? '1rem' : 'clamp(1rem, 2.5vw, 1.2rem)',
                color: '#ccc',
                lineHeight: 1.6,
                margin: '0 0 2rem 0',
                animation: 'fadeInUp 1s ease 0.4s both'
              }}>
                CS grad with 12+ years in the family print business, now building web applications 
                that solve real problems for real businesses.
              </p>
              <button 
                onClick={() => setActiveSection('projects')}
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #cc00ff)',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)',
                  animation: 'fadeInUp 1s ease 0.6s both'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 30px rgba(0, 255, 136, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 255, 136, 0.3)';
                }}
              >
                View My Work
              </button>
            </div>
          </div>
        </Section>

        {/* About Section */}
        <Section isActive={activeSection === 'about'}>
          <div style={{
            minHeight: isMobile ? 'auto' : '100vh',
            paddingTop: isMobile ? '2rem' : '5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ maxWidth: '1000px', width: '100%' }}>
              <h2 style={{
                fontSize: isMobile ? '2rem' : 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 700,
                margin: '0 0 2rem 0',
                color: '#00ff88',
                textAlign: 'center'
              }}>
                About Me
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
              }}>
                <GlassCard>
                  <h3 style={{ color: '#cc00ff', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>My Journey</h3>
                  <p style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.6 }}>
                    My path to development wasn't traditional. Right when I entered high school in 2012, I started 
                    working with my brother at his print business, Cesargraphics. What began as helping out 
                    the family business became a 12-year education in how small businesses really operate.
                  </p>
                  <p style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.6 }}>
                    While working full-time at Cesargraphics, I pursued my Computer Science degree at ASU, 
                    graduating in December 2023. This unique combination gave me something most developers 
                    don't have: years of real-world business experience paired with fresh technical knowledge.
                  </p>
                  <div style={{ 
                    color: '#00ff88', 
                    margin: 0, 
                    fontStyle: 'italic',
                    padding: '1rem',
                    background: 'rgba(0, 255, 136, 0.1)',
                    borderRadius: '8px',
                    borderLeft: '3px solid #00ff88'
                  }}>
                    "I understand both the code and the business reality of what makes websites actually work"
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 style={{ color: '#cc00ff', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>My Approach</h3>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                      <h4 style={{ color: '#00ff88', margin: '0 0 0.5rem 0' }}>Business-First</h4>
                      <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>Your website is a business tool first. Every feature should drive results.</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤝</div>
                      <h4 style={{ color: '#00ff88', margin: '0 0 0.5rem 0' }}>True Partnership</h4>
                      <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>I work with clients, not for them. Your success is my success.</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                      <h4 style={{ color: '#00ff88', margin: '0 0 0.5rem 0' }}>Results-Focused</h4>
                      <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>Fast loading, easy to update, built to convert. Period.</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </Section>

        {/* Projects Section */}
        <Section isActive={activeSection === 'projects'}>
          <div style={{
            minHeight: isMobile ? 'auto' : '100vh',
            paddingTop: isMobile ? '2rem' : '5rem'
          }}>
            <h2 style={{
              fontSize: isMobile ? '2rem' : 'clamp(2rem, 6vw, 3rem)',
              fontWeight: 700,
              margin: '0 0 3rem 0',
              color: '#00ff88',
              textAlign: 'center'
            }}>
              Featured Projects
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              <GlassCard>
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #cc00ff, #00ff88)',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  Website Builder
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: '#00ff88', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
                    Small Business Website Builder
                  </h3>
                  <span style={{
                    background: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 500
                  }}>
                    Live
                  </span>
                </div>
                <p style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.5, fontSize: '0.9rem' }}>
                  A drag-and-drop website builder specifically designed for small businesses. 
                  Includes templates, hosting, domain management, and integrated booking/payment systems. 
                  Currently serving 15+ local businesses.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {['React', 'Firebase', 'Stripe', 'Node.js'].map(tech => (
                    <span key={tech} style={{
                      background: 'rgba(204, 0, 255, 0.2)',
                      color: '#cc00ff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '5px',
                      fontSize: '0.7rem',
                      fontWeight: 500
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #00ff88, #cc00ff)',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    Live Demo
                  </button>
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    View Code
                  </button>
                </div>
              </GlassCard>

              <GlassCard>
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #00ff88, #cc00ff)',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  E-commerce Platform
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: '#00ff88', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
                    E-commerce Platform
                  </h3>
                  <span style={{
                    background: 'rgba(255, 204, 0, 0.2)',
                    color: '#ffcc00',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 500
                  }}>
                    In Progress
                  </span>
                </div>
                <p style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.5, fontSize: '0.9rem' }}>
                  Full-stack e-commerce solution with payment processing, inventory management, and admin dashboard. 
                  Built for a local boutique to expand online.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {['React', 'Stripe', 'Firebase', 'Admin Dashboard'].map(tech => (
                    <span key={tech} style={{
                      background: 'rgba(204, 0, 255, 0.2)',
                      color: '#cc00ff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '5px',
                      fontSize: '0.7rem',
                      fontWeight: 500
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #00ff88, #cc00ff)',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    Preview
                  </button>
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    View Code
                  </button>
                </div>
              </GlassCard>

              <GlassCard>
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #cc00ff, #ffffff)',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}>
                  Task Manager
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ color: '#00ff88', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
                    Task Management Tool
                  </h3>
                  <span style={{
                    background: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 500
                  }}>
                    Live
                  </span>
                </div>
                <p style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.5, fontSize: '0.9rem' }}>
                  Collaborative project management tool with real-time updates, team messaging, and deadline tracking. 
                  Designed for small creative agencies.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {['React', 'Node.js', 'MongoDB', 'Real-time'].map(tech => (
                    <span key={tech} style={{
                      background: 'rgba(204, 0, 255, 0.2)',
                      color: '#cc00ff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '5px',
                      fontSize: '0.7rem',
                      fontWeight: 500
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #00ff88, #cc00ff)',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    Live Demo
                  </button>
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    View Code
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        </Section>

        {/* Skills Section */}
        <Section isActive={activeSection === 'skills'}>
          <div style={{
            minHeight: isMobile ? 'auto' : '100vh',
            paddingTop: isMobile ? '2rem' : '5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ maxWidth: '1000px', width: '100%' }}>
              <h2 style={{
                fontSize: isMobile ? '2rem' : 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 700,
                margin: '0 0 3rem 0',
                color: '#00ff88',
                textAlign: 'center'
              }}>
                Skills & Technologies
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                <GlassCard>
                  <h3 style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>Frontend Development</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['React', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Three.js'].map(skill => (
                      <span key={skill} style={{
                        background: 'rgba(0, 255, 136, 0.2)',
                        color: '#00ff88',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard>
                  <h3 style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>Backend & Tools</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Node.js', 'Python', 'SQL', 'Firebase', 'Git/GitHub', 'Vercel'].map(skill => (
                      <span key={skill} style={{
                        background: 'rgba(204, 0, 255, 0.2)',
                        color: '#cc00ff',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard>
                  <h3 style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>Business Understanding</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['Customer Service', 'Project Management', 'Budget Management', 'Small Business Operations'].map(skill => (
                      <span key={skill} style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ccc',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard>
                  <h3 style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>What I Build</h3>
                  <ul style={{ color: '#ccc', margin: 0, paddingLeft: '1.2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Business websites that convert</li>
                    <li style={{ marginBottom: '0.5rem' }}>Custom web applications</li>
                    <li style={{ marginBottom: '0.5rem' }}>E-commerce solutions</li>
                    <li>Mobile-first designs</li>
                  </ul>
                </GlassCard>
              </div>
            </div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section isActive={activeSection === 'contact'}>
          <div style={{
            minHeight: isMobile ? 'auto' : '100vh',
            paddingTop: isMobile ? '2rem' : '5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ maxWidth: '800px', width: '100%' }}>
              <h2 style={{
                fontSize: isMobile ? '2rem' : 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 700,
                margin: '0 0 2rem 0',
                color: '#00ff88',
                textAlign: 'center'
              }}>
                Let's Work Together
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', 
                gap: '2rem' 
              }}>
                <GlassCard>
                  <h3 style={{ color: '#cc00ff', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>Get In Touch</h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📧</span>
                      <div>
                        <p style={{ margin: '0 0 0.2rem 0', fontWeight: 600, color: '#00ff88' }}>Email</p>
                        <a href="mailto:isaac@isaacezequielsalas.com" style={{ color: '#ccc', textDecoration: 'none' }}>
                          isaac@isaacezequielsalas.com
                        </a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📍</span>
                      <div>
                        <p style={{ margin: '0 0 0.2rem 0', fontWeight: 600, color: '#00ff88' }}>Location</p>
                        <p style={{ margin: 0, color: '#ccc' }}>Phoenix, Arizona</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>⏰</span>
                      <div>
                        <p style={{ margin: '0 0 0.2rem 0', fontWeight: 600, color: '#00ff88' }}>Response Time</p>
                        <p style={{ margin: 0, color: '#ccc' }}>Usually within 24 hours</p>
                      </div>
                    </div>
                  </div>
                  
                  <h4 style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>Connect</h4>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <a 
                      href="https://linkedin.com/in/isaac-salas-74825819a" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'rgba(0, 255, 136, 0.2)',
                        color: '#00ff88',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      LinkedIn
                    </a>
                    <a 
                      href="https://github.com/izequielsalas" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'rgba(204, 0, 255, 0.2)',
                        color: '#cc00ff',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      GitHub
                    </a>
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 style={{ color: '#cc00ff', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>Ready to Build Something That Works?</h3>
                  <p style={{ color: '#ccc', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                    Let's talk about your project and how my unique background can help your business grow. 
                    I understand both the technical requirements and the business realities that make websites successful.
                  </p>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#00ff88', margin: '0 0 1rem 0', fontSize: '1rem' }}>What I Build:</h4>
                    <ul style={{ color: '#ccc', margin: 0, paddingLeft: '1.2rem' }}>
                      <li style={{ marginBottom: '0.5rem' }}>Business websites that convert visitors into customers</li>
                      <li style={{ marginBottom: '0.5rem' }}>Custom web applications that solve specific problems</li>
                      <li style={{ marginBottom: '0.5rem' }}>E-commerce stores that actually sell products</li>
                      <li>Mobile-first designs that work on every device</li>
                    </ul>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => window.location.href = 'mailto:isaac@isaacezequielsalas.com?subject=Let\'s Work Together'}
                      style={{
                        background: 'linear-gradient(135deg, #00ff88, #cc00ff)',
                        border: 'none',
                        padding: '1rem 1.5rem',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        flex: 1,
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Start a Conversation
                    </button>
                    <button
                      onClick={() => window.open('/resume.pdf', '_blank')}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '1rem 1.5rem',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        flex: 1,
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Download Resume
                    </button>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes glow {
          from { filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.5)); }
          to { filter: drop-shadow(0 0 30px rgba(204, 0, 255, 0.5)); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);