"use client";

import Image from "next/image";
import FloatingCards from "../../components/FloatingCards";

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
  return (
    <div className="relative w-full" style={{ height: "130vh" }}>
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
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
            left: "-10%",
            bottom: "10%",
            width: "500px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(139,100,20,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Floating 3D Cards di background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <FloatingCards />
        </div>

        {/* Ornamen pembatas ATAS — sambungan dari KediriSection */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ zIndex: 15, height: "72px" }}
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
            <line
              x1="0"
              y1="36"
              x2="660"
              y2="36"
              stroke="rgba(212,160,23,0.22)"
              strokeWidth="0.5"
            />
            <line
              x1="780"
              y1="36"
              x2="1440"
              y2="36"
              stroke="rgba(212,160,23,0.22)"
              strokeWidth="0.5"
            />
            <rect
              x="714"
              y="30"
              width="12"
              height="12"
              fill="var(--color-emas)"
              opacity="0.65"
              transform="rotate(45 720 36)"
            />
            {ORNAMEN_DOTS.map(({ key, cx }) => (
              <circle
                key={key}
                cx={cx}
                cy={36}
                r={2}
                fill="var(--color-emas-muda)"
                opacity="0.35"
              />
            ))}
          </svg>
        </div>

        {/* Ornamen pembatas BAWAH — sambungan ke Carauser */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ zIndex: 15, height: "72px" }}
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
            <line
              x1="0"
              y1="36"
              x2="660"
              y2="36"
              stroke="rgba(212,160,23,0.25)"
              strokeWidth="0.5"
            />
            <line
              x1="780"
              y1="36"
              x2="1440"
              y2="36"
              stroke="rgba(212,160,23,0.25)"
              strokeWidth="0.5"
            />
            <rect
              x="714"
              y="30"
              width="12"
              height="12"
              fill="var(--color-emas)"
              opacity="0.7"
              transform="rotate(45 720 36)"
            />
            {Array.from({ length: 10 }).map((_, i) => (
              <circle
                key={i}
                cx={60 + i * 132}
                cy={36}
                r={2}
                fill="var(--color-emas-muda)"
                opacity="0.4"
              />
            ))}
          </svg>
        </div>

        {/* Main layout — centered on mobile, left-anchored on desktop */}
        <div
          className="relative z-10 h-full flex items-center justify-center md:justify-start px-4 md:px-0 md:pl-10 lg:pl-24"
          style={{ paddingTop: "5vh" }}
        >
          {/* Card wrapper */}
          <div className="relative w-[min(360px,92vw)] md:w-90">
            {/* Glow di belakang card */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(180,130,20,0.3) 0%, transparent 65%)",
                filter: "blur(28px)",
                transform: "scale(1.25) translateY(4px)",
                zIndex: 0,
              }}
            />

            {/* Frame ornamen ATAS — straddle tepian atas card */}
            <Image
              src="/assets/images/frameatas.avif"
              alt="ornamen atas"
              width={360}
              height={120}
              className="absolute left-0 w-full pointer-events-none"
              style={{ top: 0, transform: "translateY(-46%)", zIndex: 20 }}
              priority
            />

            {/* Frame ornamen BAWAH — straddle tepian bawah card */}
            <Image
              src="/assets/images/framebawah.avif"
              alt="ornamen bawah"
              width={360}
              height={120}
              className="absolute left-0 w-full pointer-events-none"
              style={{ bottom: 0, transform: "translateY(16%)", zIndex: 20 }}
            />

            {/* Body card */}
            <div
              className="relative rounded-2xl flex flex-col px-8 py-14"
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
                className="absolute top-0 left-10 right-10 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,215,80,0.45), transparent)",
                }}
              />

              {/* Header label */}
              <p
                className="text-center text-[9px] tracking-[5px] uppercase mb-2"
                style={{
                  color: "rgba(200,168,75,0.75)",
                  fontFamily: "var(--font-lato)",
                  fontWeight: 300,
                }}
              >
                Jawa Timur, Indonesia
              </p>

              {/* Judul */}
              <h2
                className="text-center leading-none mb-2"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "2.6rem",
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
                className="text-center text-[10px] italic mb-5 pb-4"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "#c8a030",
                  letterSpacing: "0.06em",
                  borderBottom: "1px solid rgba(200,168,75,0.28)",
                }}
              >
                Kota Tahu · Kota Budaya · Kota Sejarah
              </p>

              {/* Intro */}
              <p
                className="text-center text-[12px] italic leading-relaxed mb-5"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "rgba(245,233,192,0.82)",
                  lineHeight: "1.85",
                }}
              >
                Kediri, dikenal sebagai kota tahu,
                <br />
                banyak hal yang menanti untuk diketahui.
              </p>

              {/* Divider ✦ */}
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(200,168,75,0.28)" }}
                />
                <span
                  style={{
                    color: "#c8a84b",
                    fontSize: "7px",
                    letterSpacing: "6px",
                  }}
                >
                  ✦✦✦
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(200,168,75,0.28)" }}
                />
              </div>

              {/* Poin list */}
              <div className="flex flex-col gap-4">
                {poinData.map((poin) => (
                  <div key={poin.title} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, #4a2e06 0%, #6a4810 100%)",
                        border: "1px solid rgba(200,168,75,0.38)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
                      }}
                    >
                      {poin.icon}
                    </div>
                    <div className="pt-0.5">
                      <p
                        className="text-[10px] tracking-[2.5px] uppercase mb-0.5"
                        style={{
                          fontFamily: "var(--font-lato)",
                          fontWeight: 700,
                          color: "#d4a830",
                        }}
                      >
                        {poin.title}
                      </p>
                      <p
                        className="text-[11.5px] italic leading-snug"
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
              <div className="flex justify-center mt-6">
                <span
                  className="text-[8.5px] tracking-[3px] uppercase px-5 py-1.5"
                  style={{
                    fontFamily: "var(--font-lato)",
                    background:
                      "linear-gradient(135deg, rgba(74,46,6,0.85) 0%, rgba(106,72,14,0.85) 100%)",
                    color: "#d4a830",
                    border: "1px solid rgba(200,168,75,0.38)",
                    borderRadius: "2px",
                    letterSpacing: "0.28em",
                  }}
                >
                  ✦ Explore Kediri
                </span>
              </div>

              {/* Garis highlight bawah */}
              <div
                className="absolute bottom-0 left-10 right-10 h-px"
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
