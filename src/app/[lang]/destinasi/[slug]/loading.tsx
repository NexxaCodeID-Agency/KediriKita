export default function Loading() {
  return (
    <main className="min-h-screen" style={{ background: "#070712" }}>
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
          border-radius: 0.5rem;
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
        .skel-img {
          position: relative;
          overflow: hidden;
        }
        .skel-img::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212,160,23,0.03) 40%,
            rgba(212,160,23,0.06) 50%,
            rgba(212,160,23,0.03) 60%,
            transparent 100%
          );
          animation: shimmerSweep 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Hero */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[75vh] overflow-hidden">
        <div
          className="absolute inset-0 skel-img"
          style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #1A1A2E 50%, #0d0d1a 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #070712 5%, rgba(7,7,18,0.25) 50%, transparent 100%)",
          }}
        />

        {/* Back button */}
        <div
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-[90] inline-flex items-center gap-2 px-4 py-2 rounded-full skel-pill"
          style={{ background: "rgba(8,8,15,0.6)", width: "100px", height: "32px", animationDelay: "0ms" }}
        />

        {/* Title area */}
        <div className="absolute bottom-6 sm:bottom-10 left-5 right-5 sm:left-8 sm:right-8 space-y-3">
          <div className="skel-pill w-20 h-5" style={{ background: "rgba(212,160,23,0.12)", animationDelay: "200ms" }} />
          <div className="skel-rect w-48 sm:w-72 h-10 sm:h-14" style={{ background: "rgba(255,248,224,0.06)", animationDelay: "300ms" }} />
          <div className="skel-pill w-32 h-4" style={{ background: "rgba(200,168,75,0.08)", animationDelay: "400ms" }} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        {/* About */}
        <div>
          <div className="skel-pill w-20 h-3 mb-6" style={{ background: "rgba(212,160,23,0.12)", animationDelay: "500ms" }} />
          <div className="space-y-3">
            {[100, 95, 85, 90, 60].map((w, i) => (
              <div
                key={i}
                className="skel-pill h-4"
                style={{ width: `${w}%`, background: "rgba(255,255,255,0.04)", animationDelay: `${600 + i * 80}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div
          className="rounded-2xl p-5 sm:p-8"
          style={{
            background: "rgba(212,160,23,0.02)",
            border: "1px solid rgba(212,160,23,0.06)",
          }}
        >
          <div className="skel-pill w-16 h-3 mb-6" style={{ background: "rgba(212,160,23,0.1)", animationDelay: "1000ms" }} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`skel-card rounded-xl ${
                  i === 1
                    ? "col-span-2 md:col-span-2 h-48 sm:h-64 md:h-[300px]"
                    : "h-36 sm:h-48 md:h-[200px]"
                }`}
                style={{ background: "rgba(255,255,255,0.03)", animationDelay: `${1100 + i * 120}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Tips */}
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "rgba(212,160,23,0.03)",
            border: "1px solid rgba(212,160,23,0.08)",
          }}
        >
          <div className="skel-pill w-24 h-3 mb-6" style={{ background: "rgba(212,160,23,0.1)", animationDelay: "1800ms" }} />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="skel-pill w-2 h-2 mt-1.5 flex-shrink-0"
                  style={{ background: "rgba(212,160,23,0.15)", animationDelay: `${1900 + i * 100}ms` }}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className="skel-pill h-4"
                    style={{ width: `${85 + (i * 7)}%`, background: "rgba(255,255,255,0.04)", animationDelay: `${2000 + i * 100}ms` }}
                  />
                  <div
                    className="skel-pill h-4"
                    style={{ width: `${50 + (i * 10)}%`, background: "rgba(255,255,255,0.04)", animationDelay: `${2100 + i * 100}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div>
          <div className="skel-pill w-32 h-3 mb-6" style={{ background: "rgba(212,160,23,0.1)", animationDelay: "2400ms" }} />
          <div
            className="skel-card w-full h-64 sm:h-80"
            style={{ background: "rgba(255,255,255,0.03)", animationDelay: "2500ms" }}
          />
        </div>
      </div>
    </main>
  );
}
