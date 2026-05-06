"use client";

import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useParallax } from "@/hooks/useParallax";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useReady } from "@/components/ClientLayout";

gsap.registerPlugin(ScrollTrigger);

const ORNAMEN_DOTS = Array.from({ length: 12 }, (_, i) => ({
  key: i,
  cx: 60 + i * 120,
}));

const PARALLAX_SPEED_FACTOR = {
  mega: 0.2,
  awan: 0.4,
  gapura: 0.7,
  ornamen: 0.9,
  teks: 1.0,
} as const;

export default function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skyOverlayRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const awanRef = useRef<HTMLDivElement>(null);
  const gapuraKiriRef = useRef<HTMLDivElement>(null);
  const gapuraKananRef = useRef<HTMLDivElement>(null);
  const ornamenRef = useRef<HTMLDivElement>(null);
  const gateRevealRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const teksRef = useRef<HTMLDivElement>(null);
  const particlesMountRef = useThreeScene();
  const ready = useReady();

  const parallaxLayers = useMemo(
    () => [
      {
        ref: megaRef as React.RefObject<HTMLElement | null>,
        speed: PARALLAX_SPEED_FACTOR.mega,
      },
      {
        ref: awanRef as React.RefObject<HTMLElement | null>,
        speed: PARALLAX_SPEED_FACTOR.awan,
      },
      {
        ref: gapuraKiriRef as React.RefObject<HTMLElement | null>,
        speed: PARALLAX_SPEED_FACTOR.gapura,
      },
      {
        ref: gapuraKananRef as React.RefObject<HTMLElement | null>,
        speed: PARALLAX_SPEED_FACTOR.gapura,
      },
      {
        ref: ornamenRef as React.RefObject<HTMLElement | null>,
        speed: PARALLAX_SPEED_FACTOR.ornamen,
      },
      {
        ref: teksRef as React.RefObject<HTMLElement | null>,
        speed: PARALLAX_SPEED_FACTOR.teks,
      },
    ],
    [],
  );

  useParallax(
    wrapperRef as React.RefObject<HTMLElement | null>,
    parallaxLayers,
  );

  // ─── Entrance animation ───────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      gsap.set(
        [
          megaRef.current,
          awanRef.current,
          gapuraKiriRef.current,
          gapuraKananRef.current,
          ornamenRef.current,
          teksRef.current,
          glowRef.current,
        ],
        { opacity: 1 },
      );
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        megaRef.current,
        { opacity: 0 },
        { opacity: 0.7, duration: 1.6, ease: "power1.out" },
      );
      gsap.fromTo(
        awanRef.current,
        { opacity: 0 },
        { opacity: 0.95, duration: 2, ease: "power1.out", delay: 0.25 },
      );
      gsap.fromTo(
        gapuraKiriRef.current,
        { y: 130, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power4.out",
          delay: 0.3,
        },
      );
      gsap.fromTo(
        gapuraKananRef.current,
        { y: 130, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power4.out",
          delay: 0.48,
        },
      );
      gsap.fromTo(
        ornamenRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.75 },
      );
      gsap.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 2.5, ease: "power1.out", delay: 0.9 },
      );
      gsap.fromTo(
        teksRef.current,
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 1.0 },
      );
    });

    return () => ctx.revert();
  }, [ready]);

  // ─── Scroll story ─────────────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      // 1. Langit makin gelap sepanjang scroll
      gsap.to(skyOverlayRef.current, {
        opacity: 0.82,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });

      // 2. Gapura membuka — bergerak ke sisi, seperti pintu terbuka
      const spreadCfg = {
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: wrapper,
          start: "28% top",
          end: "bottom top",
          scrub: 2.5,
        },
      };
      gsap.to(gapuraKiriRef.current, { x: "-14vw", ...spreadCfg });
      gsap.to(gapuraKananRef.current, { x: "14vw", ...spreadCfg });

      // 3. Title blur saat menghilang
      gsap.to(teksRef.current, {
        filter: "blur(6px)",
        ease: "power1.in",
        scrollTrigger: {
          trigger: wrapper,
          start: "20% top",
          end: "60% top",
          scrub: 1,
        },
      });

      // 4. Cahaya kota muncul di antara gapura yang terbuka
      gsap.fromTo(
        gateRevealRef.current,
        { opacity: 0, scale: 0.08 },
        {
          opacity: 1,
          scale: 6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: wrapper,
            start: "52% top",
            end: "bottom top",
            scrub: 2,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  // ─── Mouse parallax ───────────────────────────────────────────────────────
  useEffect(() => {
    if (window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = [
      { el: megaRef.current, strength: 7 },
      { el: awanRef.current, strength: 13 },
      { el: gapuraKiriRef.current, strength: 22 },
      { el: gapuraKananRef.current, strength: 22 },
      { el: glowRef.current, strength: 18 },
      { el: teksRef.current, strength: 30 },
    ];
    const setters = layers.map(({ el, strength }) => ({
      setX: el
        ? gsap.quickTo(el, "x", { duration: 1.6, ease: "power3.out" })
        : null,
      strength,
    }));

    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      setters.forEach(({ setX, strength }) => setX?.(dx * strength));
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      layers.forEach(({ el }) => {
        if (el) gsap.to(el, { x: 0, duration: 0.6 });
      });
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative hero-wrapper">
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* z0 — Sky gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-langit-malam) 0%, #1e3050 28%, #5a4020 62%, var(--color-langit-senja) 80%, #6a8fbf 100%)",
          }}
        />

        {/* z1 — Sky darkening overlay */}
        <div
          ref={skyOverlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: "var(--color-langit-malam)",
            opacity: 0,
            willChange: "opacity",
          }}
        />

        {/* z2 — Three.js partikel emas */}
        <div
          ref={particlesMountRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 2 }}
        />

        {/* z3 — Mega */}
        <div
          ref={megaRef}
          className="absolute inset-0"
          style={{ willChange: "transform", zIndex: 3, opacity: 0 }}
        >
          <Image
            src="/assets/images/mega.png"
            alt=""
            fill
            style={{ objectFit: "cover", mixBlendMode: "overlay" }}
          />
        </div>

        {/* z4 — Awan putih */}
        <div
          ref={awanRef}
          className="absolute inset-0"
          style={{ willChange: "transform", zIndex: 4, opacity: 0 }}
        >
          <Image
            src="/assets/images/awan-putih.png"
            alt=""
            fill
            style={{ objectFit: "contain", objectPosition: "top center" }}
          />
        </div>

        {/* z5 — Gapura kiri */}
        <div
          ref={gapuraKiriRef}
          className="absolute bottom-0 left-0"
          style={{
            willChange: "transform",
            zIndex: 5,
            width: "clamp(180px, 48%, 520px)",
            height: "clamp(65%, 80%, 88%)",
            opacity: 0,
          }}
        >
          <Image
            src="/assets/images/gapura-kiri.png"
            alt="Gapura Kota Kediri sisi kiri"
            fill
            priority
            style={{
              objectFit: "contain",
              objectPosition: "bottom left",
              transform: "scale(1.07)",
              transformOrigin: "bottom left",
            }}
          />
        </div>

        {/* z5 — Gapura kanan */}
        <div
          ref={gapuraKananRef}
          className="absolute bottom-0 right-0"
          style={{
            willChange: "transform",
            zIndex: 5,
            width: "clamp(180px, 48%, 520px)",
            height: "clamp(65%, 80%, 88%)",
            opacity: 0,
          }}
        >
          <Image
            src="/assets/images/gapura-kanan.png"
            alt="Gapura Kota Kediri sisi kanan"
            fill
            priority
            style={{ objectFit: "contain", objectPosition: "bottom right" }}
          />
        </div>

        {/* z6 — Ornamen bawah */}
        <div
          ref={ornamenRef}
          className="absolute bottom-0 left-0 right-0"
          style={{
            willChange: "transform",
            zIndex: 6,
            height: "80px",
            opacity: 0,
          }}
        >
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40 Q120 8 240 40 Q360 72 480 40 Q600 8 720 40 Q840 72 960 40 Q1080 8 1200 40 Q1320 72 1440 40 V80 H0 Z"
              fill="var(--color-emas)"
              opacity="0.2"
            />
            <path
              d="M0 54 Q120 22 240 54 Q360 86 480 54 Q600 22 720 54 Q840 86 960 54 Q1080 22 1200 54 Q1320 86 1440 54 V80 H0 Z"
              fill="var(--color-ornamen)"
              opacity="0.4"
            />
            {ORNAMEN_DOTS.map(({ key, cx }) => (
              <circle
                key={key}
                cx={cx}
                cy={40}
                r={2.5}
                fill="var(--color-emas-muda)"
                opacity="0.55"
              />
            ))}
          </svg>
        </div>

        {/* z7 — Gate reveal: cahaya yang muncul di balik gapura yang terbuka */}
        <div
          ref={gateRevealRef}
          className="absolute pointer-events-none"
          style={{
            zIndex: 7,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.08)",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(240,200,100,0.95) 0%, rgba(212,160,23,0.5) 35%, transparent 70%)",
            opacity: 0,
            filter: "blur(8px)",
            willChange: "transform, opacity",
          }}
        />

        {/* z8 — Glow di balik judul */}
        <div
          ref={glowRef}
          className="absolute pointer-events-none"
          style={{
            zIndex: 8,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(300px, 65vw, 1000px)",
            height: "clamp(200px, 30vh, 320px)",
            background:
              "radial-gradient(ellipse, rgba(212,160,23,0.18) 0%, rgba(212,160,23,0.05) 40%, transparent 68%)",
            opacity: 0,
            filter: "blur(2px)",
            willChange: "transform, opacity",
          }}
        />

        {/* z9 — Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 9,
            background:
              "radial-gradient(ellipse 85% 85% at 50% 45%, transparent 35%, rgba(8,12,26,0.72) 100%)",
          }}
        />

        {/* z10 — Teks konten */}
        <div
          ref={teksRef}
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ willChange: "transform, filter", zIndex: 10, opacity: 0 }}
        >
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--color-emas-muda)",
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              textShadow:
                "0 2px 6px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.9), 0 0 15px rgba(240,192,64,0.4)",
              marginBottom: "1.1rem",
              opacity: 1,
            }}
          >
            ✦ Selamat Datang di ✦
          </p>

          <h1
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(3.6rem, 10vw, 6.8rem)",
              fontWeight: 900,
              letterSpacing: "0.08em",
              textAlign: "center",
              lineHeight: 1.05,
            }}
          >
            <span
              style={{
                color: "var(--color-teks-utama)",
                textShadow:
                  "0 4px 40px rgba(0,0,0,0.9), 0 0 80px rgba(212,160,23,0.25)",
              }}
            >
              KOTA
            </span>{" "}
            <span
              style={{
                color: "var(--color-emas-muda)",
                textShadow:
                  "0 4px 40px rgba(0,0,0,0.9), 0 0 60px rgba(240,192,64,0.4)",
              }}
            >
              KEDIRI
            </span>
          </h1>

          <div
            style={{
              width: "clamp(100px, 18vw, 220px)",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, var(--color-emas), transparent)",
              margin: "1.4rem 0 1.3rem",
              opacity: 0.8,
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-lato)",
              color: "#FFFFFF",
              fontSize: "0.85rem",
              fontWeight: 400,
              textAlign: "center",
              maxWidth: "min(26rem, 88vw)",
              letterSpacing: "0.12em",
              textShadow:
                "0 2px 4px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.8)",
              lineHeight: 1.9,
              textTransform: "uppercase",
            }}
          >
            Temukan keindahan, sejarah, dan kehangatan kota Kediri — kota yang
            selalu punya cerita untukmu.
          </p>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 flex flex-col items-center gap-2"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
            }}
          >
            <span style={{ textTransform: "uppercase" }}>Scroll</span>
            <svg width="16" height="30" viewBox="0 0 16 30" fill="none">
              <path
                d="M1 2 L8 9 L15 2"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="chevron-1"
              />
              <path
                d="M1 11 L8 18 L15 11"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="chevron-2"
              />
              <path
                d="M1 20 L8 27 L15 20"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="chevron-3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
