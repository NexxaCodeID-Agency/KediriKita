"use client";
import { useState, useRef, useEffect } from "react";
import { locales } from "@/lib/i18n";
import { usePathname, useRouter, useParams } from "next/navigation";

const flagMap: Record<string, string> = {
  id: "id",
  en: "gb",
  cn: "cn",
};

const labelMap: Record<string, string> = {
  id: "ID",
  en: "EN",
  cn: "CN",
};

function Flag({ lang }: { lang: string }) {
  return (
    <span
      className={`fi fis fi-${flagMap[lang] ?? "xx"} w-5 h-5 rounded-full inline-block shrink-0`}
      style={{ boxShadow: "0 0 0 1px rgba(212,160,23,0.35)" }}
    />
  );
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentLang = (params?.lang as string) || "id";

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const switchLanguage = (newLang: string) => {
    const segments = pathname.split("/");
    segments[1] = newLang;
    router.push(segments.join("/"));
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const otherLocales = locales.filter((l) => l !== currentLang);
  const isToggleMode = (locales as readonly string[]).length === 2;

  return (
    <div ref={wrapperRef} className="fixed top-6 right-6 z-[100]">
      {isToggleMode ? (
        <button
          onClick={() => switchLanguage(otherLocales[0])}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full backdrop-blur-md border shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: "rgba(10, 10, 20, 0.65)",
            borderColor: "rgba(212, 160, 23, 0.25)",
          }}
          title={`Switch to ${labelMap[otherLocales[0]]}`}
        >
          <Flag lang={currentLang} />
          <span className="text-xs font-black uppercase tracking-wider text-[#fff8e0]">
            {labelMap[currentLang]}
          </span>
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full backdrop-blur-md border shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(10, 10, 20, 0.65)",
              borderColor: "rgba(212, 160, 23, 0.25)",
            }}
            title="Change language"
          >
            <Flag lang={currentLang} />
            <span className="text-xs font-black uppercase tracking-wider text-[#fff8e0]">
              {labelMap[currentLang]}
            </span>
          </button>

          {open && (
            <div
              className="absolute top-full right-0 mt-2 flex flex-col gap-1 p-1.5 rounded-2xl backdrop-blur-md border shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              style={{
                background: "rgba(10, 10, 20, 0.85)",
                borderColor: "rgba(212, 160, 23, 0.25)",
              }}
            >
              {otherLocales.map((lang) => (
                <button
                  key={lang}
                  onClick={() => switchLanguage(lang)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95"
                  title={labelMap[lang]}
                >
                  <Flag lang={lang} />
                  <span className="text-xs font-black uppercase tracking-wider text-[#fff8e0]/80">
                    {labelMap[lang]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}