"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function DestinasiError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[/destinasi] runtime error:", error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--color-langit-malam)" }}
    >
      <div className="max-w-md text-center">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "var(--color-emas)", fontFamily: "var(--font-lato)" }}
        >
          ✦ Ada Sedikit Kendala ✦
        </p>
        <h1
          className="text-2xl sm:text-3xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Halaman tidak bisa dimuat
        </h1>
        <p
          className="text-sm mb-8"
          style={{
            color: "rgba(255,255,255,0.55)",
            fontFamily: "var(--font-lato)",
            lineHeight: 1.8,
          }}
        >
          Terjadi kesalahan saat mengambil data destinasi. Coba muat ulang, atau
          kembali ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all hover:opacity-80"
            style={{
              background: "var(--color-emas)",
              color: "#1A1A2E",
              fontFamily: "var(--font-lato)",
            }}
          >
            <RefreshCw size={14} />
            Muat ulang
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all hover:opacity-80"
            style={{
              color: "var(--color-emas)",
              border: "1px solid rgba(212,160,23,0.4)",
              fontFamily: "var(--font-lato)",
            }}
          >
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
