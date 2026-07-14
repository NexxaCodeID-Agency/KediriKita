"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const FADE_MS = 700;

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const onDoneRef = useRef(onDone);
  const [fading, setFading] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Selalu simpan referensi onDone terbaru tanpa re-run effect
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setIsMobile(mobile);
    video.src = mobile ? "/loadingMobile.mp4" : "/loading.mp4";
    video.load();

    let finished = false;
    let fadeTimer: ReturnType<typeof setTimeout>;
    let maxTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(maxTimer);
      setFading(true);
      fadeTimer = setTimeout(() => onDoneRef.current(), FADE_MS);
    };

    const FALLBACK_MAX_WAIT_MS = 3_000;
    maxTimer = setTimeout(finish, FALLBACK_MAX_WAIT_MS);

    const onLoadedMetadata = () => {
      const safetyBuffer = 1_000;
      const dynamicMaxWait = video.duration * 1000 + safetyBuffer;
      clearTimeout(maxTimer);
      maxTimer = setTimeout(finish, dynamicMaxWait);
    };

    const tryPlay = () => {
      setBuffering(false);
      video.play().catch(finish);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    video.addEventListener("ended", finish, { once: true });
    const onPlaying = () => setBuffering(false);
    video.addEventListener("playing", onPlaying, { once: true });

    tryPlay();

    return () => {
      finished = true;
      clearTimeout(fadeTimer);
      clearTimeout(maxTimer);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("ended", finish);
      video.removeEventListener("playing", onPlaying);
    };
  }, []);

  const skipLoading = () => {
    if (!fading) {
      setFading(true);
      setTimeout(() => onDoneRef.current(), FADE_MS);
    }
  };

  return (
    <div
      onClick={skipLoading}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: fading ? `opacity ${FADE_MS}ms ease` : "none",
        pointerEvents: fading ? "none" : "auto",
        cursor: "pointer",
        width: "100vw",
        height: "100dvh", // dynamic viewport height — fix untuk mobile address bar
        minHeight: "100dvh",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        // @ts-expect-error — fetchPriority valid di browser tapi belum di-type React untuk <video>
        fetchPriority="low"
        poster={
          isMobile ? "/loadingMobile-poster.avif" : "/loading-poster.webp"
        }
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          willChange: "transform",
          transform: "translateZ(0)",
          backgroundColor: "#000000",
        }}
      />

      {/* Spinner saat buffering */}
      {buffering && (
        <div className="ls-bottom-info">
          <div className="ls-spinner" />
          <span className="ls-label ls-label-buffer">{t.loading.buffering}</span>
        </div>
      )}

      {/* Instruksi/opsi sentuh untuk melewati */}
      {!buffering && (
        <div
          className="ls-bottom-info ls-skip-hint"
          style={{
            opacity: fading ? 0 : 0.5,
          }}
        >
          <span className="ls-label ls-label-skip">
            {isMobile ? t.loading.skipMobile : t.loading.skipDesktop}
          </span>
        </div>
      )}

      <style>{`
        @keyframes ls-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ls-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .ls-bottom-info {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: max(2.5rem, env(safe-area-inset-bottom, 0px) + 1.25rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 0 1rem;
          width: 100%;
          max-width: 24rem;
          text-align: center;
        }
        .ls-spinner {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid rgba(212,160,23,0.15);
          border-top-color: rgba(212,160,23,0.8);
          animation: ls-spin 0.8s linear infinite;
        }
        .ls-label {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: rgba(212,160,23,0.5);
          font-family: serif;
          text-transform: uppercase;
        }
        .ls-label-skip {
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.7);
          font-family: sans-serif;
        }
        .ls-skip-hint {
          transition: opacity 0.3s;
          animation: ls-pulse 2s infinite;
        }
        @media (max-width: 480px) {
          .ls-bottom-info {
            bottom: max(1.5rem, env(safe-area-inset-bottom, 0px) + 0.75rem);
            gap: 0.5rem;
          }
          .ls-spinner {
            width: 24px;
            height: 24px;
            border-width: 2px;
          }
          .ls-label {
            font-size: 10px;
            letter-spacing: 0.18em;
          }
        }
      `}</style>
    </div>
  );
}
