"use client";

import { motion } from "framer-motion";

interface RouteButtonProps {
  latitude: number;
  longitude: number;
}

export default function RouteButton({ latitude, longitude }: RouteButtonProps) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl mt-4 overflow-hidden"
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
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      initial="rest"
      animate="rest"
    >
      {/* Background glow animasi */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,160,23,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: "inset 0 0 20px rgba(212,160,23,0.15), 0 0 20px rgba(212,160,23,0.1)",
        }}
      />

      {/* Icon navigasi animasi */}
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        variants={{
          rest: { x: 0, rotate: 0 },
          hover: { x: 3, rotate: 10 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </motion.svg>

      {/* Teks */}
      <motion.span
        variants={{
          rest: { x: 0 },
          hover: { x: 2 },
        }}
        transition={{ duration: 0.3 }}
      >
        Buat Rute ke Sini
      </motion.span>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={{
          rest: { x: "-100%", opacity: 0 },
          hover: { x: "100%", opacity: 1 },
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,160,23,0.15), transparent)",
          skewX: "-15deg",
        }}
      />
    </motion.a>
  );
}