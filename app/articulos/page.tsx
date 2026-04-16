import Link from "next/link";
import type { Metadata } from "next";
import NeonBackground from "@/components/NeonBackground";
import SectionTitle from "@/components/SectionTitle";
import ArticleAccordion from "@/components/ArticleAccordion";
import { supabase, type Article } from "@/lib/supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Artículos · Camilo Moncada",
  description:
    "Artículos y tips de IA aplicada a emprendimientos y negocios. Aprende a crecer con inteligencia artificial.",
};

async function getArticles(): Promise<Article[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("visible", true)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as Article[]) ?? [];
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="relative min-h-screen px-5 py-12">
      <NeonBackground />

      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-block text-xs uppercase tracking-[0.25em] text-neon-cyan hover:text-white"
        >
          ← Volver
        </Link>

        <SectionTitle kicker="Blog">Artículos & Tips</SectionTitle>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-white/60 backdrop-blur-md">
            Aún no hay artículos publicados. Vuelve pronto.
          </div>
        ) : (
          <ArticleAccordion articles={articles} />
        )}
      </div>
    </main>
  );
}
