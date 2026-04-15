import Link from "next/link";
import type { Metadata } from "next";
import NeonBackground from "@/components/NeonBackground";
import SectionTitle from "@/components/SectionTitle";
import RenderedContent from "@/components/RenderedContent";
import { getSettings } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Política de datos · Camilo Moncada",
  description:
    "Política de tratamiento de datos personales y términos de contacto.",
};

export default async function PrivacyPage() {
  const settings = await getSettings();
  const policy = settings.privacy_policy || "";

  // Detectar si el contenido es HTML (contiene etiquetas) o texto plano
  const isHtml = /<[a-z][\s\S]*>/i.test(policy);

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

        <SectionTitle kicker="Legal">Política de datos</SectionTitle>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
          {policy ? (
            isHtml ? (
              <RenderedContent html={policy} />
            ) : (
              <div className="neon-prose whitespace-pre-wrap">{policy}</div>
            )
          ) : (
            <p className="text-sm text-white/60">
              Aún no se ha publicado la política de datos.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/45">
          Última actualización:{" "}
          {new Date().toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </main>
  );
}
