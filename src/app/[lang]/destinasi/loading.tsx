const shimmer = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

function Pill({ w, delay = 0 }: { w: string; delay?: number }) {
  return (
    <div
      style={{
        width: w,
        height: "100%",
        borderRadius: 9999,
        background: "linear-gradient(90deg, rgba(212,160,23,0.04) 25%, rgba(212,160,23,0.1) 50%, rgba(212,160,23,0.04) 75%)",
        backgroundSize: "200% 100%",
        animation: `shimmer 1.8s ease-in-out infinite`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

function CardSkeleton({ index }: { index: number }) {
  const d = index * 120;
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div className="relative w-full h-48 sm:h-56" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="absolute top-3 left-3" style={{ width: 72, height: 20, borderRadius: 9999, background: "linear-gradient(90deg, rgba(212,160,23,0.08) 25%, rgba(212,160,23,0.18) 50%, rgba(212,160,23,0.08) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: `${d + 200}ms` }} />
        <div className="absolute bottom-3 right-3" style={{ width: 44, height: 20, borderRadius: 9999, background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: `${d + 300}ms` }} />
      </div>
      <div className="p-4 sm:p-5 space-y-3">
        <div style={{ width: "75%", height: 20, borderRadius: 8, background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: `${d + 400}ms` }} />
        <div className="space-y-2">
          <div style={{ width: "100%", height: 12, borderRadius: 9999, background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: `${d + 500}ms` }} />
          <div style={{ width: "60%", height: 12, borderRadius: 9999, background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: `${d + 550}ms` }} />
        </div>
        <div style={{ width: 56, height: 12, borderRadius: 9999, background: "linear-gradient(90deg, rgba(212,160,23,0.05) 25%, rgba(212,160,23,0.1) 50%, rgba(212,160,23,0.05) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: `${d + 600}ms` }} />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen" style={{ background: "var(--color-langit-malam, #0a0a1a)" }}>
      <style dangerouslySetInnerHTML={{ __html: shimmer }} />

      <section className="min-h-screen px-4 sm:px-6 pt-8 sm:pt-10 pb-20 sm:pb-24 max-w-7xl mx-auto">
        {/* Nav */}
        <div className="w-full flex items-center justify-between gap-4 mb-8 sm:mb-10">
          <Pill w="96px" delay={0} />
          <Pill w="112px" delay={100} />
        </div>

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 px-2">
          <div className="mx-auto mb-4" style={{ width: 128, height: 12, borderRadius: 9999, background: "linear-gradient(90deg, rgba(212,160,23,0.06) 25%, rgba(212,160,23,0.12) 50%, rgba(212,160,23,0.06) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: "200ms" }} />
          <div className="mx-auto mb-4" style={{ width: 288, height: 40, borderRadius: 8, background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: "300ms" }} />
          <div className="mx-auto" style={{ width: 192, height: 12, borderRadius: 9999, background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: "400ms" }} />
        </div>

        {/* Search */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <div style={{ width: "100%", maxWidth: 448, height: 44, borderRadius: 9999, background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: "500ms" }} />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
          {[64, 80, 80, 80, 72, 72, 72].map((w, i) => (
            <div key={i} style={{ width: w, height: 28, borderRadius: 9999, background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.8s ease-in-out infinite`, animationDelay: `${600 + i * 80}ms` }} />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
