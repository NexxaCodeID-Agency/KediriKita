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

  const isBot =
    typeof window !== "undefined" &&
    /Lighthouse|Googlebot|Bingbot|Slurp|DuckDuckBot|Baidoospider|YandexBot|Sogou/i.test(
      navigator.userAgent,
    );

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
    !isBot
      ? (wrapperRef as React.RefObject<HTMLElement | null>)
      : { current: null },
    parallaxLayers,
  );

  // ─── Entrance animation ───────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // 🔥 JURUS BARU: Kalau bot atau prefersReduced, set durasi jadi 0 (Instan!)
    const isInstant = isBot || prefersReduced;

    if (prefersReduced && !isBot) {
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
      // Kita pakai fungsi ternary: kalau bot durasi = 0, kalau manusia durasi normal
      gsap.fromTo(
        megaRef.current,
        { opacity: 0 },
        { opacity: 0.7, duration: isInstant ? 0 : 1.6, ease: "power1.out" },
      );
      gsap.fromTo(
        awanRef.current,
        { opacity: 0 },
        {
          opacity: 0.95,
          duration: isInstant ? 0 : 2,
          ease: "power1.out",
          delay: isInstant ? 0 : 0.25,
        },
      );

      gsap.fromTo(
        gapuraKiriRef.current,
        { y: isInstant ? 0 : 130, opacity: 0, scale: isInstant ? 1 : 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: isInstant ? 0 : 2,
          ease: "power4.out",
          delay: isInstant ? 0 : 0.3,
        },
      );

      gsap.fromTo(
        gapuraKananRef.current,
        { y: isInstant ? 0 : 130, opacity: 0, scale: isInstant ? 1 : 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: isInstant ? 0 : 2,
          ease: "power4.out",
          delay: isInstant ? 0 : 0.48,
        },
      );

      gsap.fromTo(
        ornamenRef.current,
        { y: isInstant ? 0 : 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: isInstant ? 0 : 1.4,
          ease: "power3.out",
          delay: isInstant ? 0 : 0.75,
        },
      );
      gsap.fromTo(
        glowRef.current,
        { opacity: 0, scale: isInstant ? 1 : 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: isInstant ? 0 : 2.5,
          ease: "power1.out",
          delay: isInstant ? 0 : 0.9,
        },
      );
      gsap.fromTo(
        teksRef.current,
        { y: isInstant ? 0 : 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: isInstant ? 0 : 1.4,
          ease: "power3.out",
          delay: isInstant ? 0 : 1.0,
        },
      );
    });

    return () => ctx.revert();
  }, [ready, isBot]);

  // Scroll story dihilangkan: hero = 100vh full screen, scroll langsung ke section berikutnya
  // tanpa "gap" parallax. Entrance animation (gapura rising, awan fade, text appear) tetap ada
  // karena di-trigger oleh `ready`, bukan scroll.

  // ─── Mouse parallax ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isBot || window.innerWidth < 768) return;
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
        style={{
          height: "100dvh",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-langit-malam) 0%, #1e3050 28%, #5a4020 62%, var(--color-langit-senja) 80%, #6a8fbf 100%)",
          }}
        />

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

        {!isBot && (
          <div
            ref={particlesMountRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 2 }}
          />
        )}

        <div
          ref={megaRef}
          className="absolute inset-0"
          style={{
            willChange: "transform",
            zIndex: 3,
            opacity: isBot ? 0.7 : 0,
          }}
        >
          <Image
            src="/assets/images/mega.avif"
            alt="Latar Langit Mega"
            fill
            priority
            fetchPriority="high"
            style={{ objectFit: "cover", mixBlendMode: "overlay" }}
          />
        </div>

        <div
          ref={awanRef}
          className="absolute inset-0"
          style={{
            willChange: "transform",
            zIndex: 4,
            opacity: isBot ? 0.95 : 0,
          }}
        >
          <Image
            src="/assets/images/awan-putih.avif"
            alt="Latar Langit Awan Putih"
            fill
            priority
            fetchPriority="high"
            style={{ objectFit: "contain", objectPosition: "top center" }}
          />
        </div>

        <div
          ref={gapuraKiriRef}
          className="absolute bottom-0 left-0"
          style={{
            willChange: "transform",
            zIndex: 5,
            width: "clamp(180px, 48%, 520px)",
            height: "clamp(65%, 80%, 88%)",
            opacity: isBot ? 1 : 0,
          }}
        >
          <Image
            src="/assets/images/gapura-kiri.avif"
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

        <div
          ref={gapuraKananRef}
          className="absolute bottom-0 right-0"
          style={{
            willChange: "transform",
            zIndex: 5,
            width: "clamp(180px, 48%, 520px)",
            height: "clamp(65%, 80%, 88%)",
            opacity: isBot ? 1 : 0,
          }}
        >
          <Image
            src="/assets/images/gapura-kanan.avif"
            alt="Gapura Kota Kediri sisi kanan"
            fill
            priority
            style={{
              objectFit: "contain",
              transform: "scale(1.07)",
              transformOrigin: "bottom right",
              objectPosition: "bottom right",
            }}
          />
        </div>

        <div
          ref={ornamenRef}
          className="absolute bottom-0 left-0 right-0"
          style={{
            willChange: "transform",
            zIndex: 6,
            height: "80px",
            opacity: isBot ? 1 : 0,
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
            opacity: isBot ? 1 : 0,
            filter: "blur(2px)",
            willChange: "transform, opacity",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 9,
            background:
              "radial-gradient(ellipse 85% 85% at 50% 45%, transparent 35%, rgba(8,12,26,0.72) 100%)",
          }}
        />

        <div
          ref={teksRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-5"
          style={{
            willChange: "transform, filter",
            zIndex: 10,
            opacity: isBot ? 1 : 0,
          }}
        >
          <p
            className="hero-subtitle"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--color-emas-muda)",
              fontWeight: 600,
              textTransform: "uppercase",
              textShadow:
                "0 2px 6px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.9), 0 0 15px rgba(240,192,64,0.4)",
              opacity: 1,
              textAlign: "center",
            }}
          >
            ✦ Selamat Datang di ✦
          </p>

          <h1
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(2.6rem, 11vw, 6.8rem)",
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
            className="hero-desc"
            style={{
              fontFamily: "var(--font-lato)",
              color: "#FFFFFF",
              fontWeight: 400,
              textAlign: "center",
              textShadow:
                "0 2px 4px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.8)",
              lineHeight: 1.9,
              textTransform: "uppercase",
            }}
          >
            Temukan keindahan, sejarah, dan kehangatan kota Kediri — kota yang
            selalu punya cerita untukmu.
          </p>

          {!isBot && (
            <div
              className="hero-scroll-indicator absolute flex flex-col items-center gap-2"
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
          )}
        </div>
      </div>
    </div>
  );
}
