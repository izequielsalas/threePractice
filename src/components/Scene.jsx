import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Model() {
  const gltf = useGLTF('/scene.glb') // Update with your path
  return <primitive object={gltf.scene} dispose={null} />
}

function SceneInner() {
  const { camera, gl } = useThree()
  const cameraRef = useRef(camera)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(camera.position, {
        scrollTrigger: {
          trigger: '#main',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        },
        x: 2,
        y: 2,
        z: 6,
        ease: 'power1.inOut'
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <spotLight
        position={[5, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1.2}
        castShadow
      />

      {/* 3D Model */}
      <Model />

      {/* Environment (HDRI lighting, optional) */}
      <Environment preset="warehouse" />

      {/* Postprocessing */}
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.2} />
        <Vignette eskil={false} offset={0.1} darkness={0.9} />
      </EffectComposer>

      <OrbitControls enableZoom={false} />
    </>
  )
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1, 5], fov: 50 }}
      gl={{ antialias: true }}
    >
      <SceneInner />
    </Canvas>
  )
}
