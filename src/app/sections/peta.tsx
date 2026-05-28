"use client"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

const MapCanvas = dynamic(() => import("@/components/three/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#1A1A2E]">
      <p className="text-yellow-400/50 text-xs tracking-[0.4em] animate-pulse">
        ✦ MEMUAT PETA ✦
      </p>
    </div>
  ),
})

export default function PetaSection() {
    const [showCanvas, setShowCanvas] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowCanvas(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.2 }
        )
        if (wrapperRef.current) observer.observe(wrapperRef.current)
        return () => observer.disconnect()
    }, [])

    return (
      <section
        ref={wrapperRef}
        className="relative w-full py-16 px-6 flex flex-col items-center"
      >
        {/* Header */}
        <p className="text-xs tracking-[0.4em] text-yellow-400/70 mb-2 font-light">
          ✦ JELAJAHI ✦
        </p>
        <h2 className="text-3xl font-bold text-yellow-300 mb-10 tracking-wide">
          Peta Kediri
        </h2>

        {/* Card */}
        <div className="relative w-full max-w-3xl">
          {/* Ornamen pojok - kiri atas */}
          <div className="absolute -top-4 -left-4 w-16 h-16 z-20 pointer-events-none">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 60 Q4 4 60 4"
                stroke="#C9A84C"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="4" cy="60" r="3" fill="#C9A84C" />
              <circle cx="60" cy="4" r="3" fill="#C9A84C" />
              <circle
                cx="4"
                cy="4"
                r="5"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.5"
              />
              <circle cx="4" cy="4" r="2" fill="#C9A84C" />
            </svg>
          </div>

          {/* Ornamen pojok - kanan atas */}
          <div className="absolute -top-4 -right-4 w-16 h-16 z-20 pointer-events-none rotate-90">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 60 Q4 4 60 4"
                stroke="#C9A84C"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="4" cy="60" r="3" fill="#C9A84C" />
              <circle cx="60" cy="4" r="3" fill="#C9A84C" />
              <circle
                cx="4"
                cy="4"
                r="5"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.5"
              />
              <circle cx="4" cy="4" r="2" fill="#C9A84C" />
            </svg>
          </div>

          {/* Ornamen pojok - kiri bawah */}
          <div className="absolute -bottom-4 -left-4 w-16 h-16 z-20 pointer-events-none -rotate-90">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 60 Q4 4 60 4"
                stroke="#C9A84C"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="4" cy="60" r="3" fill="#C9A84C" />
              <circle cx="60" cy="4" r="3" fill="#C9A84C" />
              <circle
                cx="4"
                cy="4"
                r="5"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.5"
              />
              <circle cx="4" cy="4" r="2" fill="#C9A84C" />
            </svg>
          </div>

          {/* Ornamen pojok - kanan bawah */}
          <div className="absolute -bottom-4 -right-4 w-16 h-16 z-20 pointer-events-none rotate-180">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 60 Q4 4 60 4"
                stroke="#C9A84C"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="4" cy="60" r="3" fill="#C9A84C" />
              <circle cx="60" cy="4" r="3" fill="#C9A84C" />
              <circle
                cx="4"
                cy="4"
                r="5"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.5"
              />
              <circle cx="4" cy="4" r="2" fill="#C9A84C" />
            </svg>
          </div>

          {/* Border gold card */}
          <div className="relative w-full h-[500px] border border-yellow-600/40 rounded-sm overflow-hidden shadow-[0_0_40px_rgba(201,168,76,0.15)]">
            {/* Glow top edge */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent z-10" />
            {/* Glow bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent z-10" />

            {/* Map Canvas atau Loading */}
            <div className="w-full h-full pointer-events-none">
            {showCanvas ? (
              <MapCanvas scrollZoom={false} fitPadding={20} showMarkers={false}/>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#1A1A2E]">
                <p className="text-yellow-400/50 text-xs tracking-[0.4em] animate-pulse">
                  ✦ MEMUAT PETA ✦
                </p>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <a
            href="/map"
            className="group inline-flex items-center gap-3 px-8 py-3 border border-yellow-600/50 text-yellow-300/80 text-xs tracking-[0.3em] hover:border-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/5 transition-all duration-500"
          >
            ✦ BUKA PETA LENGKAP
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </a>
        </div>
      </section>
    );
}