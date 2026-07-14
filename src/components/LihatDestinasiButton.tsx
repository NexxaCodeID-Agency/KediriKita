"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function LihatDestinasiButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  const { t } = useTranslation();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idCounter = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const id = idCounter.current++;
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 900);

      setTimeout(() => onClick?.(), 350);
    },
    [onClick]
  );

  return (
    <div
      onClick={handleClick}
      className="relative inline-flex items-center justify-center select-none cursor-pointer overflow-hidden"
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: r.x - 10,
            top: r.y - 10,
            width: 20,
            height: 20,
            background:
              "radial-gradient(circle, rgba(240,208,128,0.7) 0%, rgba(212,160,23,0.3) 50%, transparent 100%)",
          }}
        />
      ))}

      <div className="relative flex items-center justify-center group transition-transform duration-300 hover:scale-105">
        <Image
          src="/assets/images/ornamen-kiri.avif"
          alt="ornamen kiri"
          width={170}
          height={65}
          className="object-contain shrink-0 relative z-10 transition-all duration-300 group-hover:brightness-110"
          style={{
            filter:
              "drop-shadow(0 4px 6px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(212,160,23,0.4))",
            width: "clamp(72px, 22vw, 170px)",
            marginRight: "-12px",
          }}
        />

        <div className="relative shrink-0 z-30">
          <svg
            viewBox="0 0 190 54"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300 group-hover:brightness-110"
            style={{
              width: "clamp(120px, 30vw, 190px)",
              height: "auto",
              filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.9))",
            }}
          >
            <ellipse
              cx="95"
              cy="27"
              rx="91"
              ry="24"
              fill="rgba(18, 20, 30, 0.85)"
              stroke="#c8a84b"
              strokeWidth="2"
            />
            <ellipse
              cx="95"
              cy="27"
              rx="86"
              ry="19"
              fill="none"
              stroke="#c8a84b"
              strokeWidth="1"
              opacity="0.5"
            />
            <text
              x="95"
              y="32"
              textAnchor="middle"
              fontFamily="'Playfair Display', Georgia, serif"
              fontSize="14"
              fontWeight="bold"
              letterSpacing="2.5"
              fill="#c8a84b"
            >
              {t.viewDest}
            </text>
          </svg>
        </div>

        <Image
          src="/assets/images/ornamen-kanan.avif"
          alt="ornamen kanan"
          width={170}
          height={65}
          className="object-contain shrink-0 relative z-10 transition-all duration-300 group-hover:brightness-110"
          style={{
            filter:
              "drop-shadow(0 4px 6px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(212,160,23,0.4))",
            width: "clamp(72px, 22vw, 170px)",
            marginLeft: "-12px",
          }}
        />
      </div>

      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,168,75,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
