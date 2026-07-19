export default function Loading() {
  return (
    <main className="min-h-screen" style={{ background: "var(--color-langit-malam)" }}>
      <style>{`
        .skel-bone {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
        }
        .skel-bone::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212,160,23,0.06) 40%,
            rgba(212,160,23,0.12) 50%,
            rgba(212,160,23,0.06) 60%,
            transparent 100%
          );
          animation: shimmerSweep 1.6s ease-in-out infinite;
        }
        .skel-card {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
        }
        .skel-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212,160,23,0.04) 40%,
            rgba(212,160,23,0.08) 50%,
            rgba(212,160,23,0.04) 60%,
            transparent 100%
          );
          animation: shimmerSweep 1.8s ease-in-out infinite;
        }
        .skel-rect {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
        }
        .skel-rect::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212,160,23,0.03) 40%,
            rgba(212,160,23,0.07) 50%,
            rgba(212,160,23,0.03) 60%,
            transparent 100%
          );
          animation: shimmerSweep 2s ease-in-out infinite;
        }
        .skel-pill {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
        }
        .skel-pill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212,160,23,0.05) 40%,
            rgba(212,160,23,0.1) 50%,
            rgba(212,160,23,0.05) 60%,
            transparent 100%
          );
          animation: shimmerSweep 1.4s ease-in-out infinite;
        }
      `}</style>

      <section className="min-h-screen px-4 sm:px-6 pt-8 sm:pt-10 pb-20 sm:pb-24 max-w-7xl mx-auto">
        {/* Nav */}
        <div className="w-full flex items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="skel-pill w-24 h-4" style={{ background: "rgba(212,160,23,0.06)", animationDelay: "0ms" }} />
          <div className="skel-pill w-28 h-4" style={{ background: "rgba(212,160,23,0.06)", animationDelay: "100ms" }} />
        </div>

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 px-2">
          <div className="skel-pill w-32 h-3 mx-auto mb-4" style={{ background: "rgba(212,160,23,0.08)", animationDelay: "200ms" }} />
          <div className="skel-rect w-56 sm:w-72 h-9 sm:h-11 mx-auto mb-4" style={{ background: "rgba(255,255,255,0.04)", animationDelay: "300ms" }} />
          <div className="skel-pill w-48 h-3 mx-auto" style={{ background: "rgba(255,255,255,0.03)", animationDelay: "400ms" }} />
        </div>

        {/* Search */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="skel-pill w-full max-w-md h-11" style={{ background: "rgba(255,255,255,0.04)", animationDelay: "500ms" }} />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="skel-pill h-7"
              style={{
                width: i === 0 ? "64px" : i < 3 ? "80px" : "72px",
                background: "rgba(255,255,255,0.04)",
                animationDelay: `${600 + i * 80}ms`,
              }}
            />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skel-card rounded-2xl border"
              style={{
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.02)",
                animationDelay: `${i * 100}ms`,
              }}
            >
              {/* Image area */}
              <div
                className="relative w-full h-48 sm:h-56"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                {/* Category badge */}
                <div
                  className="absolute top-3 left-3 skel-pill h-5"
                  style={{ width: "72px", background: "rgba(212,160,23,0.15)", animationDelay: `${i * 100 + 200}ms` }}
                />
                {/* Rating badge */}
                <div
                  className="absolute bottom-3 right-3 skel-pill h-5"
                  style={{ width: "44px", background: "rgba(255,255,255,0.06)", animationDelay: `${i * 100 + 300}ms` }}
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 space-y-3">
                <div
                  className="skel-rect h-5 rounded-lg"
                  style={{ width: "75%", background: "rgba(255,255,255,0.05)", animationDelay: `${i * 100 + 400}ms` }}
                />
                <div className="space-y-2">
                  <div
                    className="skel-pill h-3"
                    style={{ width: "100%", background: "rgba(255,255,255,0.03)", animationDelay: `${i * 100 + 500}ms` }}
                  />
                  <div
                    className="skel-pill h-3"
                    style={{ width: "60%", background: "rgba(255,255,255,0.03)", animationDelay: `${i * 100 + 550}ms` }}
                  />
                </div>
                <div
                  className="skel-pill h-3"
                  style={{ width: "56px", background: "rgba(212,160,23,0.08)", animationDelay: `${i * 100 + 600}ms` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
