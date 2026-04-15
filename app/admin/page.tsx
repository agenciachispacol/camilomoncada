import Link from "next/link";
import NeonBackground from "@/components/NeonBackground";
import AdminShell from "./AdminShell";

export const metadata = { title: "Admin · Camilo Moncada" };

export default function AdminPage() {
  return (
    <main className="relative min-h-screen px-5 py-10">
      <NeonBackground />
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-block text-xs uppercase tracking-[0.25em] text-neon-cyan hover:text-white"
        >
          ← Volver a la landing
        </Link>
        <AdminShell />
      </div>
    </main>
  );
}
