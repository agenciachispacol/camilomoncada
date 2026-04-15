import Link from "next/link";
import { notFound } from "next/navigation";
import NeonBackground from "@/components/NeonBackground";
import { supabase, type Article } from "@/lib/supabase";

export const revalidate = 60;

async function getArticle(slug: string): Promise<Article | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return (data as Article) ?? null;
}

export default async function ArticleDetail({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <main className="relative min-h-screen px-5 py-12">
      <NeonBackground />

      <article className="mx-auto max-w-2xl">
        <Link
          href="/articulos"
          className="mb-6 inline-block text-xs uppercase tracking-[0.25em] text-neon-cyan hover:text-white"
        >
          ← Artículos
        </Link>

        <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-neon-cyan sm:text-xs">
          {new Date(article.created_at).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <h1 className="text-h2 neon-text-pink">{article.title}</h1>

        {article.excerpt && (
          <p className="mt-4 text-lead text-white/75">{article.excerpt}</p>
        )}

        <div className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap text-base leading-relaxed text-white/85">
          {article.content}
        </div>
      </article>
    </main>
  );
}
