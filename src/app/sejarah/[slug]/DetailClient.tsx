"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUp } from "lucide-react";
import TimelineParticles from "@/components/three/TimelineParticles";

interface HistoryData {
  id: number;
  slug: string;
  title: string;       
  year_era: string;    
  description: string;
  short_desc?: string;
  image?: string;
}

function isValidImageSrc(src: string | null | undefined): src is string {
  if (!src) return false;
  if (src.startsWith("/") || src.startsWith("data:")) return true;
  try {
    const u = new URL(src);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export default function DetailClient({ data }: { data: HistoryData }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[#050509] text-white pt-24 pb-16 relative overflow-hidden">
      <TimelineParticles />

      <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,160,23,0.05)_0%,transparent_70%)] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(240,192,64,0.03)_0%,transparent_70%)] blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        
        <div className="mb-8">
          <Link
            href="/sejarah"
            className="inline-flex items-center gap-2 text-xs sm:text-sm px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 border border-[rgba(212,160,23,0.3)] hover:border-[#d4a017] hover:shadow-[0_0_15px_rgba(212,160,23,0.18)]"
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

        <span className="inline-block text-xs font-bold tracking-widest text-[#c8a84b] uppercase bg-[rgba(212,160,23,0.08)] px-3 py-1 rounded border border-[rgba(212,160,23,0.2)] mb-3 font-sans shadow-[0_0_15px_rgba(212,160,23,0.08)]">
          ✦ {data.year_era}
        </span>

        <h1 
          className="text-3xl sm:text-5xl font-black mb-4 text-[#fff8e0] tracking-wide leading-tight"
          style={{ 
            fontFamily: "var(--font-cinzel), serif",
            textShadow: "0 0 40px rgba(212,160,23,0.25)"
          }}
        >
          {data.title}
        </h1>
        
        {data.short_desc && (
          <p className="text-[#c8a84b] opacity-80 font-serif italic text-base sm:text-lg mb-8 border-l-2 border-[#d4a017] pl-4 leading-relaxed">
            "{data.short_desc}"
          </p>
        )}

        {isValidImageSrc(data.image) && (
          <div className="relative w-full h-[250px] sm:h-[420px] rounded-2xl overflow-hidden mb-10 border border-[rgba(212,160,23,0.25)] shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(212,160,23,0.18)]">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="max-w-none text-neutral-300 text-base sm:text-lg leading-relaxed font-sans space-y-6 mt-8">
          {data.description.split('\n').map((paragraph, index) => {
            const cleanText = paragraph.trim();
            if (!cleanText) return null;

            if (index === 0) {
              return (
                <p key={index} className="text-justify first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-black first-letter:text-[#d4a017] first-letter:mr-3 first-letter:font-serif first-letter:leading-none">
                  {cleanText}
                </p>
              );
            }

            if (cleanText.length < 40 && !cleanText.endsWith('.')) {
              return (
                <h2 
                  key={index} 
                  className="text-xl sm:text-2xl font-bold text-[#fff8e0] pt-4 tracking-wide font-serif"
                  style={{ textShadow: "0 0 20px rgba(212,160,23,0.15)" }}
                >
                  ✦ {cleanText}
                </h2>
              );
            }

            return (
              <p key={index} className="text-justify text-neutral-300 opacity-95 indent-4 sm:indent-8">
                {cleanText}
              </p>
            );
          })}
        </div>

      </div>


      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full backdrop-blur-md border border-[rgba(212,160,23,0.4)] shadow-[0_0_20px_rgba(212,160,23,0.15)] transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
        }`}
        style={{
          color: "#d4a017",
          background: "rgba(8,8,15,0.75)",
        }}
      >
        <ArrowUp size={20} className="animate-pulse" />
      </button>

    </div>
  );
}