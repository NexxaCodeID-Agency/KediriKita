export const locales = ["id", "en", "cn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocale(lang?: string | null): Locale {
  if (lang && isValidLocale(lang)) return lang;
  return defaultLocale;
}

export function localizedPath(lang: Locale, path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${lang}`;
  return `/${lang}${normalized}`;
}
