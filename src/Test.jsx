import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, OrbitControls, MeshDistortMaterial } from '@react-three/drei';

// Animated Floating Particles
function FloatingParticles({ count = 50 }) {
  const meshRef = useRef();
  
  // Generate random particle positions
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ],
        scale: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.5 ? "#00ff88" : "#ff44ff"
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        child.position.y += Math.sin(time * particle.speed + i) * 0.01;
        child.rotation.x = time * particle.speed;
        child.rotation.z = time * particle.speed * 0.5;
      });
    }
  });

  return (
    <group ref={meshRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position} scale={particle.scale}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial 
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Section-Specific 3D Elements
function SectionElements({ activeSection }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
    }
  });

  if (activeSection === 'projects') {
    return (
      <group ref={groupRef}>
        <mesh position={[3, 1, -2]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial 
            color="#00ff88" 
            emissive="#00ff88"
            emissiveIntensity={0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-3, -1, -2]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial 
            color="#ff44ff" 
            emissive="#ff44ff"
            emissiveIntensity={0.1}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
    );
  }

  if (activeSection === 'about') {
    return (
      <group ref={groupRef}>
        <mesh position={[2.5, 0, -3]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial 
            color="#00ff88" 
            emissive="#00ff88"
            emissiveIntensity={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[-2.5, 1, -3]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="#ff44ff" 
            emissive="#ff44ff"
            emissiveIntensity={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    );
  }

  return null;
}

// Loading Screen Component
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
          fontSize: '4rem',
          fontWeight: 900,
          margin: '0 0 1rem 0',
          background: 'linear-gradient(135deg, #00ff88, #ffffff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ISAAC SALAS
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#00ff88', marginBottom: '2rem' }}>
          Loading Portfolio...
        </p>
        
        {/* Progress Bar */}
        <div style={{
          width: '300px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          margin: '0 auto 1rem'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00ff88, #cc00ff)',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}

// Simple Navigation
function Navigation({ activeSection, setActiveSection }) {
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];
  
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
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (activeSection !== section.id) {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== section.id) {
              e.target.style.background = 'rgba(0, 0, 0, 0.7)';
            }
          }}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}

// Glassmorphism Card Component
function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      padding: '2rem',
      margin: '1rem 0',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      ...style
    }}>
      {children}
    </div>
  );
}

// Project Card Component
function ProjectCard({ title, description, tech }) {
  return (
    <div className="project-card">
      <GlassCard style={{ margin: '1rem', minWidth: '300px', maxWidth: '350px' }}>
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
        {title}
      </div>
      <h3 style={{ 
        color: '#00ff88', 
        margin: '0 0 0.5rem 0',
        fontSize: '1.2rem',
        fontWeight: 600
      }}>
        {title}
      </h3>
      <p style={{ 
        color: '#ccc', 
        margin: '0 0 1rem 0',
        lineHeight: 1.5,
        fontSize: '0.9rem'
      }}>
        {description}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {tech.map((t, i) => (
          <span key={i} style={{
            background: 'rgba(204, 0, 255, 0.2)',
            color: '#cc00ff',
            padding: '0.25rem 0.5rem',
            borderRadius: '5px',
            fontSize: '0.7rem',
            fontWeight: 500
          }}>
            {t}
          </span>
        ))}
      </div>
    </GlassCard>
    </div>
  );
}

