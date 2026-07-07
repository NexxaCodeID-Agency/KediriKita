"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 65;

  const { positions, speeds, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const off = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1;
      spd[i] = 0.015 + Math.random() * 0.055;
      off[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, speeds: spd, offsets: off };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Float upwards infinitely by wrapping the Y value
      posAttr.array[idx + 1] = ((positions[idx + 1] + t * speeds[i] + 4) % 8) - 4;
      posAttr.array[idx] = positions[idx] + Math.sin(t * 0.2 * speeds[i] + offsets[i]) * 0.15;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.slice(), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#F0C040"
        transparent
        opacity={0.38}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function TimelineParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#050509", 3, 8]} />
        <ambientLight intensity={0.4} />
        <Particles />
      </Canvas>
    </div>
  );
}
