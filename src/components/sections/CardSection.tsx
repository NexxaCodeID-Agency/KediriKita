"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { translations } from "@/lib/translations";

const FloatingCards = dynamic(() => import("../FloatingCards"), {
  ssr: false,
  loading: () => null,
});

const ORNAMEN_DOTS = Array.from({ length: 10 }, (_, i) => ({
  key: i,
  cx: 60 + i * 132,
}));

const poinData = [
  {
    title: "Sejarah",
    desc: "Menyimpan jejak kemegahan peninggalan Kerajaan Kediri.",
    icon: "🏛️",
  },
  {
    title: "Seni Budaya",
    desc: "Memelihara kearifan lokal dan kesenian tradisional yang magis.",
    icon: "🎭",
  },
  {
    title: "Kuliner",
    desc: "Tahu Takwa dan aneka cita rasa legendaris yang memikat.",
    icon: "🍛",
  },
];

export default function CardSection() {
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as "id" | "en" | "cn") || "id";
  const t = translations[lang] || translations.id;

  const localizedPoinData = [
    {
      title: t.historyPoin["Sejarah"],
      desc: t.historyPoin.SejarahDesc,
      icon: "🏛️",
    },
    {
      title: t.historyPoin["Seni Budaya"],
      desc: t.historyPoin.SeniBudayaDesc,
      icon: "🎭",
    },
    {
      title: t.culinary,
      desc: t.historyPoin.KulinerDesc,
      icon: "🍛",
    },
  ];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setShowFloating(true);
      io.disconnect();
      clearTimeout(fallback);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) trigger();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(wrapper);

    const fallback = setTimeout(trigger, 8_000);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="card-section-wrapper relative w-full">
      <div className="card-section-sticky sticky top-0 w-full overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-langit-malam) 0%, #08080f 100%)",
          }}
        />

        {/* Ambient glow bawah kiri */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0,
            left: 0,
            width: "min(500px, 50vw)",
            height: "min(400px, 40vw)",
            background:
              "radial-gradient(ellipse, rgba(139,100,20,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Floating 3D Cards di background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {showFloating && <FloatingCards />}
        </div>

        {/* Ornamen pembatas ATAS */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ zIndex: 15, height: "clamp(40px, 5vw, 72px)" }}
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

        {/* Ornamen pembatas BAWAH */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ zIndex: 15, height: "clamp(40px, 5vw, 72px)" }}
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
              opacity="0.3"
            />
            <line x1="0" y1="36" x2="660" y2="36" stroke="rgba(212,160,23,0.25)" strokeWidth="0.5" />
            <line x1="780" y1="36" x2="1440" y2="36" stroke="rgba(212,160,23,0.25)" strokeWidth="0.5" />
            <rect x="714" y="30" width="12" height="12" fill="var(--color-emas)" opacity="0.7" transform="rotate(45 720 36)" />
            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={i} cx={60 + i * 132} cy={36} r={2} fill="var(--color-emas-muda)" opacity="0.4" />
            ))}
          </svg>
        </div>

        {/* ── Main layout ── */}
        <div
          className="card-section-layout relative z-10 flex items-center justify-center md:justify-start w-full"
          style={{ minHeight: "100dvh" }}
        >
          {/* Card wrapper */}
          <div className="card-outer relative" style={{ overflow: "visible" }}>
            {/* Glow di belakang card */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: "-12%",
                background:
                  "radial-gradient(ellipse at center, rgba(180,130,20,0.28) 0%, transparent 65%)",
                filter: "blur(32px)",
                zIndex: 0,
              }}
            />

            {/* Frame ornamen ATAS */}
            <Image
              src="/assets/images/frameatas.avif"
              alt="ornamen atas"
              width={360}
              height={120}
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 55vw, 26rem"
              className="absolute left-0 w-full h-auto pointer-events-none"
              style={{ top: 0, transform: "translateY(-46%)", zIndex: 20 }}
              priority
            />

            {/* Frame ornamen BAWAH */}
            <Image
              src="/assets/images/framebawah.avif"
              alt="ornamen bawah"
              width={360}
              height={120}
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 55vw, 26rem"
              className="absolute left-0 w-full h-auto pointer-events-none"
              style={{ bottom: 0, transform: "translateY(16%)", zIndex: 20 }}
            />

            {/* ── Body card ── */}
            <div
              className="card-body relative rounded-2xl flex flex-col"
              style={{
                zIndex: 10,
                background:
                  "linear-gradient(160deg, #7a5410 0%, #8b6512 55%, #6a4809 100%)",
                boxShadow:
                  "0 20px 80px rgba(0,0,0,0.75), 0 0 50px rgba(180,130,20,0.1), inset 0 1px 0 rgba(255,215,80,0.18)",
              }}
            >
              {/* Garis highlight atas */}
              <div
                className="absolute top-0 h-px"
                style={{
                  left: "10%",
                  right: "10%",
                  background:
                    "linear-gradient(to right, transparent, rgba(255,215,80,0.45), transparent)",
                }}
              />

              {/* Header label */}
              <p
                className="card-label text-center uppercase"
                style={{
                  color: "rgba(200,168,75,0.75)",
                  fontFamily: "var(--font-lato)",
                  fontWeight: 300,
                }}
              >
                {t.card.region}
              </p>

              {/* Judul */}
              <h2
                className="card-title text-center leading-none"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontWeight: 900,
                  letterSpacing: "0.14em",
                  color: "#fff8e0",
                  textShadow:
                    "0 3px 16px rgba(0,0,0,0.6), 0 0 40px rgba(212,160,23,0.25)",
                }}
              >
                Kediri
              </h2>

              {/* Tagline */}
              <p
                className="card-tagline text-center italic"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "#c8a030",
                  letterSpacing: "0.06em",
                  borderBottom: "1px solid rgba(200,168,75,0.28)",
                }}
              >
                {t.card.tagline}
              </p>

              {/* Intro */}
              <p
                className="card-intro text-center italic"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "rgba(245,233,192,0.82)",
                  lineHeight: "1.85",
                }}
              >
                {t.card.intro}
                <br />
                {t.card.introLine2}
              </p>

              {/* Divider ✦ */}
              <div className="card-divider flex items-center gap-2">
                <div className="flex-1 h-px" style={{ background: "rgba(200,168,75,0.28)" }} />
                <span style={{ color: "#c8a84b", fontSize: "7px", letterSpacing: "6px" }}>
                  ✦✦✦
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(200,168,75,0.28)" }} />
              </div>

              {/* Poin list */}
              <div className="card-points flex flex-col gap-4 mb-6 px-6 sm:px-10">
                {localizedPoinData.map((poin) => (
                  <div key={poin.title} className="card-point-item flex items-start">
                    <div
                      className="card-point-icon rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #4a2e06 0%, #6a4810 100%)",
                        border: "1px solid rgba(200,168,75,0.38)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
                      }}
                    >
                      {poin.icon}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="card-point-title uppercase"
                        style={{
                          fontFamily: "var(--font-lato)",
                          fontWeight: 700,
                          color: "#d4a830",
                        }}
                      >
                        {poin.title}
                      </p>
                      <p
                        className="card-point-desc italic leading-snug"
                        style={{
                          fontFamily: "var(--font-playfair)",
                          color: "rgba(245,233,192,0.78)",
                        }}
                      >
                        {poin.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Badge */}
              <div className="card-badge-wrap flex mb-5 justify-center">
                <span
                  onClick={() => router.push(`/${lang}/sejarah`)}
                  className="card-badge cursor-pointer uppercase text-center"
                  style={{
                    fontFamily: "var(--font-lato)",
                    letterSpacing: "0.28em",
                    background:
                      "linear-gradient(135deg, rgba(74,46,6,0.85) 0%, rgba(106,72,14,0.85) 100%)",
                    color: "#d4a830",
                    border: "1px solid rgba(200,168,75,0.38)",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(106,72,14,1) 0%, rgba(140,100,20,1) 100%)";
                    e.currentTarget.style.borderColor = "rgba(212,160,23,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(74,46,6,0.85) 0%, rgba(106,72,14,0.85) 100%)";
                    e.currentTarget.style.borderColor = "rgba(200,168,75,0.38)";
                  }}
                >
                  ✦ {t.seeHistory} ✦
                </span>
              </div>

              {/* Garis highlight bawah */}
              <div
                className="absolute bottom-0 left-6 right-6 sm:left-10 sm:right-10 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(180,130,20,0.25), transparent)",
                }}
              />

            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}