// Main App Component
function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  // Show loading screen
  if (loading) {
    return <LoadingScreen progress={progress} onComplete={handleLoadingComplete} />;
  }

  // Main portfolio content
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'black',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.5)); }
          50% { filter: drop-shadow(0 0 30px rgba(204, 0, 255, 0.8)); }
        }
        .project-card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Navigation */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* 3D Background - Your working sphere */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <Canvas>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
          <pointLight position={[-10, -10, 5]} intensity={1.5} color="#00ff88" />
          
          {/* Main Sphere */}
          <Sphere args={[1, 64, 32]}>
            <MeshDistortMaterial
              color="#ff44ff"
              distort={0.5}
              speed={2}
              roughness={0.1}
              metalness={0.8}
              emissive="#ff44ff"
              emissiveIntensity={0.5}
            />
          </Sphere>
          
          {/* Floating Particles */}
          <FloatingParticles count={30} />
          
          {/* Section-Specific Elements */}
          <SectionElements activeSection={activeSection} />
          
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      {/* Content Sections */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh'
      }}>
        {/* Hero Section */}
        {activeSection === 'hero' && (
          <section style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '0 5%',
            animation: 'fadeIn 0.6s ease-in-out'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <h1 style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontWeight: 900,
                margin: '0 0 1rem 0',
                background: 'linear-gradient(135deg, #00ff88, #ffffff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1
              }}>
                ISAAC<br />SALAS
              </h1>
              <p style={{
                fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                color: '#00ff88',
                margin: '0 0 2rem 0',
                fontWeight: 300
              }}>
                Creative Developer
              </p>
              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: '#ccc',
                lineHeight: 1.6,
                margin: '0 0 2rem 0'
              }}>
                Crafting immersive digital experiences through cutting-edge web technologies, 
                3D graphics, and innovative design solutions.
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
                  position: 'relative',
                  overflow: 'hidden'
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
          </section>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <section style={{
            minHeight: '100vh',
            padding: '5rem 5%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.6s ease-in-out'
          }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 700,
                margin: '0 0 2rem 0',
                color: '#00ff88'
              }}>
                About Me
              </h2>
              <GlassCard>
                <p style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  lineHeight: 1.8,
                  color: '#ccc',
                  margin: '0 0 1.5rem 0'
                }}>
                  I'm a passionate creative developer who bridges the gap between design and technology. 
                  With expertise in modern web frameworks, 3D graphics, and interactive experiences, 
                  I create digital solutions that push boundaries and engage users.
                </p>
                <p style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  lineHeight: 1.8,
                  color: '#ccc',
                  margin: 0
                }}>
                  My journey combines technical precision with creative vision, resulting in 
                  innovative projects that blend aesthetics with functionality. I specialize in 
                  React, Three.js, and modern web technologies to bring ideas to life.
                </p>
              </GlassCard>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <section style={{
            minHeight: '100vh',
            padding: '5rem 5%',
            animation: 'fadeIn 0.6s ease-in-out'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              fontWeight: 700,
              margin: '0 0 3rem 0',
              color: '#00ff88',
              textAlign: 'center'
            }}>
              Featured Projects
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <ProjectCard
                title="3D Portfolio"
                description="An immersive portfolio experience built with React and Three.js, featuring dynamic 3D elements and smooth animations."
                tech={['React', 'Three.js', 'WebGL']}
              />
              <ProjectCard
                title="Interactive Dashboard"
                description="A data visualization platform with real-time updates and interactive charts for enhanced user engagement."
                tech={['Vue.js', 'D3.js', 'Node.js']}
              />
              <ProjectCard
                title="AR Mobile App"
                description="Augmented reality application that overlays digital content onto the real world using cutting-edge AR technology."
                tech={['React Native', 'AR.js', 'WebXR']}
              />
            </div>
          </section>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <section style={{
            minHeight: '100vh',
            padding: '5rem 5%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.6s ease-in-out'
          }}>
            <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 700,
                margin: '0 0 2rem 0',
                color: '#00ff88'
              }}>
                Let's Create Together
              </h2>
              <GlassCard>
                <p style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  lineHeight: 1.8,
                  color: '#ccc',
                  margin: '0 0 2rem 0'
                }}>
                  Ready to bring your vision to life? Let's discuss how we can create 
                  something extraordinary together.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #00ff88, #cc00ff)',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(204, 0, 255, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 6px 30px rgba(204, 0, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 20px rgba(204, 0, 255, 0.3)';
                  }}
                  >
                    Send Message
                  </button>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    marginTop: '1rem'
                  }}>
                    <a href="#" style={{ color: '#00ff88', textDecoration: 'none' }}>LinkedIn</a>
                    <a href="#" style={{ color: '#00ff88', textDecoration: 'none' }}>GitHub</a>
                    <a href="#" style={{ color: '#00ff88', textDecoration: 'none' }}>Email</a>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Render the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);