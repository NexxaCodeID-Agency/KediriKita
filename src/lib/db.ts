import { supabase } from "./supabase";
import { unstable_cache } from "next/cache";

function mapLangCode(lang: string): string {
  if (lang === "cn") return "zh";
  return lang;
}

export const getTranslationData = unstable_cache(
  async (targetId: string, tableName: string, lang: string) => {
    if (lang === "id") return null;

    const dbLang = mapLangCode(lang);

    const { data, error } = await supabase
      .from("translations")
      .select("column_name, translated_text")
      .eq("target_id", targetId)
      .eq("table_name", tableName)
      .eq("lang_code", dbLang);

    if (error || !data || data.length === 0) return null;

    return data.reduce(
      (acc: Record<string, string>, item: { column_name: string; translated_text: string }) => {
        acc[item.column_name] = item.translated_text;
        return acc;
      },
      {} as Record<string, string>
    );
  },
  ["translations"],
  { revalidate: 300, tags: ["translations"] }
);

export async function getBatchTranslations(
  targetIds: string[],
  tableName: string,
  lang: string
): Promise<Map<string, Record<string, string>>> {
  if (lang === "id" || targetIds.length === 0) return new Map();

  const dbLang = mapLangCode(lang);

  const { data, error } = await supabase
    .from("translations")
    .select("target_id, column_name, translated_text")
    .eq("table_name", tableName)
    .eq("lang_code", dbLang)
    .in("target_id", targetIds);

  if (error || !data || data.length === 0) return new Map();

  const map = new Map<string, Record<string, string>>();
  for (const row of data) {
    const existing = map.get(row.target_id) ?? {};
    existing[row.column_name] = row.translated_text;
    map.set(row.target_id, existing);
  }
  return map;
}
