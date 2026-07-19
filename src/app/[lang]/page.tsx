"use client";
import dynamic from "next/dynamic";
import LazySection from "@/components/ui/LazySection";

function SkeletonPulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <style>{`
        .skel-hp {
          position: relative;
          overflow: hidden;
        }
        .skel-hp::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.06) 40%, rgba(212,160,23,0.12) 50%, rgba(212,160,23,0.06) 60%, transparent 100%);
          animation: shimmerSweep 1.6s ease-in-out infinite;
        }
        .skel-hp-pill {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
        }
        .skel-hp-pill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.05) 40%, rgba(212,160,23,0.1) 50%, rgba(212,160,23,0.05) 60%, transparent 100%);
          animation: shimmerSweep 1.6s ease-in-out infinite;
        }
        .skel-hp-box {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
        }
        .skel-hp-box::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.04) 40%, rgba(212,160,23,0.08) 50%, rgba(212,160,23,0.04) 60%, transparent 100%);
          animation: shimmerSweep 1.8s ease-in-out infinite;
        }
      `}</style>
      {className && <div />}
    </div>
  );
}

function CardSectionSkeleton() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center" style={{ background: "#050509" }}>
      <style>{`
        .skel-cs {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
        }
        .skel-cs::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.06) 40%, rgba(212,160,23,0.12) 50%, rgba(212,160,23,0.06) 60%, transparent 100%);
          animation: shimmerSweep 1.6s ease-in-out infinite;
        }
        .skel-cs-box {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
        }
        .skel-cs-box::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.04) 40%, rgba(212,160,23,0.08) 50%, rgba(212,160,23,0.04) 60%, transparent 100%);
          animation: shimmerSweep 1.8s ease-in-out infinite;
        }
      `}</style>

      <div
        className="relative w-[340px] sm:w-[420px] skel-cs-box"
        style={{
          background: "rgba(212,160,23,0.03)",
          border: "1px solid rgba(212,160,23,0.1)",
          padding: "3rem 2rem",
        }}
      >
        {/* Top ornament */}
        <div className="flex justify-center mb-6">
          <div className="skel-cs h-1 rounded-full" style={{ width: "60%", background: "rgba(212,160,23,0.08)", animationDelay: "0ms" }} />
        </div>

        {/* Label */}
        <div className="flex justify-center mb-3">
          <div className="skel-cs h-3 rounded-full" style={{ width: "80px", background: "rgba(212,160,23,0.1)", animationDelay: "100ms" }} />
        </div>

        {/* Title */}
        <div className="flex justify-center mb-4">
          <div className="skel-cs-box h-10 sm:h-12" style={{ width: "160px", background: "rgba(255,248,224,0.05)", animationDelay: "200ms" }} />
        </div>

        {/* Tagline */}
        <div className="flex justify-center mb-6">
          <div className="skel-cs h-3 rounded-full" style={{ width: "200px", background: "rgba(200,168,75,0.06)", animationDelay: "300ms" }} />
        </div>

        {/* Divider */}
        <div className="flex justify-center mb-6">
          <div className="skel-cs h-px" style={{ width: "40%", background: "rgba(212,160,23,0.1)", animationDelay: "400ms" }} />
        </div>

        {/* Intro text */}
        <div className="space-y-2 mb-8">
          <div className="skel-cs h-3 rounded-full" style={{ width: "100%", background: "rgba(255,255,255,0.03)", animationDelay: "500ms" }} />
          <div className="skel-cs h-3 rounded-full" style={{ width: "85%", background: "rgba(255,255,255,0.03)", animationDelay: "550ms" }} />
          <div className="skel-cs h-3 rounded-full" style={{ width: "90%", background: "rgba(255,255,255,0.03)", animationDelay: "600ms" }} />
        </div>

        {/* 3 Points */}
        <div className="space-y-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="skel-cs w-8 h-8 rounded-full flex-shrink-0" style={{ background: "rgba(212,160,23,0.06)", animationDelay: `${700 + i * 100}ms` }} />
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="skel-cs h-3 rounded-full" style={{ width: "60%", background: "rgba(255,248,224,0.05)", animationDelay: `${800 + i * 100}ms` }} />
                <div className="skel-cs h-2.5 rounded-full" style={{ width: "90%", background: "rgba(255,255,255,0.03)", animationDelay: `${850 + i * 100}ms` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Badge */}
        <div className="flex justify-center">
          <div className="skel-cs h-8 rounded" style={{ width: "120px", background: "rgba(212,160,23,0.06)", animationDelay: "1100ms" }} />
        </div>

        {/* Bottom ornament */}
        <div className="flex justify-center mt-6">
          <div className="skel-cs h-1 rounded-full" style={{ width: "60%", background: "rgba(212,160,23,0.08)", animationDelay: "1200ms" }} />
        </div>
      </div>
    </div>
  );
}

