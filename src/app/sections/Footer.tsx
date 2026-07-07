"use client";

const ORNAMEN_DOTS = Array.from({ length: 10 }, (_, i) => ({ key: i, cx: 60 + i * 132 }));

const SOSMED = [
  { label: "Instagram", href: "https://www.instagram.com/nexxacodeid?igsh=MTRtdnJ4bXAxaWtodw==", icon: "IG" },
];

// 1. Definisikan tipe data untuk props dari DB
export interface DestinationLink {
  name: string;
  slug: string;
}

interface FooterProps {
  dataWisata?: DestinationLink[];
  dataKuliner?: DestinationLink[];
}

export default function Footer({ dataWisata = [], dataKuliner = [] }: FooterProps) {
  
  // 2. Tentukan tipe untuk array LINKS biar strict dan aman
  interface LinkItem {
    label: string;
    href: string;
  }

  interface LinkGroup {
    heading: string;
    items: LinkItem[];
  }

  const LINKS: LinkGroup[] = [
    {
      heading: "Jelajahi",
      items: [
        { label: "Beranda", href: "/" },
        { label: "Destinasi", href: "/destinasi" },
        { label: "Peta Kediri", href: "/map" },
        { label: "Sejarah", href: "/sejarah" },
      ],
    },
    {
      heading: "Wisata",
      items: dataWisata.length > 0 
        ? dataWisata.map((w) => ({ label: w.name, href: `/destinasi/${w.slug}` }))
        : [
            { label: "Gunung Kelud", href: "/destinasi/gunung-kelud" },
            { label: "Gua Selomangleng", href: "/destinasi/goa-selomangleng" },
          ],
    },
    {
      heading: "Kuliner",
      items: dataKuliner.length > 0 
        ? dataKuliner.map((k) => ({ label: k.name, href: `/destinasi/${k.slug}` }))
        : [
            { label: "Tahu kuning", href: "/destinasi/tahu-kuning-poo" },
            { label: "Getuk Pisang", href: "/destinasi/getuk-pisang-ud-rasa-manis" },
          ],
    },
  ];

  return (
    <footer
      className="relative w-full"
      style={{
        background: "linear-gradient(to bottom, #08080f 0%, #050509 100%)",
        borderTop: "1px solid rgba(212,160,23,0.15)",
      }}
    >
      {/* Ornamen pembatas atas */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "72px" }}>
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

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "250px",
          background: "radial-gradient(ellipse, rgba(212,160,23,0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div
        className="relative mx-auto footer-inner"
        style={{ maxWidth: "1200px" }}
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 sm:mb-14">
          <p
            style={{
              fontFamily: "var(--font-lato)",
              color: "rgba(212,160,23,0.4)",
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}
          >
            ✦ Kota Bersejarah ✦
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cinzel)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 900,
              letterSpacing: "0.18em",
              color: "#fff8e0",
              textShadow: "0 0 40px rgba(212,160,23,0.25)",
              lineHeight: 1,
              marginBottom: "0.6rem",
            }}
          >
            Kediri
          </h2>
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              color: "rgba(200,168,75,0.65)",
              fontSize: "0.8rem",
              fontStyle: "italic",
              letterSpacing: "0.05em",
            }}
          >
            Kota Tahu · Kota Budaya · Kota Sejarah
          </p>

          {/* Divider */}
          <div
            style={{
              marginTop: "1.5rem",
              width: "clamp(80px, 14vw, 160px)",
              height: "1px",
              background: "linear-gradient(to right, transparent, var(--color-emas), transparent)",
              opacity: 0.5,
            }}
          />
        </div>

        {/* Links grid */}
        <div
          className="grid footer-links-grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
        >
          {LINKS.map((col) => (
            <div key={col.heading}>
              <p
                style={{
                  fontFamily: "var(--font-lato)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(212,160,23,0.7)",
                  marginBottom: "1rem",
                }}
              >
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      style={{
                        fontFamily: "var(--font-lato)",
                        fontSize: "0.78rem",
                        color: "rgba(245,233,192,0.55)",
                        textDecoration: "none",
                        letterSpacing: "0.04em",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(240,192,64,0.9)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,233,192,0.55)")}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Sosmed kolom */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-lato)",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(212,160,23,0.7)",
                marginBottom: "1rem",
              }}
            >
              Ikuti Kami
            </p>
            <div className="flex flex-col gap-3">
              {SOSMED.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex items-center gap-2"
                  style={{
                    textDecoration: "none",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-lato)",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--color-emas-muda)",
                      border: "1px solid rgba(212,160,23,0.4)",
                      padding: "0.15rem 0.4rem",
                      borderRadius: "2px",
                    }}
                  >
                    {s.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-lato)",
                      fontSize: "0.78rem",
                      color: "rgba(245,233,192,0.55)",
                    }}
                  >
                    {s.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col items-center gap-3 py-6"
          style={{ borderTop: "1px solid rgba(212,160,23,0.12)" }}
        >
          <div className="flex items-center gap-2">
            <div style={{ width: "24px", height: "1px", background: "rgba(212,160,23,0.3)" }} />
            <span style={{ color: "rgba(212,160,23,0.4)", fontSize: "7px", letterSpacing: "5px" }}>✦✦✦</span>
            <div style={{ width: "24px", height: "1px", background: "rgba(212,160,23,0.3)" }} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-lato)",
              fontSize: "0.65rem",
              color: "rgba(200,168,75,0.35)",
              letterSpacing: "0.12em",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Kota Kediri — Jawa Timur, Indonesia
          </p>
          <p
            style={{
              fontFamily: "var(--font-lato)",
              fontSize: "0.58rem",
              color: "rgba(200,168,75,0.2)",
              letterSpacing: "0.06em",
            }}
          >
            Dibuat dengan cinta untuk Kota Kediri
          </p>
        </div>
      </div>
    </footer>
  );
}
