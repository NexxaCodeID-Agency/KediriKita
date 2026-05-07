"use client";

interface StreetViewProps {
  url: string;
  name: string;
}

export default function StreetView({ url, name }: StreetViewProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(212,160,23,0.3)",
      }}
    >
      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          background: "rgba(10,10,26,0.8)",
          border: "1px solid rgba(212,160,23,0.4)",
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "10px",
          color: "#d4a017",
          textTransform: "uppercase",
          letterSpacing: "2px",
          backdropFilter: "blur(4px)",
        }}
      >
        ◉ 360° View
      </div>

      <iframe
        src={url}
        className="w-full h-[260px] sm:h-[340px] md:h-[400px]"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Street View ${name}`}
      />
    </div>
  );
}
