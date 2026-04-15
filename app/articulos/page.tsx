import Link from "next/link";
import NeonBackground from "@/components/NeonBackground";
import SectionTitle from "@/components/SectionTitle";
import { supabase, type Article } from "@/lib/supabase";

export const revalidate = 60;

async function getArticles(): Promise<Article[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("articles")
    .select("*")
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
          <div className="space-y-4">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/articulos/${a.slug}`}
                className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-neon-pink/40 hover:shadow-[0_0_25px_rgba(255,43,214,0.3)]"
              >
                <h3 className="text-lg font-bold text-white group-hover:neon-text-pink sm:text-xl">
                  {a.title}
                </h3>
                {a.excerpt && (
                  <p className="mt-2 text-sm text-white/65">{a.excerpt}</p>
                )}
                <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
                  {new Date(a.created_at).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
