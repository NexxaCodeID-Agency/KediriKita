"use client";

interface RouteButtonProps {
  latitude: number;
  longitude: number;
}

export default function RouteButton({ latitude, longitude }: RouteButtonProps) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="route-button relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl mt-4 overflow-hidden"
      style={{
        background: "rgba(212,160,23,0.06)",
        border: "1px solid rgba(212,160,23,0.3)",
        color: "#d4a017",
        fontFamily: "var(--font-lato)",
        fontSize: "12px",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        textDecoration: "none",
      }}
    >
      {/* Icon navigasi */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="icon"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>

      {/* Teks */}
      <span className="text">
        Buat Rute ke Sini
      </span>
    </a>
  );
}