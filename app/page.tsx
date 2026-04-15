import {
  MessageCircle,
  Instagram,
  Calendar,
  GraduationCap,
  Sparkles,
  BookOpen,
  Rocket,
} from "lucide-react";
import NeonBackground from "@/components/NeonBackground";
import Hero from "@/components/Hero";
import LinkCard from "@/components/LinkCard";
import Marquee from "@/components/Marquee";
import CalEmbed from "@/components/CalEmbed";
import SectionTitle from "@/components/SectionTitle";
import { site, whatsappUrl } from "@/lib/site";

// Icono TikTok (lucide no lo trae)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.6 6.7a5.3 5.3 0 0 1-3.2-1.2 5.3 5.3 0 0 1-2-3.5h-3.3v13.5a2.6 2.6 0 1 1-1.9-2.5V9.5a5.9 5.9 0 1 0 5.2 5.9V9.2a8.6 8.6 0 0 0 5.2 1.7V7.5c-.1-.2 0-.5 0-.8z" />
    </svg>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <NeonBackground />

      <Hero />

      <Marquee />

      {/* Links principales */}
      <section className="px-5 py-10">
        <div className="mx-auto w-full max-w-xl space-y-3">
          <LinkCard
            href={whatsappUrl}
            external
            icon={<MessageCircle size={22} />}
            title="Escríbeme por WhatsApp"
            subtitle="Mensaje directo con respuesta rápida"
            accent="green"
            delay={0.05}
          />
          <LinkCard
            href="#consultoria"
            icon={<Calendar size={22} />}
            title="Consultoría gratuita 30 min"
            subtitle="Agenda vía Cal.com"
            accent="pink"
            delay={0.1}
          />
          <LinkCard
            href="#clases"
            icon={<GraduationCap size={22} />}
            title="Clases de IA para emprendimientos"
            subtitle="Formación virtual práctica"
            accent="purple"
            delay={0.15}
          />
          <LinkCard
            href="/articulos"
            icon={<BookOpen size={22} />}
            title="Artículos & tips"
            subtitle="IA aplicada a negocios"
            accent="cyan"
            delay={0.2}
          />
          <LinkCard
            href="/prompts"
            icon={<Sparkles size={22} />}
            title="Biblioteca de prompts"
            subtitle="Plantillas listas para usar"
            accent="pink"
            delay={0.25}
          />
          <LinkCard
            href={site.socials.instagram}
            external
            icon={<Instagram size={22} />}
            title="Instagram"
            subtitle="@camilomoncada.ia"
            accent="purple"
            delay={0.3}
          />
          <LinkCard
            href={site.socials.tiktok}
            external
            icon={<TikTokIcon className="h-5 w-5" />}
            title="TikTok"
            subtitle="@camilomoncada.ia"
            accent="cyan"
            delay={0.35}
          />
        </div>
      </section>

      {/* Servicios */}
      <section id="clases" className="px-5 py-12">
        <div className="mx-auto max-w-xl">
          <SectionTitle kicker="Qué hago">Servicios con IA</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: <Rocket size={22} />,
                title: "Consultoría estratégica",
                desc: "Diagnóstico de tu negocio y hoja de ruta con IA.",
              },
              {
                icon: <GraduationCap size={22} />,
                title: "Clases virtuales",
                desc: "Aprende a usar IA para acelerar tu emprendimiento.",
              },
              {
                icon: <Sparkles size={22} />,
                title: "Automatizaciones",
                desc: "Agentes y workflows para ahorrarte horas cada semana.",
              },
              {
                icon: <BookOpen size={22} />,
                title: "Mentoría continua",
                desc: "Acompañamiento mes a mes para crecer tu empresa.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-neon-pink/40 hover:shadow-[0_0_25px_rgba(255,43,214,0.3)]"
              >
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink/25 to-neon-cyan/25">
                  {s.icon}
                </div>
                <h3 className="text-base font-bold text-white sm:text-lg">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-white/65">{s.desc}</p>
                <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neon-pink/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cal.com consultoría */}
      <section id="consultoria" className="scroll-mt-10 px-5 py-12">
        <div className="mx-auto max-w-xl">
          <SectionTitle kicker="Agenda">
            Reserva 30 min conmigo
          </SectionTitle>
          <CalEmbed />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 pb-10 pt-8 text-center">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} {site.name} · Hecho con IA y mucho neon
        </p>
      </footer>
    </main>
  );
}
