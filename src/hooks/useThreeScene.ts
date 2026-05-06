'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 320;

export function useThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Skip GPU-heavy particles on mobile — per CLAUDE.md
    if (window.innerWidth < 768) return;

    let renderer: THREE.WebGLRenderer;
    try {
      // Menyimpan dan mematikan console.error sementara untuk menghindari 
      // Next.js dev overlay pop-up saat device tidak support WebGL
      const originalError = console.error;
      console.error = () => {};
      
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: false,
        powerPreference: "low-power" // fallback ke low power jika ada masalah GPU
      });
      
      console.error = originalError;
      
      // Jika konteks tetap tidak terbuat (meski tak ada error yang tertangkap)
      if (!renderer.getContext()) {
        return;
      }
    } catch (e) {
      return; // Batalkan animasi 3D, kembali ke mode polos
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    // Variasi posisi, kecepatan, dan ukuran per partikel
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const driftX = new Float32Array(PARTICLE_COUNT);
    const driftY = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sizes[i]  = 0.03 + Math.random() * 0.07;
      driftX[i] = (Math.random() - 0.5) * 0.0015;
      driftY[i] = 0.0008 + Math.random() * 0.0025;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Tekstur bulat untuk partikel yang lebih halus
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 32;
    canvas2d.height = 32;
    const ctx2d = canvas2d.getContext('2d')!;
    const grad = ctx2d.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(240,192,64,1)');
    grad.addColorStop(0.5, 'rgba(240,192,64,0.4)');
    grad.addColorStop(1, 'rgba(240,192,64,0)');
    ctx2d.fillStyle = grad;
    ctx2d.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas2d);

    const material = new THREE.PointsMaterial({
      map: texture,
      size: 0.12,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const ro = new ResizeObserver(() => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    let animId: number;
    const pos = geometry.attributes.position.array as Float32Array;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3]     += driftX[i];
        pos[i * 3 + 1] += driftY[i];
        if (pos[i * 3 + 1] > 7)  pos[i * 3 + 1] = -7;
        if (pos[i * 3]     > 12) pos[i * 3]     = -12;
        if (pos[i * 3]     < -12) pos[i * 3]    =  12;
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return mountRef;
}
