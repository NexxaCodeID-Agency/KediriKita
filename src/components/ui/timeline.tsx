"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import TimelineParticles from "@/components/three/TimelineParticles";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-[#050509] font-sans md:px-10 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Three.js Particle Background */}
      <TimelineParticles />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.04)_0%,transparent_70%)] blur-[80px] pointer-events-none" />
      <div className="absolute top-3/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(240,192,64,0.03)_0%,transparent_70%)] blur-[90px] pointer-events-none" />

      <div className="mb-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 border border-[rgba(212,160,23,0.3)] hover:border-[#d4a017] hover:shadow-[0_0_15px_rgba(212,160,23,0.15)]"
          style={{
            color: "#d4a017",
            background: "rgba(8,8,15,0.6)",
            fontFamily: "var(--font-lato)",
          }}
        >
          <ArrowLeft size={14} />
          Kembali
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 relative z-10">
        <h2 
          className="text-2xl md:text-5xl font-black mb-4 text-[#fff8e0] tracking-wide" 
          style={{ 
            fontFamily: "var(--font-cinzel)",
            textShadow: "0 0 30px rgba(212,160,23,0.2)"
          }}
        >
          Garis Waktu <span className="text-[#d4a017] shadow-glow">Sejarah Kediri</span>
        </h2>
        <p className="text-neutral-400 text-sm md:text-base max-w-sm">
          Menelusuri jejak peradaban, kerajaan purba, hingga perkembangan modern Kota Kediri.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 z-10">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-[#08080f]/90 backdrop-blur-sm flex items-center justify-center border border-[rgba(212,160,23,0.25)] shadow-[0_0_15px_rgba(212,160,23,0.15)]">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#d4a017] to-[#fff8e0] shadow-[0_0_8px_rgba(240,192,64,0.85)] animate-pulse" />
              </div>
              <h3 
                className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold transition-all duration-300"
                style={{
                  color: "#d4a017",
                  textShadow: "0 0 20px rgba(212,160,23,0.15)"
                }}
              >
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-[#d4a017]">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#d4a017] via-[#fff8e0] to-transparent from-[0%] via-[50%] rounded-full shadow-[0_0_10px_rgba(212,160,23,0.6)]"
          />
        </div>
      </div>
    </div>
  );
};
