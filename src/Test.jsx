import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Optimized Global Magnetic System
const MagneticManager = (() => {
  let instance = null;
  
  class MagneticManagerClass {
    constructor() {
      this.elements = new Map();
      this.mouse = { x: 0, y: 0 };
      this.isRunning = false;
      this.frameId = null;
    }

    register(element, options = {}) {
      const id = Math.random().toString(36).substr(2, 9);
      this.elements.set(id, {
        element,
        strength: options.strength || 0.3,
        radius: options.radius || 100,
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0
      });
      
      if (!this.isRunning) {
        this.start();
      }
      
      return id;
    }

    unregister(id) {
      this.elements.delete(id);
      if (this.elements.size === 0) {
        this.stop();
      }
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      
      this.handleMouseMove = (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      };

      document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      this.animate();
    }

    stop() {
      this.isRunning = false;
      document.removeEventListener('mousemove', this.handleMouseMove);
      if (this.frameId) {
        cancelAnimationFrame(this.frameId);
      }
    }

    animate = () => {
      if (!this.isRunning) return;

      this.elements.forEach((data) => {
        const { element, strength, radius } = data;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = this.mouse.x - centerX;
        const deltaY = this.mouse.y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < radius) {
          const force = (radius - distance) / radius;
          data.targetX = deltaX * strength * force;
          data.targetY = deltaY * strength * force;
        } else {
          data.targetX = 0;
          data.targetY = 0;
        }

        // Smooth lerp
        data.currentX += (data.targetX - data.currentX) * 0.15;
        data.currentY += (data.targetY - data.currentY) * 0.15;

        // Apply transform
        element.style.transform = `translate3d(${data.currentX}px, ${data.currentY}px, 0)`;
      });

      this.frameId = requestAnimationFrame(this.animate);
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = new MagneticManagerClass();
      }
      return instance;
    }
  };
})();

// Optimized Magnetic Hook
const useMagnetic = (strength = 0.3, radius = 100) => {
  const ref = useRef();
  const idRef = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const manager = MagneticManager.getInstance();
    idRef.current = manager.register(ref.current, { strength, radius });

    return () => {
      if (idRef.current) {
        manager.unregister(idRef.current);
      }
    };
  }, [strength, radius]);

  return ref;
};

