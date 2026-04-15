import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://camilomoncada.ia";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/articulos`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/prompts`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return base;

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });
    const { data } = await supabase
      .from("articles")
      .select("slug, updated_at, created_at")
      .eq("visible", true);

    const articles =
      data?.map((a: any) => ({
        url: `${SITE_URL}/articulos/${a.slug}`,
        lastModified: new Date(a.updated_at || a.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })) ?? [];

    return [...base, ...articles];
  } catch {
    return base;
  }
}
