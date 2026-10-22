import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshTransmissionMaterial, Sparkles, ContactShadows, Torus, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function ThreadRing({ radius, tube, speed, tilt = 0, color = '#a7f5d5' }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
      ref.current.rotation.x = tilt + Math.sin(performance.now() * 0.0003) * 0.08;
    }
  });
  return <Torus ref={ref} args={[radius, tube, 12, 160]} rotation={[tilt, 0, 0]}>
    <meshStandardMaterial color={color} metalness={0.65} roughness={0.24} emissive={color} emissiveIntensity={0.18} />
  </Torus>;
}

function YarnSpool() {
  const group = useRef();
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.24;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.045;
    }
  });
  return <group ref={group}>
    <mesh position={[0, 0, 0]} castShadow>
      <cylinderGeometry args={[0.83, 0.83, 1.75, 96, 18, true]} />
      <meshStandardMaterial color="#0b7e70" roughness={0.44} metalness={0.12} side={THREE.DoubleSide} />
    </mesh>
    {Array.from({ length: 38 }, (_, i) => (
      <mesh key={i} rotation={[0, 0, (i / 38) * Math.PI]} position={[0, (i % 2) * 0.018 - 0.009, 0]}>
        <torusGeometry args={[0.83 + Math.sin(i * 0.7) * 0.012, 0.014, 6, 96]} />
        <meshStandardMaterial color={i % 3 === 0 ? '#44cbb0' : '#0b5e55'} roughness={0.52} />
      </mesh>
    ))}
    <mesh position={[0, 0.91, 0]} castShadow>
      <cylinderGeometry args={[0.91, 0.91, 0.12, 96]} />
      <meshStandardMaterial color="#d3b478" metalness={0.72} roughness={0.24} />
    </mesh>
    <mesh position={[0, -0.91, 0]} castShadow>
      <cylinderGeometry args={[0.91, 0.91, 0.12, 96]} />
      <meshStandardMaterial color="#bd9a5b" metalness={0.72} roughness={0.24} />
    </mesh>
    <mesh position={[0, 0.985, 0]}>
      <cylinderGeometry args={[0.19, 0.19, 0.025, 48]} />
      <meshStandardMaterial color="#071815" metalness={0.3} roughness={0.3} />
    </mesh>
    <mesh position={[0, -0.985, 0]}>
      <cylinderGeometry args={[0.19, 0.19, 0.025, 48]} />
      <meshStandardMaterial color="#071815" metalness={0.3} roughness={0.3} />
    </mesh>
  </group>;
}

function OrbitingFibres() {
  const group = useRef();
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.12; });
  return <group ref={group}>
    <ThreadRing radius={1.45} tube={0.009} speed={0.15} tilt={0.9} color="#d8bd7c" />
    <ThreadRing radius={1.68} tube={0.006} speed={-0.12} tilt={1.3} color="#9af0d0" />
    <ThreadRing radius={1.85} tube={0.005} speed={0.09} tilt={0.3} color="#6cbca8" />
    <Float speed={1.7} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh position={[1.5, 0.7, 0.1]}>
        <octahedronGeometry args={[0.085, 0]} />
        <meshStandardMaterial color="#e6c989" metalness={0.8} roughness={0.2} emissive="#b18b45" emissiveIntensity={0.35} />
      </mesh>
    </Float>
    <Float speed={1.3} rotationIntensity={1.5} floatIntensity={1.1}>
      <mesh position={[-1.55, -0.8, 0.25]}>
        <icosahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial color="#b8f2d6" metalness={0.6} roughness={0.25} />
      </mesh>
    </Float>
  </group>;
}

export default function Scene({ compact = false }) {
  return <div className={`three-scene ${compact ? 'three-scene-compact' : ''}`}>
    <Canvas shadows dpr={[1, 1.7]} camera={{ position: [0, 0.2, 5.5], fov: 37 }} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#071815']} />
      <fog attach="fog" args={['#071815', 5, 11]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} castShadow />
      <pointLight position={[-3, 1, 2]} color="#56dfb5" intensity={18} distance={7} />
      <pointLight position={[2, -2, -1]} color="#d8b779" intensity={8} distance={5} />
      <Suspense fallback={null}>
        <Float speed={1.15} rotationIntensity={0.12} floatIntensity={0.22}>
          <YarnSpool />
        </Float>
        <OrbitingFibres />
        <Sparkles count={85} scale={5.5} size={2.2} speed={0.3} opacity={0.62} color="#b8f2d6" />
        <Sparkles count={28} scale={4.2} size={3.1} speed={0.18} opacity={0.35} color="#d8b779" />
        <ContactShadows position={[0, -1.65, 0]} opacity={0.45} scale={5} blur={2.8} far={3.5} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
    <div className="scene-scanline" />
    <span className="scene-caption">FIBRO / MATERIAL STUDY 001</span>
  </div>;
}

export function MiniScene({ index = 0 }) {
  const palette = ['#0d8a78', '#d1b579', '#6b9dc2', '#b69ad8'];
  const color = palette[index % palette.length];
  return <div className="mini-scene">
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.6], fov: 42 }}>
      <ambientLight intensity={1.5} />
      <pointLight position={[2, 2, 3]} intensity={2.5} color="#fff0cc" />
      <pointLight position={[-2, -1, 1]} intensity={3} color={color} />
      <Float speed={1.8} rotationIntensity={0.7} floatIntensity={0.8}>
        <mesh rotation={[0.4, 0.4, 0.2]}>
          <icosahedronGeometry args={[0.72, 2]} />
          <MeshTransmissionMaterial color={color} roughness={0.24} thickness={0.65} transmission={0.1} metalness={0.45} />
        </mesh>
        <Torus args={[0.96, 0.012, 8, 90]} rotation={[0.9, 0.3, 0.5]}>
          <meshStandardMaterial color="#d7b779" metalness={0.8} roughness={0.25} />
        </Torus>
      </Float>
      <Sparkles count={14} scale={2.7} size={2} speed={0.3} color={color} />
    </Canvas>
  </div>;
}
