import { createClient } from "@supabase/supabase-js";

// Cliente anónimo para lecturas públicas desde server components
function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export type SiteSettings = {
  name: string;
  role: string;
  tagline: string;
  subtagline: string;
  avatar_url: string;
  whatsapp_number: string;
  whatsapp_message: string;
  cal_namespace: string;
  cal_link: string;
  privacy_policy: string;
};

const FALLBACK_SETTINGS: SiteSettings = {
  name: "Camilo Moncada",
  role: "AI para Emprendedores",
  tagline:
    "Ayudo a emprendedores a crecer sus empresas con soluciones de Inteligencia Artificial.",
  subtagline:
    "Consultorías, clases virtuales y automatizaciones con IA hechas a la medida.",
  avatar_url: "",
  whatsapp_number: "57320946700",
  whatsapp_message:
    "Hola Camilo, vi tu landing y quiero agendar una consultoría gratuita para crecer mi empresa con IA.",
  cal_namespace: "30min",
  cal_link: "camilo-moncada-0kerld/30min",
  privacy_policy: "",
};

export async function getSettings(): Promise<SiteSettings> {
  const supabase = anonClient();
  if (!supabase) return FALLBACK_SETTINGS;
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  if (error || !data) return FALLBACK_SETTINGS;
  const obj: Record<string, string> = {};
  for (const row of data as any[]) obj[row.key] = row.value ?? "";
  return { ...FALLBACK_SETTINGS, ...obj } as SiteSettings;
}

export type LinkItem = {
  id: string;
  title: string;
  subtitle: string | null;
  url: string;
  icon_name: string | null;
  icon_url: string | null;
  accent: "pink" | "cyan" | "purple" | "green" | "yellow";
  external: boolean;
  position: number;
  visible: boolean;
};

export async function getLinks(): Promise<LinkItem[]> {
  const supabase = anonClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("visible", true)
    .order("position", { ascending: true });
  if (error || !data) return [];
  return data as LinkItem[];
}

export function whatsappUrlFrom(settings: SiteSettings) {
  const num = (settings.whatsapp_number || "").replace(/\D/g, "");
  const msg = encodeURIComponent(settings.whatsapp_message || "");
  return `https://wa.me/${num}?text=${msg}`;
}

export async function getLatestArticles(limit = 4) {
  const supabase = anonClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("visible", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data;
}

export async function getLatestPrompts(limit = 6) {
  const supabase = anonClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("visible", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data;
}
