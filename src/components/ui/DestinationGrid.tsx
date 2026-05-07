"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type Destination = {
  id: number;
  slug: string;
  name: string;
  category: string;
  short_desc: string;
  image: string;
};

const CATEGORIES = ["Semua", "Wisata Alam", "Kuliner", "Sejarah & Budaya"];

export default function DestinationGrid({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = destinations
    .filter((d) =>
      activeCategory === "Semua"
        ? true
        : d.category.toLowerCase() === activeCategory.toLowerCase(),
    )
    .filter((d) =>
      search.trim() === ""
        ? true
        : d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.short_desc.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <section className="min-h-screen px-6 pt-10 pb-24 max-w-7xl mx-auto">
      {/* Back nav */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-10 text-sm transition-colors duration-200"
        style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
      >
        <ArrowLeft size={16} />
        Kembali ke Beranda
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <p
          className="text-xs tracking-[0.3em] mb-3 uppercase"
          style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
        >
          ✦ Temukan Destinasimu ✦
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{
            fontFamily: "var(--font-cinzel)",
            textShadow: "0 2px 16px rgba(0,0,0,0.6)",
          }}
        >
          Jelajahi Kediri
        </h1>
        <p
          className="mt-4 text-sm max-w-md mx-auto"
          style={{
            color: "rgba(255,255,255,0.55)",
            fontFamily: "var(--font-lato)",
          }}
        >
          Wisata alam, kuliner khas, dan warisan sejarah menanti di setiap sudut
          kota.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari destinasi..."
            className="w-full px-5 py-3 rounded-full text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              fontFamily: "var(--font-lato)",
              caretColor: "#d4a017",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(212,160,23,0.6)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)";
            }}
          />
          {/* Icon search */}
          <span
            className="absolute right-5 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            🔍
          </span>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-all duration-200"
            style={{
              fontFamily: "var(--font-lato)",
              background:
                activeCategory === cat
                  ? "var(--color-emas)"
                  : "rgba(255,255,255,0.06)",
              color:
                activeCategory === cat ? "#1A1A2E" : "rgba(255,255,255,0.6)",
              border:
                activeCategory === cat
                  ? "1px solid var(--color-emas)"
                  : "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p
            className="text-lg"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-lato)",
            }}
          >
            Belum ada destinasi dalam kategori ini.
          </p>
          <button
            onClick={() => setActiveCategory("Semua")}
            className="text-xs tracking-widest uppercase underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{
              color: "var(--color-emas)",
              fontFamily: "var(--font-lato)",
            }}
          >
            Tampilkan semua
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/destinasi/${item.slug}`} className="group block">
                <div
                  className="relative rounded-2xl overflow-hidden border transition-all duration-300"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    willChange: "transform",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      "1px solid var(--color-emas)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      "1px solid rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0)";
                  }}
                >
                  {/* Gambar */}
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(26,26,46,0.85) 0%, transparent 60%)",
                      }}
                    />
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs uppercase tracking-widest"
                      style={{
                        fontFamily: "var(--font-lato)",
                        background: "rgba(212,160,23,0.85)",
                        color: "#1A1A2E",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h2
                      className="text-white text-lg font-semibold leading-snug"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {item.name}
                    </h2>
                    <p
                      className="text-sm mt-2 line-clamp-2 leading-relaxed"
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "var(--font-lato)",
                      }}
                    >
                      {item.short_desc}
                    </p>
                    <span
                      className="inline-block mt-4 text-xs tracking-widest uppercase"
                      style={{
                        color: "var(--color-emas)",
                        fontFamily: "var(--font-lato)",
                      }}
                    >
                      Lihat Detail →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
