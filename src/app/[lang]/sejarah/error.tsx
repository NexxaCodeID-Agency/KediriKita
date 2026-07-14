"use client";

import { useEffect } from 'react';
import { useTranslation } from "@/hooks/useTranslation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-xl font-bold text-red-500 mb-4">{t.error.somethingWrong}</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
      >
        {t.error.tryAgain}
      </button>
    </div>
  );
}