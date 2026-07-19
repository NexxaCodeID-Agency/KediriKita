"use client";
import dynamic from "next/dynamic";
import LazySection from "@/components/ui/LazySection";

const SHIMMER = `
  @keyframes _sk { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
`;

function S({ w, h = 12, r = 9999, bg = "rgba(212,160,23,0.06)", d = 0, br }: { w: string | number; h?: number; r?: number; bg?: string; d?: number; br?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: br ?? r,
      background: `linear-gradient(90deg, ${bg} 25%, ${bg.replace(/[\d.]+\)$/, (m) => `${Math.min(parseFloat(m) * 2, 0.2)})`)} 50%, ${bg} 75%)`,
      backgroundSize: "200% 100%",
      animation: `_sk 1.8s ease-in-out infinite`,
      animationDelay: `${d}ms`,
      flexShrink: 0,
    }} />
  );
}

/* ─── CardSection Skeleton ─── */
function CardSectionFallback() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center" style={{ background: "#050509" }}>
      <style dangerouslySetInnerHTML={{ __html: SHIMMER }} />
      <div className="w-[340px] sm:w-[420px] p-12" style={{ background: "rgba(212,160,23,0.03)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: 24 }}>
        <div className="flex flex-col items-center gap-4">
          <S w="60%" h={4} bg="rgba(212,160,23,0.08)" />
          <S w="80px" h={12} bg="rgba(212,160,23,0.1)" d={100} />
          <S w="160px" h={40} r={8} bg="rgba(255,248,224,0.05)" d={200} />
          <S w="200px" h={12} bg="rgba(200,168,75,0.06)" d={300} />
          <S w="40%" h={1} bg="rgba(212,160,23,0.1)" d={400} />
        </div>
        <div className="mt-6 space-y-2">
          <S w="100%" h={12} bg="rgba(255,255,255,0.03)" d={500} />
          <S w="85%" h={12} bg="rgba(255,255,255,0.03)" d={550} />
          <S w="90%" h={12} bg="rgba(255,255,255,0.03)" d={600} />
        </div>
        <div className="mt-6 space-y-4">
          {[700, 800, 900].map((d, i) => (
            <div key={i} className="flex items-start gap-3">
              <S w={32} h={32} r={16} bg="rgba(212,160,23,0.06)" d={d} />
              <div className="flex-1 space-y-1.5 pt-1">
                <S w="60%" h={12} bg="rgba(255,248,224,0.05)" d={d + 50} />
                <S w="90%" h={10} bg="rgba(255,255,255,0.03)" d={d + 100} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <S w="120px" h={32} r={6} bg="rgba(212,160,23,0.06)" d={1100} />
        </div>
        <div className="mt-6 flex justify-center">
          <S w="60%" h={4} bg="rgba(212,160,23,0.08)" d={1200} />
        </div>
      </div>
    </div>
  );
}

/* ─── Carauser Skeleton ─── */
function CarauserFallback() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: "#050509" }}>
      <style dangerouslySetInnerHTML={{ __html: SHIMMER }} />
      <div className="text-center mb-8 z-10 space-y-3">
        <S w="120px" h={12} bg="rgba(212,160,23,0.1)" />
        <S w="240px" h={36} r={8} bg="rgba(255,248,224,0.05)" d={100} />
        <S w="180px" h={12} bg="rgba(255,255,255,0.03)" d={200} />
      </div>
      <div className="relative w-full max-w-lg h-[300px] sm:h-[400px] flex items-center justify-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          return (
            <div key={i} className="absolute" style={{
              width: 120, height: 160, borderRadius: 12,
              border: "1px solid rgba(212,160,23,0.06)",
              background: `linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)`,
              backgroundSize: "200% 100%",
              animation: `_sk 1.8s ease-in-out infinite`,
              animationDelay: `${300 + i * 120}ms`,
              transform: `translate(${Math.cos(a) * 140}px, ${Math.sin(a) * 56}px)`,
            }} />
          );
        })}
      </div>
    </div>
  );
}

/* ─── PetaSection Skeleton ─── */
function PetaFallback() {
  return (
    <section className="relative w-full py-16 px-6 flex flex-col items-center" style={{ background: "#050509" }}>
      <style dangerouslySetInnerHTML={{ __html: SHIMMER }} />
      <div className="text-center mb-10 space-y-2">
        <S w="100px" h={12} bg="rgba(212,160,23,0.08)" />
        <S w="140px" h={32} r={8} bg="rgba(255,248,224,0.05)" d={100} />
      </div>
      <div className="relative w-full max-w-3xl">
        {/* Corner ornaments */}
        {[0, 90, -90, 180].map((rot, i) => (
          <div key={i} className="absolute w-16 h-16 z-20 pointer-events-none"
            style={{
              [i < 2 ? "top" : "bottom"]: -16,
              [i % 2 === 0 ? "left" : "right"]: -16,
              transform: `rotate(${rot}deg)`,
            }}>
            <svg viewBox="0 0 64 64" fill="none">
              <path d="M4 60 Q4 4 60 4" stroke="rgba(212,160,23,0.15)" strokeWidth="1.5" />
              <circle cx="4" cy="60" r="3" fill="rgba(212,160,23,0.15)" />
              <circle cx="60" cy="4" r="3" fill="rgba(212,160,23,0.15)" />
            </svg>
          </div>
        ))}
        <div style={{
          width: "100%", height: 500, borderRadius: 12,
          border: "1px solid rgba(212,160,23,0.08)",
          background: `linear-gradient(90deg, rgba(26,26,46,0.4) 25%, rgba(26,26,46,0.6) 50%, rgba(26,26,46,0.4) 75%)`,
          backgroundSize: "200% 100%",
          animation: `_sk 2s ease-in-out infinite`,
          animationDelay: "200ms",
        }} />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {[0, 80, 160, 240].map((d, i) => (
            <S key={i} w={28} h={24} r={12} bg="rgba(212,160,23,0.06)" d={d + 400} />
          ))}
        </div>
      </div>
      <div className="mt-6">
        <S w="160px" h={36} r={9999} bg="rgba(212,160,23,0.06)" d={800} />
      </div>
    </section>
  );
}

const HeroSection = dynamic(() => import("@/components/sections/HeroSection"), { loading: () => null });
const KediriSection = dynamic(() => import("@/components/sections/KediriSection"), { ssr: false });
const CardSection = dynamic(() => import("@/components/sections/CardSection"), { ssr: false });
const Carauser = dynamic(() => import("@/components/sections/Carauser"), { ssr: false });
const PetaSection = dynamic(() => import("@/components/sections/peta"), { ssr: false });
const Chartline = dynamic(() => import("@/components/sections/chartline"), { ssr: false });

export default function Home() {
  return (
    <main>
      <HeroSection />

      <LazySection minHeight="100dvh">
        <KediriSection />
      </LazySection>

      <LazySection minHeight="100dvh" fallback={<CardSectionFallback />}>
        <CardSection />
      </LazySection>

      <LazySection minHeight="100dvh" fallback={<CarauserFallback />}>
        <Carauser />
      </LazySection>

      <LazySection minHeight="100px">
        <Chartline />
      </LazySection>

      <LazySection minHeight="800px" fallback={<PetaFallback />}>
        <PetaSection />
      </LazySection>
    </main>
  );
}
