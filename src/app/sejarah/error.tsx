"use client";

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log eror ke layanan analytics atau console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-xl font-bold text-red-500 mb-4">Waduh, ada sesuatu yang salah! 😹</h2>
      <button
        onClick={() => reset()} // Fungsi reset buat nyoba render ulang halaman
        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
      >
        Coba Lagi
      </button>
    </div>
  );
}