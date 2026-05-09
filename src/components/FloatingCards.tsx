"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PHOTOS = [
  { src: "/assets/images/gethukpisang.avif", label: "Getuk Pisang" },
  { src: "/assets/images/Gkelud.webp", label: "Gunung Kelud" },
  { src: "/assets/images/jaranan.jpg", label: "Jaranan" },
  { src: "/assets/images/airlanga.jpeg", label: "Airlangga" },
];

// Posisi digeser ke kanan (+1.0) supaya tidak bertabrakan dengan card info di kiri
const POSITIONS: [number, number, number][] = [
  [-0.7, 1.3, -0.5],
  [2.5, 1.4, 0.3],
  [-0.3, -1.2, 0.1],
  [2.6, -1.0, -0.3],
];

const ROTATIONS: [number, number, number][] = [
  [-0.15, 0.25, 0.18],
  [0.1, -0.2, -0.12],
  [0.2, 0.15, -0.22],
  [-0.08, -0.18, 0.15],
];

interface CardUD {
  baseY: number;
  speed: number;
  amp: number;
  border?: THREE.Mesh;
  borderMat?: THREE.MeshBasicMaterial;
}

export default function FloatingCards() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // ── Renderer ──────────────────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      const originalError = console.error;
      console.error = () => {}; // Mute console error untuk hindari pop-up error Nextjs
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      console.error = originalError;

      if (!renderer.getContext()) return; // Batalkan aman jika WebGL tidak ada
    } catch {
      return;
    }

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 5;

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xf0d080, 1.2);
    dirLight.position.set(3, 5, 5);
    scene.add(dirLight);

    const loader = new THREE.TextureLoader();

    // ── Foto cards ────────────────────────────────────────────────────────
    const cards: THREE.Mesh[] = [];

    const currentPositions = isMobile
      ? [
          [-0.6, 1.8, -1.0],
          [0.6, 1.6, -0.5],
          [-0.5, -1.9, -0.2],
          [0.5, -1.7, -0.8],
        ] // Lebih rapat untuk mobile
      : POSITIONS;

    PHOTOS.forEach((photo, i) => {
      const tex = loader.load(photo.src);
      tex.colorSpace = THREE.SRGBColorSpace;

      const geo = new THREE.PlaneGeometry(1.1, 1.47);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
      });

      const mesh = new THREE.Mesh(geo, mat);
      const [x, y, z] = currentPositions[i];
      mesh.position.set(x, y - 2, z);
      mesh.rotation.set(...ROTATIONS[i]);

      const ud: CardUD = {
        baseY: y,
        speed: 0.4 + Math.random() * 0.3,
        amp: 0.06 + Math.random() * 0.06,
      };
      mesh.userData = ud;
      scene.add(mesh);
      cards.push(mesh);

      // Border emas di belakang
      const borderGeo = new THREE.PlaneGeometry(1.18, 1.55);
      const borderMat = new THREE.MeshBasicMaterial({
        color: 0xc8a84b,
        transparent: true,
        opacity: 0,
      });
      const border = new THREE.Mesh(borderGeo, borderMat);
      border.position.set(x, y - 2, z - 0.02);
      border.rotation.set(...ROTATIONS[i]);
      ud.border = border;
      ud.borderMat = borderMat;
      scene.add(border);
    });

    // ── Icon tengah (focal point) ─────────────────────────────────────────
    const iconTex = loader.load("/assets/images/icontengah.avif");
    iconTex.colorSpace = THREE.SRGBColorSpace;

    // Glow ring di belakang icon
    const ringGeo = new THREE.RingGeometry(0.72, 0.92, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    const centerX = isMobile ? 0 : 1.0;
    const centerY = isMobile ? 3.0 : 0;
    ring.position.set(centerX, centerY, 0.48);
    scene.add(ring);

    // Ring luar (lebih besar, lebih pudar)
    const ring2Geo = new THREE.RingGeometry(0.96, 1.08, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xd4a017,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.set(centerX, centerY, 0.47);
    scene.add(ring2);

    // Icon itu sendiri
    const iconGeo = new THREE.PlaneGeometry(1.3, 1.3);
    const iconMat = new THREE.MeshStandardMaterial({
      map: iconTex,
      transparent: true,
      opacity: 0,
    });
    const icon = new THREE.Mesh(iconGeo, iconMat);
    icon.position.set(centerX, centerY, 0.5);
    scene.add(icon);

    // ── Scroll ────────────────────────────────────────────────────────────
    let scrollProgress = 0;
    const onScroll = () => {
      const el = document.documentElement;
      scrollProgress = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Mouse parallax ────────────────────────────────────────────────────
    let mouseX = 0,
      mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Pause loop when off-screen ────────────────────────────────────────
    let visible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    observer.observe(mount);

    // ── Animation loop ────────────────────────────────────────────────────
    let raf: number;
    const startTime = performance.now();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      const t = (performance.now() - startTime) / 1000;

      const scrolled = scrollProgress > 0.08;
      const targetOp = scrolled ? 1 : 0;

      // Foto cards
      cards.forEach((card, i) => {
        const ud = card.userData as CardUD;
        const mat = card.material as THREE.MeshStandardMaterial;
        if (!ud.border || !ud.borderMat) return;

        mat.opacity += (targetOp - mat.opacity) * 0.05;
        ud.borderMat.opacity = mat.opacity * 0.9;

        const floatY = ud.baseY + Math.sin(t * ud.speed + i) * ud.amp;
        const targetY = scrolled ? floatY : ud.baseY - 2.5;
        card.position.y += (targetY - card.position.y) * 0.06;
        ud.border.position.y = card.position.y;

        card.position.x +=
          (currentPositions[i][0] +
            mouseX * 0.08 * (i % 2 === 0 ? 1 : -1) -
            card.position.x) *
          0.04;
        ud.border.position.x = card.position.x;

        card.rotation.z = ROTATIONS[i][2] + Math.sin(t * 0.3 + i * 1.3) * 0.015;
        ud.border.rotation.z = card.rotation.z;
      });

      // Icon tengah — float ringan + fade in
      const iconTargetOp = scrolled ? 0.92 : 0;
      const ringTargetOp = scrolled ? 0.55 : 0;
      const ring2TargetOp = scrolled ? 0.25 : 0;
      iconMat.opacity += (iconTargetOp - iconMat.opacity) * 0.05;
      ringMat.opacity += (ringTargetOp - ringMat.opacity) * 0.05;
      ring2Mat.opacity += (ring2TargetOp - ring2Mat.opacity) * 0.05;

      // Float vertikal icon
      icon.position.y = centerY + Math.sin(t * 0.55) * 0.055;
      ring.position.y = icon.position.y;
      ring2.position.y = icon.position.y;

      // Rotasi ring perlahan
      ring.rotation.z += 0.003;
      ring2.rotation.z -= 0.002;

      // Glow ring pulse opacity
      ringMat.opacity =
        (scrolled ? 0.55 : 0) + Math.sin(t * 1.2) * 0.08 * (scrolled ? 1 : 0);

      // Mouse parallax ringan pada icon
      icon.position.x = centerX + mouseX * 0.05;
      ring.position.x = icon.position.x;
      ring2.position.x = icon.position.x;

      // Camera subtle parallax
      camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minHeight: "100vh" }}
    />
  );
}
