"use client";

import { useParams } from "next/navigation";
import { getLocale, type Locale } from "@/lib/i18n";
import { translations } from "@/lib/translations";

export function useTranslation() {
  const params = useParams();
  const lang = getLocale(params?.lang as string | undefined);
  const t = translations[lang];

  return { lang, t } satisfies { lang: Locale; t: (typeof translations)[Locale] };
}
