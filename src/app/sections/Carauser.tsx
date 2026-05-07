"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CircularGallery from "../../components/CircularGallery";

const ORNAMEN_DOTS = Array.from({ length: 10 }, (_, i) => ({ key: i, cx: 60 + i * 132 }));

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  { image: "/assets/images/gethukpisang.avif", text: "Getuk Pisang" },
  { image: "/assets/images/Gkelud.webp",       text: "Gunung Kelud" },
  { image: "/assets/images/jaranan.jpg",        text: "Jaranan"      },
  { image: "/assets/images/airlanga.jpeg",      text: "Airlangga"    },
];

export default function Carauser() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const section = sectionRef.current;
    if (!heading || !section) return;

    const targets = heading.querySelectorAll(".gsap-heading-target");

    gsap.set(targets, { y: 30, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });

    tl.to(targets, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.15,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <div ref={sectionRef} className="carauser-wrapper relative w-full">
      <div className="carauser-sticky sticky overflow-hidden top-0 w-full">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #08080f 0%, var(--color-langit-malam) 100%)",
          }}
        />

        {/* Ambient glow tengah atas */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(212,160,23,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Ornamen pembatas atas */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ zIndex: 25, height: "72px" }}
        >
          <svg
            viewBox="0 0 1440 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 36 Q120 8 240 36 Q360 64 480 36 Q600 8 720 36 Q840 64 960 36 Q1080 8 1200 36 Q1320 64 1440 36 V0 H0 Z"
              fill="var(--color-emas)"
              opacity="0.10"
            />
            <path
              d="M0 48 Q120 20 240 48 Q360 76 480 48 Q600 20 720 48 Q840 76 960 48 Q1080 20 1200 48 Q1320 76 1440 48 V0 H0 Z"
              fill="var(--color-ornamen)"
              opacity="0.22"
            />
            <line x1="0" y1="36" x2="660" y2="36" stroke="rgba(212,160,23,0.22)" strokeWidth="0.5" />
            <line x1="780" y1="36" x2="1440" y2="36" stroke="rgba(212,160,23,0.22)" strokeWidth="0.5" />
            <rect x="714" y="30" width="12" height="12" fill="var(--color-emas)" opacity="0.65" transform="rotate(45 720 36)" />
            {ORNAMEN_DOTS.map(({ key, cx }) => (
              <circle key={key} cx={cx} cy={36} r={2} fill="var(--color-emas-muda)" opacity="0.35" />
            ))}
          </svg>
        </div>

        {/* Edge fade — kiri */}
        <div
          className="absolute top-0 left-0 h-full pointer-events-none"
          style={{
            width: "clamp(80px, 10vw, 160px)",
            background:
              "linear-gradient(to right, #0a0a0f 0%, transparent 100%)",
            zIndex: 15,
          }}
        />

        {/* Edge fade — kanan */}
        <div
          className="absolute top-0 right-0 h-full pointer-events-none"
          style={{
            width: "clamp(80px, 10vw, 160px)",
            background:
              "linear-gradient(to left, #0a0a0f 0%, transparent 100%)",
            zIndex: 15,
          }}
        />

        {/* Heading section */}
        <div
          ref={headingRef}
          className="absolute top-0 left-0 right-0 flex flex-col items-center pointer-events-none"
          style={{ paddingTop: "clamp(2rem, 5vh, 3.5rem)", zIndex: 20 }}
        >
          {/* Section number aksesori */}
          <span
            className="gsap-heading-target"
            style={{
              fontFamily: "var(--font-lato)",
              color: "rgba(212,160,23,0.35)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              fontWeight: 700,
              marginBottom: "0.25rem",
              willChange: "transform",
            }}
          >
            03
          </span>

          <p
            className="gsap-heading-target"
            style={{
              fontFamily: "var(--font-lato)",
              color: "rgba(200,168,75,0.7)",
              fontSize: "0.68rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
              fontWeight: 300,
              willChange: "transform",
            }}
          >
            ✦ Galeri Pesona ✦
          </p>

          <h2
            className="gsap-heading-target"
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "0.1em",
              color: "#fff8e0",
              textShadow:
                "0 3px 20px rgba(0,0,0,0.7), 0 0 50px rgba(212,160,23,0.2)",
              marginBottom: "0.6rem",
              willChange: "transform",
            }}
          >
            Pesona{" "}
            <span style={{ color: "var(--color-emas-muda)" }}>Kediri</span>
          </h2>

          <div
            className="gsap-heading-target"
            style={{
              width: "clamp(60px, 10vw, 120px)",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, var(--color-emas), transparent)",
              opacity: 0.7,
              willChange: "transform",
            }}
          />
        </div>

        {/* Gallery — isi sisa ruang di bawah heading */}
        <div
          className="relative w-full h-full"
          style={{ zIndex: 10, paddingTop: "clamp(5rem, 14vh, 9rem)" }}
        >
          <CircularGallery
            items={GALLERY_ITEMS}
            bend={3}
            textColor="#f0d080"
            borderRadius={0.05}
            scrollSpeed={3}
            scrollEase={0.07}
            font="bold 26px 'Playfair Display', serif"
          />
        </div>

        {/* Ornamen pembatas bawah */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ zIndex: 25, height: "72px" }}
        >
          <svg
            viewBox="0 0 1440 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 36 Q120 8 240 36 Q360 64 480 36 Q600 8 720 36 Q840 64 960 36 Q1080 8 1200 36 Q1320 64 1440 36 V72 H0 Z"
              fill="var(--color-emas)"
              opacity="0.12"
            />
            <path
              d="M0 48 Q120 20 240 48 Q360 76 480 48 Q600 20 720 48 Q840 76 960 48 Q1080 20 1200 48 Q1320 76 1440 48 V72 H0 Z"
              fill="var(--color-ornamen)"
              opacity="0.28"
            />
            <line x1="0" y1="36" x2="660" y2="36" stroke="rgba(212,160,23,0.22)" strokeWidth="0.5" />
            <line x1="780" y1="36" x2="1440" y2="36" stroke="rgba(212,160,23,0.22)" strokeWidth="0.5" />
            <rect x="714" y="30" width="12" height="12" fill="var(--color-emas)" opacity="0.65" transform="rotate(45 720 36)" />
            {ORNAMEN_DOTS.map(({ key, cx }) => (
              <circle key={key} cx={cx} cy={36} r={2} fill="var(--color-emas-muda)" opacity="0.38" />
            ))}
          </svg>
        </div>

        {/* Scroll hint — button */}
        <button
          className="carauser-scroll-hint absolute"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-lato)",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            background: "transparent",
            border: "1px solid rgba(212,160,23,0.25)",
            borderRadius: "999px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            zIndex: 20,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.color = "rgba(240,192,64,0.9)";
            el.style.borderColor = "rgba(212,160,23,0.6)";
            el.style.background = "rgba(212,160,23,0.06)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.color = "rgba(255,255,255,0.45)";
            el.style.borderColor = "rgba(212,160,23,0.25)";
            el.style.background = "transparent";
          }}
        >
          ← Geser untuk Jelajahi →
        </button>
      </div>

    </div>
  );
}
