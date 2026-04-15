import Link from "next/link";
import NeonBackground from "@/components/NeonBackground";
import SectionTitle from "@/components/SectionTitle";
import AdminForm from "./AdminForm";

export const metadata = { title: "Admin · Camilo Moncada" };

export default function AdminPage() {
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

        <SectionTitle kicker="Privado">Subir contenido</SectionTitle>

        <p className="mb-6 text-center text-sm text-white/60">
          Publica artículos o prompts en tu biblioteca. Se guardan en Supabase.
        </p>

        <AdminForm />
      </div>
    </main>
  );
}
