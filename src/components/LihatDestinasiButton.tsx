"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";

export default function LihatDestinasiButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const spawnRippleRef = useRef<((cx: number, cy: number) => void) | null>(null);
  // Selalu punya referensi onClick terbaru tanpa re-run effect
  const onClickRef = useRef(onClick);
  useEffect(() => { onClickRef.current = onClick; }, [onClick]);

  // Three.js effect — hanya untuk visual ripple, tidak handle navigasi
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 400;
    const H = mount.clientHeight || 80;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      if (!renderer.getContext()) return;
    } catch {
      return;
    }

    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -W / 2, W / 2, H / 2, -H / 2, 0.1, 100
    );
    camera.position.z = 10;

    const clock = new THREE.Clock();
    const ripples: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; born: number }[] = [];

    // Expose spawnRipple agar bisa dipanggil dari React onClick
    spawnRippleRef.current = (cx: number, cy: number) => {
      for (let ring = 0; ring < 3; ring++) {
        const geo = new THREE.RingGeometry(1, 1.8, 64);
        const mat = new THREE.MeshBasicMaterial({
          color: 0xf0d080,
          transparent: true,
          opacity: 0.85 - ring * 0.2,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(cx, cy, 0);
        const born = clock.getElapsedTime() + ring * 0.12;
        scene.add(mesh);
        ripples.push({ mesh, mat, born });
      }
    };

    let raf: number;
    const MAX_RADIUS = Math.max(W, H) * 0.7;
    const DURATION = 0.9;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      for (let i = ripples.length - 1; i >= 0; i--) {
        const { mesh, mat, born } = ripples[i];
        const age = t - born;
        if (age < 0) continue;

        const progress = age / DURATION;
        if (progress >= 1) {
          scene.remove(mesh);
          mesh.geometry.dispose();
          mat.dispose();
          ripples.splice(i, 1);
          continue;
        }

        mesh.scale.setScalar(4 + progress * MAX_RADIUS);
        mat.opacity = (1 - progress) * 0.7;
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth || 400;
      const h = mount.clientHeight || 80;
      renderer.setSize(w, h);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      spawnRippleRef.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []); // tidak ada dependency — effect hanya jalan sekali

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const mount = mountRef.current;
    if (mount && spawnRippleRef.current) {
      const rect = mount.getBoundingClientRect();
      const W = mount.clientWidth || 400;
      const H = mount.clientHeight || 80;
      const cx = e.clientX - rect.left - W / 2;
      const cy = -(e.clientY - rect.top - H / 2);
      spawnRippleRef.current(cx, cy);
    }
    // Delay agar ripple sempat muncul, lalu navigasi
    setTimeout(() => onClickRef.current?.(), 350);
  }, []);

  return (
    <div
      onClick={handleClick}
      className="relative inline-flex items-center justify-center select-none cursor-pointer"
    >
      {/* Three.js canvas — pointer-events none agar tidak block klik */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
      />

      {/* Layout button */}
      <div className="relative flex items-center justify-center group transition-transform duration-300 hover:scale-105">
        {/* Ornamen KIRI */}
        <Image
          src="/assets/images/ornamen-kiri.avif"
          alt="ornamen kiri"
          width={170}
          height={65}
          className="object-contain shrink-0 relative z-10 transition-all duration-300 group-hover:brightness-110"
          style={{
            filter:
              "drop-shadow(0 4px 6px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(212,160,23,0.4))",
            width: "clamp(72px, 22vw, 170px)",
            marginRight: "-12px",
          }}
        />

        {/* Oval tengah */}
        <div className="relative shrink-0 z-30">
          <svg
            viewBox="0 0 190 54"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300 group-hover:brightness-110"
            style={{
              width: "clamp(120px, 30vw, 190px)",
              height: "auto",
              filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.9))",
            }}
          >
            <ellipse cx="95" cy="27" rx="91" ry="24"
              fill="rgba(18, 20, 30, 0.85)" stroke="#c8a84b" strokeWidth="2" />
            <ellipse cx="95" cy="27" rx="86" ry="19"
              fill="none" stroke="#c8a84b" strokeWidth="1" opacity="0.5" />
            <text
              x="95" y="32"
              textAnchor="middle"
              fontFamily="'Playfair Display', Georgia, serif"
              fontSize="14"
              fontWeight="bold"
              letterSpacing="2.5"
              fill="#c8a84b"
            >
              LIHAT DESTINASI
            </text>
          </svg>
        </div>

        {/* Ornamen KANAN */}
        <Image
          src="/assets/images/ornamen-kanan.avif"
          alt="ornamen kanan"
          width={170}
          height={65}
          className="object-contain shrink-0 relative z-10 transition-all duration-300 group-hover:brightness-110"
          style={{
            filter:
              "drop-shadow(0 4px 6px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(212,160,23,0.4))",
            width: "clamp(72px, 22vw, 170px)",
            marginLeft: "-12px",
          }}
        />
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,168,75,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
