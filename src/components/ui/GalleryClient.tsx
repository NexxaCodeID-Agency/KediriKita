"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface GalleryClientProps {
  gallery: string[];
  name: string;
}

export default function GalleryClient({ gallery, name }: GalleryClientProps) {
  const [index, setIndex] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [dragStartModal, setDragStartModal] = useState({ x: 0, y: 0 });

  const modalImageRef = useRef<HTMLDivElement>(null);

  const isSupabaseHosted = (src: string) => src.includes(".supabase.co");

  const openModal = (i: number) => {
    setIndex(i);
    resetZoom();
  };

  const closeModal = () => {
    setIndex(null);
    resetZoom();
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index !== null) {
      setIndex((index - 1 + gallery.length) % gallery.length);
      resetZoom();
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index !== null) {
      setIndex((index + 1) % gallery.length);
      resetZoom();
    }
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => {
      const nextScale = Math.max(prev - 0.25, 1);
      if (nextScale === 1) setPosition({ x: 0, y: 0 });
      return nextScale;
    });
  };

  // 🔥 FITUR SCROLL MOUSE ZOOM (WHEEL EVENT) TETEP AMAN DI MODAL
  useEffect(() => {
    const handleWheelZoom = (e: WheelEvent) => {
      if (index === null) return;
      e.preventDefault(); // Kunci scroll halaman luar biar gak goyang

      setScale((prevScale) => {
        const delta = e.deltaY < 0 ? 0.25 : -0.25;
        const newScale = Math.min(Math.max(prevScale + delta, 1), 4);
        
        if (newScale === 1) setPosition({ x: 0, y: 0 });
        return newScale;
      });
    };

    const modalArea = modalImageRef.current;
    if (modalArea) {
      modalArea.addEventListener("wheel", handleWheelZoom, { passive: false });
    }

    return () => {
      if (modalArea) {
        modalArea.removeEventListener("wheel", handleWheelZoom);
      }
    };
  }, [index]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2);
    }
  };

  const handleMouseDownModal = (e: React.MouseEvent) => {
    if (scale === 1) return;
    setIsDraggingModal(true);
    setDragStartModal({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMoveModal = (e: React.MouseEvent) => {
    if (!isDraggingModal || scale === 1) return;
    setPosition({
      x: e.clientX - dragStartModal.x,
      y: e.clientY - dragStartModal.y,
    });
  };

  const handleMouseUpModal = () => {
    setIsDraggingModal(false);
  };

  return (
    <>
      {/* 🟢 BALIK KE GRID AWAL LU YANG MURNI VERTIKAL (TANPA SCROLL LINE) */}
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
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white/80">
              Lihat Detail
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Modal / Lightbox */}
      {index !== null && (
        <div
          ref={modalImageRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fade-in select-none"
          onClick={closeModal}
          onMouseMove={handleMouseMoveModal}
          onMouseUp={handleMouseUpModal}
          onMouseLeave={handleMouseUpModal}
        >
          <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
            <button
              className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <button
              className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full"
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <button
              className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full"
              onClick={closeModal}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {gallery.length > 1 && scale === 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full z-50"
              onClick={prevImage}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div
            className="relative w-full max-w-4xl h-[70vh] sm:h-[80vh] overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative w-full h-full transition-transform ${
                isDraggingModal ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-default"
              }`}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDraggingModal ? "none" : "transform 0.15s ease-out",
              }}
              onDoubleClick={handleDoubleClick}
              onMouseDown={handleMouseDownModal}
            >
              <Image
                src={gallery[index]}
                alt={`${name} detail ${index + 1}`}
                fill
                unoptimized={!isSupabaseHosted(gallery[index])}
                className="object-contain pointer-events-none"
              />
            </div>
          </div>

          {gallery.length > 1 && scale === 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors bg-white/10 p-3 rounded-full z-50"
              onClick={nextImage}
            >
              <ChevronRight size={24} />
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            {scale > 1 ? `Zoom: ${Math.round(scale * 100)}%` : `${index + 1} / ${gallery.length}`}
          </div>
        </div>
      )}
    </>
  );
}