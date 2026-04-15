import Link from "next/link";
import NeonBackground from "@/components/NeonBackground";
import SectionTitle from "@/components/SectionTitle";
import CopyButton from "@/components/CopyButton";
import { supabase, type Prompt } from "@/lib/supabase";

export const revalidate = 60;

async function getPrompts(): Promise<Prompt[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as Prompt[]) ?? [];
}

export default async function PromptsPage() {
  const prompts = await getPrompts();

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

        <SectionTitle kicker="Biblioteca">Prompts IA</SectionTitle>

        {prompts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-white/60 backdrop-blur-md">
            Aún no hay prompts publicados. Vuelve pronto.
          </div>
        ) : (
          <div className="space-y-4">
            {prompts.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.3)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-white sm:text-lg">
                    {p.title}
                  </h3>
                  <CopyButton text={p.body} />
                </div>
                {p.description && (
                  <p className="mt-1 text-sm text-white/65">{p.description}</p>
                )}
                <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-ink-950/70 p-4 text-xs leading-relaxed text-white/85 sm:text-sm">
                  <code>{p.body}</code>
                </pre>
                {p.tags && p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neon-cyan"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
