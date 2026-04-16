import Link from "next/link";
import type { Metadata } from "next";
import NeonBackground from "@/components/NeonBackground";
import SectionTitle from "@/components/SectionTitle";
import PromptAccordion from "@/components/PromptAccordion";
import { supabase, type Prompt } from "@/lib/supabase";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Biblioteca de Prompts · Camilo Moncada",
  description:
    "Biblioteca de prompts listos para usar en tu negocio: marketing, ventas, automatización y crecimiento con IA.",
};

async function getPrompts(): Promise<Prompt[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("visible", true)
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

        <p className="mb-6 text-center text-sm text-white/55">
          Toca cualquier prompt para verlo completo y copiarlo.
        </p>

        {prompts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-white/60 backdrop-blur-md">
            Aún no hay prompts publicados. Vuelve pronto.
          </div>
        ) : (
          <PromptAccordion prompts={prompts} />
        )}
      </div>
    </main>
  );
}
