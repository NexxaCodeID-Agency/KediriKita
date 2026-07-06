"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryClientProps {
  gallery: string[];
  name: string;
}

export default function GalleryClient({ gallery, name }: GalleryClientProps) {
  const [index, setIndex] = useState<number | null>(null);

  const isSupabaseHosted = (src: string) => src.includes(".supabase.co");

  const openModal = (i: number) => setIndex(i);
  const closeModal = () => setIndex(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index !== null) {
      setIndex((index - 1 + gallery.length) % gallery.length);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index !== null) {
      setIndex((index + 1) % gallery.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {gallery.map((url, i) => (
          <div
            key={i}
            className="relative rounded-xl overflow-hidden h-36 sm:h-48 md:h-[200px] cursor-pointer group"
            style={{ border: "1px solid rgba(212,160,23,0.2)" }}
            onClick={() => openModal(i)}
          >
            <Image
              src={url}
              alt={`${name} ${i + 1}`}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              quality={85}
              unoptimized={!isSupabaseHosted(url)}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay saat di-hover biar makin interaktif */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white/80">
              Lihat Detail
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Modal / Lightbox */}
      {index !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          {/* Tombol Close */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full"
            onClick={closeModal}
          >
            <X size={24} />
          </button>

          {/* Navigasi Kiri */}
          {gallery.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Foto Ukuran Besar */}
          <div 
            className="relative w-full max-w-4xl h-[70vh] sm:h-[80vh]"
            onClick={(e) => e.stopPropagation()} // Supaya tidak ke-close saat gambar diklik
          >
            <Image
              src={gallery[index]}
              alt={`${name} detail ${index + 1}`}
              fill
              unoptimized={!isSupabaseHosted(gallery[index])}
              className="object-contain"
            />
          </div>

          {/* Navigasi Kanan */}
          {gallery.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Keterangan Index */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60">
            {index + 1} / {gallery.length}
          </div>
        </div>
      )}
    </>
  );
}