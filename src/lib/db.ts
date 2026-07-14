// src/lib/db.ts
import { supabase } from "./supabase";

function mapLangCode(lang: string): string {
  if (lang === "cn") return "zh";
  return lang;
}

export async function getTranslationData(targetId: string, tableName: string, lang: string) {
  if (lang === "id") return null;

  const dbLang = mapLangCode(lang);

  console.log(`[i18n] getTranslationData targetId="${targetId}" table="${tableName}" lang="${lang}" dbLang="${dbLang}"`);

  const { data, error } = await supabase
    .from('translations')
    .select('column_name, translated_text') 
    .eq('target_id', targetId)
    .eq('table_name', tableName)
    .eq('lang_code', dbLang); 

  if (error) {
    console.error(`[i18n] Supabase error:`, error.message);
    return null;
  }

  if (!data || data.length === 0) {
    console.log(`[i18n] No translations found for targetId="${targetId}"`);
    return null;
  }

  console.log(`[i18n] Found ${data.length} translation rows`);

  return data.reduce((acc: Record<string, string>, item: { column_name: string; translated_text: string }) => {
    acc[item.column_name] = item.translated_text; 
    return acc;
  }, {} as Record<string, string>);
}