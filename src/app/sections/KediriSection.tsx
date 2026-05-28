"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LihatDestinasiButton from "@/components/LihatDestinasiButton";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function KediriSection() {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const handleCanPlay = () => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      
      video.play().catch(() => {});

      if (prefersReduced) {
        gsap.set(
          [
            badgeRef.current,
            headingRef.current,
            descRef.current,
            dividerRef.current,
            statsRef.current,
            video,
            overlayRef.current
          ],
          { opacity: 1, scale: 1, y: 0 },
        );
        return;
      }

      const ctx = gsap.context(() => {
        gsap.fromTo(
          video,
          { scale: 1.15, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: wrapper,
              start: "top bottom",
              end: "center center",
              scrub: 0.8,
            },
          },
        );

        gsap.fromTo(
          overlayRef.current,
          { opacity: 0.3 },
          {
            opacity: 0.72,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: wrapper,
              start: "top bottom",
              end: "center center",
              scrub: 0.8,
            },
          },
        );

        const textEls = [
          badgeRef.current,
          headingRef.current,
          dividerRef.current,
          descRef.current,
          statsRef.current,
        ];

        textEls.forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: wrapper,
                start: "20% bottom",
                toggleActions: "play none none none",
              },
              delay: i * 0.13,
            },
          );
        });
      }, wrapper);
      
      return () => ctx.revert();
    };

    const init = () => {
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        handleCanPlay();
      } else {
        video.addEventListener("canplay", handleCanPlay, { once: true });
      }
    };
    
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          init();
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    io.observe(wrapper);

    return () => {
      io.disconnect();
      video.removeEventListener("canplay", handleCanPlay);
      gsap.killTweensOf(wrapper);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/slg.mp4"
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            willChange: "transform, opacity",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            opacity: 0, 
          }}
        />
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,8,18,0.55) 0%, rgba(8,8,18,0.38) 40%, rgba(8,8,18,0.85) 88%, var(--color-langit-malam) 100%)",
          opacity: 0.3,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 40%, rgba(4,6,16,0.65) 100%)",
        }}
      />

      <div
        className="relative flex flex-col items-center justify-center text-center px-5 sm:px-6"
        style={{
          minHeight: "100dvh",
          paddingTop: "clamp(6vh, 10vh, 12vh)",
          paddingBottom: "clamp(8vh, 10vh, 12vh)",
          zIndex: 10,
        }}
      >
        <div
          ref={badgeRef}
          className="-mt-10 lg:-mt-20"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            border: "1px solid rgba(212,160,23,0.35)",
            borderRadius: "999px",
            padding: "0.35rem 1.1rem",
            marginBottom: "1rem",
            opacity: 0,
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--color-emas)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-lato)",
              color: "var(--color-emas-muda)",
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Kota Kediri
          </span>
        </div>

        <div
          ref={headingRef}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-5 mb-2"
          style={{ opacity: 0 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(1.9rem, 7vw, 5rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              lineHeight: 1.1,
              color: "var(--color-teks-utama)",
              textShadow:
                "0 4px 32px rgba(0,0,0,0.9), 0 0 60px rgba(212,160,23,0.2)",
            }}
          >
            Seputar
          </h2>
          <h2
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(1.9rem, 7vw, 5rem)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              lineHeight: 1.1,
              color: "var(--color-emas-muda)",
              textShadow:
                "0 4px 32px rgba(0,0,0,0.9), 0 0 60px rgba(240,192,64,0.35)",
            }}
          >
            Kediri
          </h2>
        </div>

        <div
          ref={dividerRef}
          style={{
            width: "clamp(80px, 14vw, 160px)",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, var(--color-emas), transparent)",
            margin: "1rem 0",
            opacity: 0,
          }}
        />

        <p
          ref={descRef}
          style={{
            fontFamily: "var(--font-lato)",
            color: "rgba(255,255,255,0.82)",
            fontSize: "clamp(0.78rem, 1.5vw, 1rem)",
            fontWeight: 600,
            maxWidth: "min(34rem, 92vw)",
            lineHeight: 1.85,
            letterSpacing: "0.04em",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            opacity: 0,
          }}
        >
          Lebih dari sekadar titik di peta Jawa Timur, Kediri adalah perpaduan
          harmonis antara kemegahan sejarah kerajaan, kekayaan tradisi yang
          hidup, hingga geliat modernitas yang terus bertumbuh —sebuah kota yang
          memahat identitasnya dalam setiap sudut kehangatan dan kejayaan yang
          abadi.
        </p>

        <div className="relative flex items-center justify-center z-10 mt-8">
          <LihatDestinasiButton onClick={() => router.push("/destinasi")} />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ zIndex: 11, height: "80px" }}
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
            opacity="0.15"
          />
          <path
            d="M0 54 Q120 22 240 54 Q360 86 480 54 Q600 22 720 54 Q840 86 960 54 Q1080 22 1200 54 Q1320 86 1440 54 V80 H0 Z"
            fill="var(--color-ornamen)"
            opacity="0.35"
          />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={i}
              cx={60 + i * 120}
              cy={40}
              r={2.5}
              fill="var(--color-emas-muda)"
              opacity="0.45"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
