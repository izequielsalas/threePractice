// src/components/3D/Scene3D.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Text, 
  Environment, 
  Float, 
  MeshDistortMaterial,
  Sphere,
  Box,
  useScroll,
  Stars
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Interactive Hero Sphere
function HeroSphere() {
  const meshRef = useRef();
  const { mouse, viewport } = useThree();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Mouse interaction
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.y * viewport.height * 0.05,
        0.1
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.x * viewport.width * 0.05,
        0.1
      );
      
      // Breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.2, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#00ff88"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          emissive="#00ff88"
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}

// Floating Text Component
function FloatingText({ children, position = [0, 0, 0], size = 1, color = "#ffffff" }) {
  return (
    <Text
      position={position}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
      letterSpacing={0.02}
    >
      {children}
    </Text>
  );
}

// Scroll-based Geometric Elements
function ScrollGeometry() {
  const scroll = useScroll();
  const groupRef = useRef();
  const boxRefs = useRef([]);
  
  // Create multiple boxes for interesting formations
  const boxes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: Math.random() * 0.5 + 0.5
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Main group rotation based on scroll
      groupRef.current.rotation.y = scroll.offset * Math.PI * 4;
      groupRef.current.rotation.x = scroll.offset * Math.PI * 2;
      
      // Individual box animations
      boxRefs.current.forEach((box, i) => {
        if (box) {
          box.rotation.x += 0.01 * (i + 1);
          box.rotation.y += 0.015 * (i + 1);
          
          // Scale based on scroll
          const scale = boxes[i].scale * (1 + scroll.offset * 2);
          box.scale.setScalar(scale);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {boxes.map((box, i) => (
        <Box
          key={i}
          ref={el => boxRefs.current[i] = el}
          args={[0.5, 0.5, 0.5]}
          position={box.position}
          rotation={box.rotation}
        >
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#ff0080" : "#00ff88"} 
            wireframe={i % 3 === 0}
            transparent
            opacity={0.8}
          />
        </Box>
      ))}
    </group>
  );
}

// Particle Field
function ParticleField() {
  const pointsRef = useRef();
  const particleCount = 1000;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff88"
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main Scene Component
function Scene3D() {
  const scroll = useScroll();
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} color="#ff0080" intensity={0.5} />
      
      {/* Background Elements */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      
      {/* Hero Section (Page 0) */}
      <group position={[0, 0, 0]}>
        <HeroSphere />
        <FloatingText position={[0, -2.5, 0]} size={0.8} color="#ffffff">
          Isaac Salas
        </FloatingText>
        <FloatingText position={[0, -3.2, 0]} size={0.4} color="#00ff88">
          Creative Developer
        </FloatingText>
      </group>
      
      {/* Work Section (Page 1) */}
      <group position={[0, -4, 0]}>
        <ScrollGeometry />
        <FloatingText position={[0, 0, 2]} size={0.6} color="#ff0080">
          My Work
        </FloatingText>
      </group>
      
      {/* About Section (Page 2) */}
      <group position={[0, -8, 0]}>
        <ParticleField />
        <FloatingText position={[0, 0, 2]} size={0.6} color="#00ff88">
          About Me
        </FloatingText>
      </group>
      
      {/* Contact Section (Page 3) */}
      <group position={[0, -12, 0]}>
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <Box args={[2, 2, 2]}>
            <meshStandardMaterial 
              color="#ffffff" 
              wireframe 
              transparent 
              opacity={0.3}
            />
          </Box>
        </Float>
        <FloatingText position={[0, 0, 2]} size={0.6} color="#ffffff">
          Get In Touch
        </FloatingText>
      </group>
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9} 
          height={300} 
          opacity={0.5}
        />
        <ChromaticAberration 
          offset={[0.0005, 0.0005]} 
        />
        <Vignette 
          eskil={false} 
          offset={0.1} 
          darkness={0.5}
        />
      </EffectComposer>
    </>
  );
}

export default Scene3D;