function CarauserSkeleton() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: "#050509" }}>
      <style>{`
        .skel-cr {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
        }
        .skel-cr::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.06) 40%, rgba(212,160,23,0.12) 50%, rgba(212,160,23,0.06) 60%, transparent 100%);
          animation: shimmerSweep 1.6s ease-in-out infinite;
        }
        .skel-cr-box {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
        }
        .skel-cr-box::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.04) 40%, rgba(212,160,23,0.08) 50%, rgba(212,160,23,0.04) 60%, transparent 100%);
          animation: shimmerSweep 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Heading */}
      <div className="text-center mb-8 z-10">
        <div className="skel-cr h-3 rounded-full mx-auto mb-3" style={{ width: "120px", background: "rgba(212,160,23,0.1)", animationDelay: "0ms" }} />
        <div className="skel-cr-box h-8 sm:h-10 mx-auto mb-3" style={{ width: "240px", background: "rgba(255,248,224,0.05)", animationDelay: "100ms" }} />
        <div className="skel-cr h-3 rounded-full mx-auto" style={{ width: "180px", background: "rgba(255,255,255,0.03)", animationDelay: "200ms" }} />
      </div>

      {/* Gallery placeholder — circular arrangement */}
      <div className="relative w-full max-w-lg h-[300px] sm:h-[400px] flex items-center justify-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const radius = 140;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.4;
          return (
            <div
              key={i}
              className="absolute skel-cr-box"
              style={{
                width: "120px",
                height: "160px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(212,160,23,0.06)",
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${300 + i * 120}ms`,
              }}
            />
          );
        })}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 flex justify-center w-full">
        <div className="skel-cr h-2 rounded-full" style={{ width: "60px", background: "rgba(212,160,23,0.06)", animationDelay: "1000ms" }} />
      </div>
    </div>
  );
}

function PetaSectionSkeleton() {
  return (
    <section className="relative w-full py-16 px-6 flex flex-col items-center" style={{ background: "#050509" }}>
      <style>{`
        .skel-pt {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
        }
        .skel-pt::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.06) 40%, rgba(212,160,23,0.12) 50%, rgba(212,160,23,0.06) 60%, transparent 100%);
          animation: shimmerSweep 1.6s ease-in-out infinite;
        }
        .skel-pt-box {
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
        }
        .skel-pt-box::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.04) 40%, rgba(212,160,23,0.08) 50%, rgba(212,160,23,0.04) 60%, transparent 100%);
          animation: shimmerSweep 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Heading */}
      <div className="text-center mb-10">
        <div className="skel-pt h-3 rounded-full mx-auto mb-2" style={{ width: "100px", background: "rgba(212,160,23,0.08)", animationDelay: "0ms" }} />
        <div className="skel-pt-box h-8 mx-auto" style={{ width: "140px", background: "rgba(255,248,224,0.05)", animationDelay: "100ms" }} />
      </div>

      {/* Map area */}
      <div className="relative w-full max-w-3xl">
        {/* Corner ornaments */}
        <div className="absolute -top-4 -left-4 w-16 h-16 z-20 pointer-events-none">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M4 60 Q4 4 60 4" stroke="rgba(212,160,23,0.15)" strokeWidth="1.5" fill="none" />
            <circle cx="4" cy="60" r="3" fill="rgba(212,160,23,0.15)" />
            <circle cx="60" cy="4" r="3" fill="rgba(212,160,23,0.15)" />
          </svg>
        </div>
        <div className="absolute -top-4 -right-4 w-16 h-16 z-20 pointer-events-none rotate-90">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M4 60 Q4 4 60 4" stroke="rgba(212,160,23,0.15)" strokeWidth="1.5" fill="none" />
            <circle cx="4" cy="60" r="3" fill="rgba(212,160,23,0.15)" />
            <circle cx="60" cy="4" r="3" fill="rgba(212,160,23,0.15)" />
          </svg>
        </div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 z-20 pointer-events-none -rotate-90">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M4 60 Q4 4 60 4" stroke="rgba(212,160,23,0.15)" strokeWidth="1.5" fill="none" />
            <circle cx="4" cy="60" r="3" fill="rgba(212,160,23,0.15)" />
            <circle cx="60" cy="4" r="3" fill="rgba(212,160,23,0.15)" />
          </svg>
        </div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 z-20 pointer-events-none rotate-180">
          <svg viewBox="0 0 64 64" fill="none">
            <path d="M4 60 Q4 4 60 4" stroke="rgba(212,160,23,0.15)" strokeWidth="1.5" fill="none" />
            <circle cx="4" cy="60" r="3" fill="rgba(212,160,23,0.15)" />
            <circle cx="60" cy="4" r="3" fill="rgba(212,160,23,0.15)" />
          </svg>
        </div>

        <div
          className="skel-pt-box w-full h-[500px]"
          style={{ background: "rgba(26,26,46,0.5)", border: "1px solid rgba(212,160,23,0.08)", animationDelay: "200ms" }}
        />

        {/* Filter panel placeholder */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="skel-pt h-6 rounded-full"
              style={{ width: "28px", background: "rgba(212,160,23,0.06)", animationDelay: `${400 + i * 80}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="mt-6">
        <div className="skel-pt h-9 rounded-full" style={{ width: "160px", background: "rgba(212,160,23,0.06)", animationDelay: "800ms" }} />
      </div>
    </section>
  );
}

const HeroSection = dynamic(() => import("@/components/sections/HeroSection"), {
  loading: () => null,
});
const KediriSection = dynamic(() => import("@/components/sections/KediriSection"), { ssr: false });
const CardSection = dynamic(() => import("@/components/sections/CardSection"), {
  ssr: false,
  loading: () => <CardSectionSkeleton />,
});
const Carauser = dynamic(() => import("@/components/sections/Carauser"), {
  ssr: false,
  loading: () => <CarauserSkeleton />,
});
const PetaSection = dynamic(() => import("@/components/sections/peta"), {
  ssr: false,
  loading: () => <PetaSectionSkeleton />,
});
const Chartline = dynamic(() => import("@/components/sections/chartline"), { ssr: false });

export default function Home() {
  return (
    <main>
      <HeroSection />

      <LazySection minHeight="100dvh">
        <KediriSection />
      </LazySection>

      <LazySection minHeight="100dvh">
        <CardSection />
      </LazySection>

      <LazySection minHeight="100dvh">
        <Carauser />
      </LazySection>

      <LazySection minHeight="100px">
        <Chartline />
      </LazySection>

      <LazySection minHeight="800px">
        <PetaSection />
      </LazySection>
    </main>
  );
}