// Optimized Magnetic Element
const MagneticElement = React.memo(({ children, strength = 0.3, radius = 100, className = '', style = {}, disabled = false, ...props }) => {
  const ref = useMagnetic(disabled ? 0 : strength, radius);
  
  return (
    <div 
      ref={ref}
      className={className}
      style={{
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
});

// Optimized Custom Cursor
const CustomCursor = React.memo(() => {
  const cursorRef = useRef();
  const [cursorState, setCursorState] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef2 = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationId;

    const updateCursor = () => {
      cursorRef2.current.x += (mouseRef.current.x - cursorRef2.current.x) * 0.1;
      cursorRef2.current.y += (mouseRef.current.y - cursorRef2.current.y) * 0.1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorRef2.current.x}px, ${cursorRef2.current.y}px, 0)`;
      }

      animationId = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    // Optimized hover detection
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('button, a, [data-cursor]');
      
      interactiveElements.forEach(el => {
        const cursorType = el.dataset.cursor || 'button';
        el.addEventListener('mouseenter', () => setCursorState(cursorType), { passive: true });
        el.addEventListener('mouseleave', () => setCursorState('default'), { passive: true });
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    updateCursor();
    setTimeout(addHoverListeners, 100);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const getCursorStyle = () => {
    const baseStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: 9999,
      mixBlendMode: 'difference',
      transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease',
      opacity: isVisible ? 1 : 0,
      willChange: 'transform',
      transform: 'translate(-50%, -50%)'
    };

    switch (cursorState) {
      case 'button':
      case 'magnetic':
        return {
          ...baseStyle,
          width: '50px',
          height: '50px',
          background: 'rgba(0, 255, 136, 0.7)',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.3)'
        };
      case 'text':
        return {
          ...baseStyle,
          width: '6px',
          height: '60px',
          background: 'linear-gradient(180deg, #00ff88, #cc00ff)',
          borderRadius: '3px'
        };
      case 'project':
        return {
          ...baseStyle,
          width: '60px',
          height: '60px',
          background: 'rgba(204, 0, 255, 0.6)',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.4)'
        };
      default:
        return {
          ...baseStyle,
          width: '30px',
          height: '30px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '50%'
        };
    }
  };

  return <div ref={cursorRef} style={getCursorStyle()} />;
});

// Optimized Parallax (reduced elements)
const SimpleParallax = React.memo(() => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '120%',
        height: '120%',
        background: 'radial-gradient(ellipse 150% 100% at 50% 0%, rgba(0, 255, 136, 0.12) 0%, transparent 50%)',
        transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
        zIndex: -10,
        willChange: 'transform'
      }} />

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '110%',
        height: '110%',
        background: 'radial-gradient(circle at 80% 20%, rgba(204, 0, 255, 0.12) 0%, transparent 50%)',
        transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
        zIndex: -9,
        willChange: 'transform'
      }} />

      {/* New dramatic accent gradients */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.08) 0%, transparent 40%)',
        transform: `translate3d(0, ${scrollY * 0.05}px, 0)`,
        zIndex: -8,
        willChange: 'transform'
      }} />
    </>
  );
});

// Optimized 3D Components
const FloatingParticles = React.memo(() => {
  const groupRef = useRef();
  const { mouse } = useThree();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 25; i++) { // Reduced from 50
      temp.push({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12
        ],
        scale: Math.random() * 0.2 + 0.1,
        color: i % 3 === 0 ? "#00ff88" : i % 3 === 1 ? "#cc00ff" : "#ffffff"
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.x = time * 0.03; // Slower
      groupRef.current.rotation.y = time * 0.02;
      
      groupRef.current.rotation.x += mouse.y * 0.05; // Reduced sensitivity
      groupRef.current.rotation.y += mouse.x * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position} scale={particle.scale}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial 
            color={particle.color}
            transparent 
            opacity={0.7}
            emissive={particle.color}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
});

const InteractiveSphere = React.memo(() => {
  const sphereRef = useRef();
  const { mouse } = useThree();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (sphereRef.current) {
      sphereRef.current.rotation.x = time * 0.08;
      sphereRef.current.rotation.y = time * 0.1;
      
      sphereRef.current.position.x = mouse.x * 0.3;
      sphereRef.current.position.y = mouse.y * 0.3;
      
      const scale = 1 + Math.sin(time * 1.5) * 0.05 + (hovered ? 0.1 : 0);
      sphereRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Sphere 
      ref={sphereRef} 
      args={[0.8, 32, 32]} // Reduced geometry complexity
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <MeshDistortMaterial
        color={hovered ? "#ff6b6b" : "#ff44ff"}
        distort={0.5}
        speed={2.5}
        roughness={0.1}
        metalness={0.9}
        emissive={hovered ? "#ff6b6b" : "#ff44ff"}
        emissiveIntensity={hovered ? 0.6 : 0.4}
        envMapIntensity={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
});

// Page Transitions (simplified)
const PageTransitions = React.memo(() => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback((targetSection) => {
    setIsTransitioning(true);

    setTimeout(() => {
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    }, 400);
  }, []);

  useEffect(() => {
    window.triggerPageTransition = triggerTransition;
    return () => {
      delete window.triggerPageTransition;
    };
  }, [triggerTransition]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: isTransitioning ? '0' : '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #00ff88, #cc00ff)',
        zIndex: 10001,
        transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isTransitioning ? 'all' : 'none'
      }}
    />
  );
});

// Navigation
const Navigation = React.memo(({ isMobile, showMobileMenu, setShowMobileMenu }) => {
  const sections = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👨‍💻' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ];

  const scrollToSection = useCallback((sectionId) => {
    if (window.triggerPageTransition) {
      window.triggerPageTransition(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    if (isMobile) {
      setShowMobileMenu(false);
    }
  }, [isMobile, setShowMobileMenu]);

  if (isMobile) {
    return (
      <>
        <MagneticElement strength={0.3} radius={60}>
          <button
            data-cursor="magnetic"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              zIndex: 1001,
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
        </MagneticElement>

        {showMobileMenu && (
          <nav style={{
            position: 'fixed',
            top: '4rem',
            right: '1rem',
            zIndex: 1000,
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
                data-cursor="button"
                onClick={() => scrollToSection(section.id)}
                style={{
                  background: 'transparent',
                  border: '1px solid transparent',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  width: '100%'
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
        <MagneticElement key={section.id} strength={0.2} radius={50}>
          <button
            data-cursor="magnetic"
            onClick={() => scrollToSection(section.id)}
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        </MagneticElement>
      ))}
    </nav>
  );
});

// Optimized Glass Card
const GlassCard = React.memo(({ children, style = {}, magnetic = false, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const CardComponent = (
    <div 
      {...props}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        padding: '2rem',
        margin: '1rem 0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s ease',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );

  if (magnetic) {
    return (
      <MagneticElement strength={0.15} radius={80} data-cursor="magnetic">
        {CardComponent}
      </MagneticElement>
    );
  }

  return CardComponent;
});

// Optimized Loading Screen
const LoadingScreen = React.memo(({ progress, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'IZEQUIEL SALAS';
  
  useEffect(() => {
    if (progress < 100) {
      const textProgress = Math.floor((progress / 100) * fullText.length);
      setDisplayText(fullText.slice(0, textProgress));
    } else {
      setDisplayText(fullText);
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
          WebkitTextFillColor: 'transparent'
        }}>
          {displayText}
          <span style={{ color: '#00ff88' }}>|</span>
        </h1>
        <p style={{ 
          fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
          color: '#00ff88', 
          marginBottom: '2rem'
        }}>
          Loading Portfolio...
        </p>
        
        <div style={{
          width: '300px',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px',
          overflow: 'hidden',
          margin: '0 auto 1rem'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00ff88, #cc00ff)',
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
});

// Main App
function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 10; // Faster loading
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const scrollToProjects = useCallback(() => {
    if (window.triggerPageTransition) {
      window.triggerPageTransition('projects');
    } else {
      const element = document.getElementById('projects');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  if (loading) {
    return <LoadingScreen progress={progress} onComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <CustomCursor />
      <SimpleParallax />
      <PageTransitions />
      
      <Navigation 
        isMobile={isMobile}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* Optimized 3D Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: false, alpha: false }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          {/* Enhanced Dramatic Lighting */}
          <ambientLight intensity={0.2} color="#1a1a2e" />
          
          {/* Main Key Light */}
          <pointLight position={[8, 8, 8]} intensity={2.5} color="#ffffff" />
          
          {/* Dramatic Colored Rim Lights */}
          <pointLight position={[-12, -8, 6]} intensity={3} color="#00ff88" />
          <pointLight position={[12, -8, -6]} intensity={2.8} color="#cc00ff" />
          <pointLight position={[0, 12, -8]} intensity={2.2} color="#ff6b6b" />
          
          {/* Fill Light from Below */}
          <pointLight position={[0, -10, 8]} intensity={1.5} color="#4a9eff" />
          
          {/* Accent Lights for Depth */}
          <spotLight 
            position={[-15, 10, 10]} 
            intensity={2} 
            color="#00ff88"
            angle={0.3}
            penumbra={0.5}
            target-position={[0, 0, 0]}
          />
          <spotLight 
            position={[15, -10, 10]} 
            intensity={2} 
            color="#cc00ff"
            angle={0.3}
            penumbra={0.5}
            target-position={[0, 0, 0]}
          />
          
          <InteractiveSphere />
          <FloatingParticles />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate 
            autoRotateSpeed={0.2}
            enableDamping
            dampingFactor={0.03}
          />
        </Canvas>
      </div>

      {/* Main Content */}
      <div style={{
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(5,5,15,0.95) 50%, rgba(0,0,0,0.9) 100%)',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        minHeight: '100vh',
        width: '100%'
      }}>
        {/* Hero Section */}
        <section id="hero" style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: isMobile ? '6rem 1rem 4rem' : '0 5%'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <MagneticElement strength={0.1} radius={120}>
              <h1 data-cursor="text" style={{
                fontSize: isMobile ? '2.5rem' : 'clamp(3rem, 8vw, 5rem)',
                fontWeight: 900,
                margin: '0 0 1rem 0',
                background: 'linear-gradient(135deg, #00ff88, #ffffff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1
              }}>
                IZEQUIEL<br />SALAS
              </h1>
            </MagneticElement>
            
            <p data-cursor="text" style={{
              fontSize: isMobile ? '1.2rem' : 'clamp(1.2rem, 4vw, 2rem)',
              color: '#00ff88',
              margin: '0 0 1rem 0',
              fontWeight: 300
            }}>
              Full Stack Developer
            </p>
            
            <p data-cursor="text" style={{
              fontSize: isMobile ? '1rem' : 'clamp(1rem, 2.5vw, 1.2rem)',
              color: '#ccc',
              lineHeight: 1.6,
              margin: '0 0 2rem 0'
            }}>
              CS grad with 12+ years in the family print business, now building web applications 
              that solve real problems for real businesses.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <MagneticElement strength={0.3} radius={80}>
                <button 
                  data-cursor="magnetic"
                  onClick={scrollToProjects}
                  style={{
                    background: 'linear-gradient(135deg, #00ff88, #cc00ff)',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  View My Work
                </button>
              </MagneticElement>
              
              <MagneticElement strength={0.3} radius={80}>
                <button 
                  data-cursor="magnetic"
                  onClick={() => window.location.href = 'mailto:isaac@isaacezequielsalas.com'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    padding: '0.9rem 1.8rem',
                    borderRadius: '50px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Let's Talk
                </button>
              </MagneticElement>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" style={{
          minHeight: '100vh',
          padding: isMobile ? '5rem 1rem' : '5rem 5%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '1000px', width: '100%' }}>
            <h2 data-cursor="text" style={{
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
              <GlassCard magnetic={true}>
                <h3 data-cursor="text" style={{ color: '#cc00ff', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>My Journey</h3>
                <p data-cursor="text" style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.6 }}>
                  My path to development wasn't traditional. Right when I entered high school in 2012, I started 
                  working with my brother at his print business, Cesargraphics. What began as helping out 
                  the family business became a 12-year education in how small businesses really operate.
                </p>
                <p data-cursor="text" style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.6 }}>
                  While working full-time at Cesargraphics, I pursued my Computer Science degree at ASU, 
                  graduating in December 2023. This unique combination gave me something most developers 
                  don't have: years of real-world business experience paired with fresh technical knowledge.
                </p>
                <div data-cursor="text" style={{ 
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

              <GlassCard magnetic={true}>
                <h3 data-cursor="text" style={{ color: '#cc00ff', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>My Approach</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                    <h4 data-cursor="text" style={{ color: '#00ff88', margin: '0 0 0.5rem 0' }}>Business-First</h4>
                    <p data-cursor="text" style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>Your website is a business tool first. Every feature should drive results.</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤝</div>
                    <h4 data-cursor="text" style={{ color: '#00ff88', margin: '0 0 0.5rem 0' }}>True Partnership</h4>
                    <p data-cursor="text" style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>I work with clients, not for them. Your success is my success.</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                    <h4 data-cursor="text" style={{ color: '#00ff88', margin: '0 0 0.5rem 0' }}>Results-Focused</h4>
                    <p data-cursor="text" style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>Fast loading, easy to update, built to convert. Period.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" style={{
          minHeight: '100vh',
          padding: isMobile ? '5rem 1rem' : '5rem 5%'
        }}>
          <h2 data-cursor="text" style={{
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
            <GlassCard data-cursor="project" magnetic={true}>
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
                <h3 data-cursor="text" style={{ color: '#00ff88', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
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
              <p data-cursor="text" style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.5, fontSize: '0.9rem' }}>
                A drag-and-drop website builder specifically designed for small businesses. 
                Includes templates, hosting, domain management, and integrated booking/payment systems.
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
                <MagneticElement strength={0.2} radius={50}>
                  <button data-cursor="magnetic" style={{
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
                </MagneticElement>
                <MagneticElement strength={0.2} radius={50}>
                  <button data-cursor="magnetic" style={{
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
                </MagneticElement>
              </div>
            </GlassCard>

            <GlassCard data-cursor="project" magnetic={true}>
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
                <h3 data-cursor="text" style={{ color: '#00ff88', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
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
              <p data-cursor="text" style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.5, fontSize: '0.9rem' }}>
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
                <MagneticElement strength={0.2} radius={50}>
                  <button data-cursor="magnetic" style={{
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
                </MagneticElement>
                <MagneticElement strength={0.2} radius={50}>
                  <button data-cursor="magnetic" style={{
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
                </MagneticElement>
              </div>
            </GlassCard>

            <GlassCard data-cursor="project" magnetic={true}>
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
                <h3 data-cursor="text" style={{ color: '#00ff88', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
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
              <p data-cursor="text" style={{ color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.5, fontSize: '0.9rem' }}>
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
                <MagneticElement strength={0.2} radius={50}>
                  <button data-cursor="magnetic" style={{
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
                </MagneticElement>
                <MagneticElement strength={0.2} radius={50}>
                  <button data-cursor="magnetic" style={{
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
                </MagneticElement>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" style={{
          minHeight: '100vh',
          padding: isMobile ? '5rem 1rem' : '5rem 5%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '1000px', width: '100%' }}>
            <h2 data-cursor="text" style={{
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
              <GlassCard magnetic={true}>
                <h3 data-cursor="text" style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>Frontend Development</h3>
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
              <GlassCard magnetic={true}>
                <h3 data-cursor="text" style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>Backend & Tools</h3>
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
              <GlassCard magnetic={true}>
                <h3 data-cursor="text" style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>Business Understanding</h3>
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
              <GlassCard magnetic={true}>
                <h3 data-cursor="text" style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>What I Build</h3>
                <ul data-cursor="text" style={{ color: '#ccc', margin: 0, paddingLeft: '1.2rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}>Business websites that convert</li>
                  <li style={{ marginBottom: '0.5rem' }}>Custom web applications</li>
                  <li style={{ marginBottom: '0.5rem' }}>E-commerce solutions</li>
                  <li>Mobile-first designs</li>
                </ul>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{
          minHeight: '100vh',
          padding: isMobile ? '5rem 1rem' : '5rem 5%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <h2 data-cursor="text" style={{
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
              <GlassCard magnetic={true}>
                <h3 data-cursor="text" style={{ color: '#cc00ff', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>Get In Touch</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📧</span>
                    <div>
                      <p data-cursor="text" style={{ margin: '0 0 0.2rem 0', fontWeight: 600, color: '#00ff88' }}>Email</p>
                      <a href="mailto:isaac@isaacezequielsalas.com" data-cursor="button" style={{ color: '#ccc', textDecoration: 'none' }}>
                        isaac@isaacezequielsalas.com
                      </a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📍</span>
                    <div>
                      <p data-cursor="text" style={{ margin: '0 0 0.2rem 0', fontWeight: 600, color: '#00ff88' }}>Location</p>
                      <p data-cursor="text" style={{ margin: 0, color: '#ccc' }}>Phoenix, Arizona</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>⏰</span>
                    <div>
                      <p data-cursor="text" style={{ margin: '0 0 0.2rem 0', fontWeight: 600, color: '#00ff88' }}>Response Time</p>
                      <p data-cursor="text" style={{ margin: 0, color: '#ccc' }}>Usually within 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <h4 data-cursor="text" style={{ color: '#cc00ff', margin: '0 0 1rem 0' }}>Connect</h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <MagneticElement strength={0.2} radius={60}>
                    <a 
                      href="https://linkedin.com/in/isaac-salas-74825819a" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-cursor="magnetic"
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
                  </MagneticElement>
                  <MagneticElement strength={0.2} radius={60}>
                    <a 
                      href="https://github.com/izequielsalas" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-cursor="magnetic"
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
                  </MagneticElement>
                </div>
              </GlassCard>

              <GlassCard magnetic={true}>
                <h3 data-cursor="text" style={{ color: '#cc00ff', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>Ready to Build Something That Works?</h3>
                <p data-cursor="text" style={{ color: '#ccc', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                  Let's talk about your project and how my unique background can help your business grow. 
                  I understand both the technical requirements and the business realities that make websites successful.
                </p>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 data-cursor="text" style={{ color: '#00ff88', margin: '0 0 1rem 0', fontSize: '1rem' }}>What I Build:</h4>
                  <ul data-cursor="text" style={{ color: '#ccc', margin: 0, paddingLeft: '1.2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Business websites that convert visitors into customers</li>
                    <li style={{ marginBottom: '0.5rem' }}>Custom web applications that solve specific problems</li>
                    <li style={{ marginBottom: '0.5rem' }}>E-commerce stores that actually sell products</li>
                    <li>Mobile-first designs that work on every device</li>
                  </ul>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: isMobile ? 'column' : 'row' }}>
                  <MagneticElement strength={0.3} radius={80}>
                    <button
                      data-cursor="magnetic"
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
                        transition: 'all 0.3s ease',
                        width: isMobile ? '100%' : 'auto'
                      }}
                    >
                      Start a Conversation
                    </button>
                  </MagneticElement>
                  <MagneticElement strength={0.3} radius={80}>
                    <button
                      data-cursor="magnetic"
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
                        transition: 'all 0.3s ease',
                        width: isMobile ? '100%' : 'auto'
                      }}
                    >
                      Download Resume
                    </button>
                  </MagneticElement>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        * {
          cursor: none !important;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          cursor: none !important;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        ::selection {
          background: rgba(0, 255, 136, 0.3);
          color: white;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #00ff88, #cc00ff);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #cc00ff, #00ff88);
        }
      `}</style>
    </>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);