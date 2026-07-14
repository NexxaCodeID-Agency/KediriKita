"use client";
import { useState, useRef, useEffect } from "react";
import { locales } from "@/lib/i18n";
import { usePathname, useRouter, useParams } from "next/navigation";

const labelMap: Record<string, string> = {
  id: "ID",
  en: "EN",
  cn: "CN",
};

function Flag({ lang }: { lang: string }) {
  const flags: Record<string, React.ReactNode> = {
    id: (
      <svg viewBox="0 0 36 36" className="w-5 h-5 rounded-full inline-block shrink-0">
        <clipPath id="circle"><circle cx="18" cy="18" r="18" /></clipPath>
        <g clipPath="url(#circle)">
          <rect width="36" height="18" fill="#FF0000" />
          <rect y="18" width="36" height="18" fill="#FFFFFF" />
        </g>
      </svg>
    ),
    en: (
      <svg viewBox="0 0 36 36" className="w-5 h-5 rounded-full inline-block shrink-0">
        <clipPath id="circle-en"><circle cx="18" cy="18" r="18" /></clipPath>
        <g clipPath="url(#circle-en)">
          <rect width="36" height="36" fill="#00247D" />
          <path d="M0,0 L36,36 M36,0 L0,36" stroke="#FFF" strokeWidth="4" />
          <path d="M18,0 V36 M0,18 H36" stroke="#FFF" strokeWidth="7" />
          <path d="M18,0 V36 M0,18 H36" stroke="#CF142B" strokeWidth="3" />
          <path d="M0,0 L36,36 M36,0 L0,36" stroke="#CF142B" strokeWidth="1.5" />
        </g>
      </svg>
    ),
    cn: (
      <svg viewBox="0 0 36 36" className="w-5 h-5 rounded-full inline-block shrink-0">
        <clipPath id="circle-cn"><circle cx="18" cy="18" r="18" /></clipPath>
        <g clipPath="url(#circle-cn)">
          <rect width="36" height="36" fill="#DE2910" />
          <polygon transform="translate(8,6) scale(0.45)" points="12,0 14.5,8.5 23.5,8.5 16,14 18.5,22.5 12,17.5 5.5,22.5 8,14 0.5,8.5 9.5,8.5" fill="#FFDE00" />
          <polygon transform="translate(17,3) scale(0.2)" points="12,0 14.5,8.5 23.5,8.5 16,14 18.5,22.5 12,17.5 5.5,22.5 8,14 0.5,8.5 9.5,8.5" fill="#FFDE00" />
          <polygon transform="translate(19,6) scale(0.2)" points="12,0 14.5,8.5 23.5,8.5 16,14 18.5,22.5 12,17.5 5.5,22.5 8,14 0.5,8.5 9.5,8.5" fill="#FFDE00" />
          <polygon transform="translate(19,10) scale(0.2)" points="12,0 14.5,8.5 23.5,8.5 16,14 18.5,22.5 12,17.5 5.5,22.5 8,14 0.5,8.5 9.5,8.5" fill="#FFDE00" />
          <polygon transform="translate(17,13) scale(0.2)" points="12,0 14.5,8.5 23.5,8.5 16,14 18.5,22.5 12,17.5 5.5,22.5 8,14 0.5,8.5 9.5,8.5" fill="#FFDE00" />
        </g>
      </svg>
    ),
  };
  return (
    <span
      style={{ boxShadow: "0 0 0 1px rgba(212,160,23,0.35)", borderRadius: "50%", display: "inline-block", lineHeight: 0 }}
    >
      {flags[lang] ?? <span className="w-5 h-5 rounded-full inline-block shrink-0 bg-gray-500" />}
    </span>
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