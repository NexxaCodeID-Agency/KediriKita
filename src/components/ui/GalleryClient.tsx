"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface GalleryClientProps {
  gallery: string[];
  name: string;
}

export default function GalleryClient({ gallery, name }: GalleryClientProps) {
  const [index, setIndex] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const modalImageRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const openModal = (i: number) => {
    setIndex(i);
    resetZoom();
    setIsImageLoaded(false);
  };

  const closeModal = useCallback(() => {
    setIndex(null);
    resetZoom();
  }, [resetZoom]);

  const prevImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (index !== null) {
        setIndex((index - 1 + gallery.length) % gallery.length);
        resetZoom();
        setIsImageLoaded(false);
      }
    },
    [index, gallery.length, resetZoom]
  );

  const nextImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (index !== null) {
        setIndex((index + 1) % gallery.length);
        resetZoom();
        setIsImageLoaded(false);
      }
    },
    [index, gallery.length, resetZoom]
  );

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => {
      const nextScale = Math.max(prev - 0.5, 1);
      if (nextScale === 1) setPosition({ x: 0, y: 0 });
      return nextScale;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, closeModal, prevImage, nextImage]);

  useEffect(() => {
    const handleWheelZoom = (e: WheelEvent) => {
      if (index === null) return;
      e.preventDefault();

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
      setScale(2.5);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale === 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getGridClass = () => {
    if (gallery.length === 1) return "grid-cols-1";
    if (gallery.length === 2) return "grid-cols-2";
    return "grid-cols-2 md:grid-cols-3";
  };

  const getItemClass = (i: number) => {
    if (gallery.length === 1) return "col-span-2 md:col-span-3 h-64 sm:h-80 md:h-[400px]";
    if (gallery.length === 2) return "h-48 sm:h-64 md:h-[300px]";
    if (i === 0) return "col-span-2 md:col-span-2 h-48 sm:h-64 md:h-[300px]";
    return "h-36 sm:h-48 md:h-[200px]";
  };

  return (
    <>
      <div className={`grid ${getGridClass()} gap-2 sm:gap-3`}>
        {gallery.map((url, i) => (
          <div
            key={i}
            className={`relative rounded-xl overflow-hidden cursor-pointer group ${getItemClass(i)}`}
            style={{
              border: "1px solid rgba(212,160,23,0.15)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            onClick={() => openModal(i)}
          >
            <Image
              src={url}
              alt={`${name} ${i + 1}`}
              fill
              sizes={
                i === 0 && gallery.length > 2
                  ? "(min-width: 768px) 66vw, 100vw"
                  : "(min-width: 768px) 33vw, 50vw"
              }
              quality={75}
              loading={i < 2 ? "eager" : "lazy"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                background:
                  "linear-gradient(to top, rgba(7,7,18,0.8) 0%, rgba(7,7,18,0.1) 50%, transparent 100%)",
              }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <div
                className="p-2.5 rounded-full mb-2"
                style={{
                  background: "rgba(212,160,23,0.2)",
                  border: "1px solid rgba(212,160,23,0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Maximize2 size={16} className="text-[#d4a017]" />
              </div>
              <span
                className="text-[11px] font-semibold tracking-wider uppercase"
                style={{
                  color: "#d4a017",
                  fontFamily: "var(--font-lato)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                }}
              >
                {gallery.length > 1 ? `${gallery.length} Foto` : "Lihat"}
              </span>
            </div>

            {i === 0 && gallery.length > 2 && (
              <div
                className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider"
                style={{
                  background: "rgba(212,160,23,0.25)",
                  border: "1px solid rgba(212,160,23,0.4)",
                  color: "#fff8e0",
                  fontFamily: "var(--font-lato)",
                  backdropFilter: "blur(8px)",
                }}
              >
                +{gallery.length - 1} LAINNYA
              </div>
            )}
          </div>
        ))}
      </div>

      {index !== null && (
        <div
          ref={modalImageRef}
          className="fixed inset-0 z-[200] flex flex-col bg-[#070712]/95 backdrop-blur-md select-none"
          onClick={closeModal}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-3"
            style={{
              background: "rgba(7,7,18,0.8)",
              borderBottom: "1px solid rgba(212,160,23,0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "#d4a017", fontFamily: "var(--font-lato)" }}
              >
                Galeri
              </span>
              <span className="text-white/30 text-xs">|</span>
              <span className="text-white/50 text-xs" style={{ fontFamily: "var(--font-lato)" }}>
                {name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="text-white/50 hover:text-[#d4a017] transition-colors p-2 rounded-lg hover:bg-white/5"
                onClick={handleZoomIn}
                title="Perbesar"
              >
                <ZoomIn size={18} />
              </button>
              <button
                className="text-white/50 hover:text-[#d4a017] transition-colors p-2 rounded-lg hover:bg-white/5"
                onClick={handleZoomOut}
                title="Perkecil"
              >
                <ZoomOut size={18} />
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button
                className="text-white/50 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                onClick={closeModal}
                title="Tutup (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {gallery.length > 1 && (
              <button
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#d4a017] transition-all duration-300 bg-black/30 hover:bg-black/50 p-3 rounded-full z-10 backdrop-blur-sm"
                onClick={prevImage}
                style={{ border: "1px solid rgba(212,160,23,0.15)" }}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div
              className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`relative w-full h-full max-w-5xl transition-all ${
                  isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-default"
                }`}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
              >
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: "rgba(212,160,23,0.3)", borderTopColor: "#d4a017" }}
                    />
                  </div>
                )}
                <Image
                  src={gallery[index]}
                  alt={`${name} detail ${index + 1}`}
                  fill
                  quality={85}
                  className={`object-contain transition-opacity duration-300 ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>
            </div>

            {gallery.length > 1 && (
              <button
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#d4a017] transition-all duration-300 bg-black/30 hover:bg-black/50 p-3 rounded-full z-10 backdrop-blur-sm"
                onClick={nextImage}
                style={{ border: "1px solid rgba(212,160,23,0.15)" }}
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {gallery.length > 1 && (
            <div
              className="px-4 sm:px-6 py-3 overflow-x-auto"
              style={{
                background: "rgba(7,7,18,0.9)",
                borderTop: "1px solid rgba(212,160,23,0.1)",
              }}
            >
              <div className="flex items-center justify-center gap-2">
                {gallery.map((url, i) => (
                  <button
                    key={i}
                    className={`relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                      i === index
                        ? "ring-2 ring-[#d4a017] opacity-100 scale-105"
                        : "opacity-40 hover:opacity-70"
                    }`}
                    style={{
                      border:
                        i === index
                          ? "1px solid rgba(212,160,23,0.6)"
                          : "1px solid rgba(255,255,255,0.1)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIndex(i);
                      resetZoom();
                      setIsImageLoaded(false);
                    }}
                  >
                    <Image
                      src={url}
                      alt={`${name} thumb ${i + 1}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            className="flex items-center justify-center gap-4 py-2.5"
            style={{ background: "rgba(7,7,18,0.95)" }}
          >
            <span className="text-xs text-white/40" style={{ fontFamily: "var(--font-lato)" }}>
              {scale > 1 ? (
                <span className="text-[#d4a017] font-semibold">
                  Zoom {Math.round(scale * 100)}% &middot; Klik ganda untuk reset
                </span>
              ) : (
                <>
                  {index + 1} / {gallery.length} &middot; Scroll untuk zoom &middot; Klik ganda untuk
                  perbesar
                </>
              )}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
