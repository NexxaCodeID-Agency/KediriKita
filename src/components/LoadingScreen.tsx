'use client';

import { useEffect, useRef, useState } from 'react';

const FADE_MS = 700;
const MAX_WAIT_MS = 8_000; // paksa selesai setelah 8 detik

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onDoneRef = useRef(onDone);
  const [fading, setFading] = useState(false);
  const [buffering, setBuffering] = useState(true);

  // Selalu simpan referensi onDone terbaru tanpa re-run effect
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pilih video sesuai viewport — portrait/mobile pakai loadingMobile.mp4
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    video.src = isMobile ? '/loadingMobile.mp4' : '/loading.mp4';
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

    const tryPlay = () => {
      setBuffering(false);
      video.play().catch(finish); // autoplay diblokir → langsung selesai
    };

    // Paksa selesai setelah MAX_WAIT_MS (network lambat / video gagal total)
    maxTimer = setTimeout(finish, MAX_WAIT_MS);

    video.addEventListener('ended', finish, { once: true });

    // HAVE_CURRENT_DATA (2) = sudah cukup untuk mulai putar 1 frame
    // Lebih cepat dari HAVE_ENOUGH_DATA (4) yang tunggu buffer penuh
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    return () => {
      finished = true;
      clearTimeout(fadeTimer);
      clearTimeout(maxTimer);
      video.removeEventListener('ended', finish);
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: fading ? `opacity ${FADE_MS}ms ease` : 'none',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />

      {/* Spinner saat buffering */}
      {buffering && (
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '2px solid rgba(212,160,23,0.15)',
              borderTopColor: 'rgba(212,160,23,0.8)',
              animation: 'ls-spin 0.8s linear infinite',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: 'rgba(212,160,23,0.5)',
              fontFamily: 'serif',
              textTransform: 'uppercase',
            }}
          >
            Memuat...
          </span>
        </div>
      )}

      <style>{`
        @keyframes ls-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
