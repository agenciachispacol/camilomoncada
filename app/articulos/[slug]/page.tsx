import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NeonBackground from "@/components/NeonBackground";
import RenderedContent from "@/components/RenderedContent";
import { supabase, type Article } from "@/lib/supabase";

export const revalidate = 60;

async function getArticle(slug: string): Promise<Article | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("visible", true)
    .maybeSingle();
  if (error) return null;
  return (data as Article) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article)
    return { title: "Artículo no encontrado · Camilo Moncada" };
  return {
    title: `${article.title} · Camilo Moncada`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      publishedTime: article.created_at,
      images: article.cover_url ? [article.cover_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.cover_url ? [article.cover_url] : undefined,
    },
  };
}

export default async function ArticleDetail({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.cover_url ?? undefined,
    datePublished: article.created_at,
    author: {
      "@type": "Person",
      name: "Camilo Moncada",
    },
  };

  return (
    <main className="relative min-h-screen px-5 py-12">
      <NeonBackground />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-2xl">
        <Link
          href="/articulos"
          className="mb-6 inline-block text-xs uppercase tracking-[0.25em] text-neon-cyan hover:text-white"
        >
          ← Artículos
        </Link>

        {article.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_url}
            alt={article.title}
            className="mb-6 h-56 w-full rounded-2xl border border-white/10 object-cover shadow-[0_0_30px_rgba(255,43,214,0.25)]"
          />
        )}

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

        <div className="mt-8">
          <RenderedContent html={article.content} />
        </div>
      </article>
    </main>
  );
}
