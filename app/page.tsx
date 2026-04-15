import { MessageCircle } from "lucide-react";
import NeonBackground from "@/components/NeonBackground";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import CalEmbed from "@/components/CalEmbed";
import SectionTitle from "@/components/SectionTitle";
import DynamicLinkCard from "@/components/DynamicLinkCard";
import { getSettings, getLinks, whatsappUrlFrom } from "@/lib/data";

export const revalidate = 60;

export default async function Page() {
  const [settings, links] = await Promise.all([getSettings(), getLinks()]);
  const whatsappUrl = whatsappUrlFrom(settings);

  return (
    <main className="relative min-h-screen">
      <NeonBackground />

      <Hero
        name={settings.name}
        role={settings.role}
        tagline={settings.tagline}
        subtagline={settings.subtagline}
        avatarUrl={settings.avatar_url || undefined}
      />

      <Marquee />

      {/* Árbol de links dinámico */}
      <section className="px-5 py-10">
        <div className="mx-auto w-full max-w-xl space-y-3">
          {/* CTA WhatsApp siempre visible arriba, con enlace calculado dinámicamente */}
          <DynamicLinkCard
            index={0}
            item={{
              id: "whatsapp",
              title: "Escríbeme por WhatsApp",
              subtitle: "Mensaje directo · respuesta rápida",
              url: whatsappUrl,
              icon_name: "MessageCircle",
              icon_url: null,
              accent: "green",
              external: true,
              position: 0,
              visible: true,
            }}
          />
          <p className="px-2 text-center text-[10px] uppercase tracking-wider text-white/35">
            Al escribirme aceptas la{" "}
            <a
              href="/privacidad"
              className="text-neon-cyan underline underline-offset-2 hover:text-white"
            >
              política de datos
            </a>
          </p>

          {/* Links del árbol editables desde /estudio */}
          {links
            .filter((l) => !/wa\.me|whatsapp/i.test(l.url))
            .map((item, i) => (
              <DynamicLinkCard key={item.id} item={item} index={i + 1} />
            ))}
        </div>
      </section>

      {/* Servicios */}
      <section id="clases" className="px-5 py-12">
        <div className="mx-auto max-w-xl">
          <SectionTitle kicker="Qué hago">Servicios con IA</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Consultoría estratégica",
                desc: "Diagnóstico de tu negocio y hoja de ruta con IA.",
              },
              {
                title: "Clases virtuales",
                desc: "Aprende a usar IA para acelerar tu emprendimiento.",
              },
              {
                title: "Automatizaciones",
                desc: "Agentes y workflows para ahorrarte horas cada semana.",
              },
              {
                title: "Mentoría continua",
                desc: "Acompañamiento mes a mes para crecer tu empresa.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-neon-pink/40 hover:shadow-[0_0_25px_rgba(255,43,214,0.3)]"
              >
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

      {/* Cal.com */}
      <section id="consultoria" className="scroll-mt-10 px-5 py-12">
        <div className="mx-auto max-w-xl">
          <SectionTitle kicker="Agenda">Reserva 30 min conmigo</SectionTitle>
          <CalEmbed
            namespace={settings.cal_namespace}
            link={settings.cal_link}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 pb-10 pt-8 text-center">
        <div className="mx-auto max-w-xl space-y-2">
          <div className="flex items-center justify-center gap-3 text-xs text-white/45">
            <a
              href="/privacidad"
              className="uppercase tracking-wider hover:text-neon-cyan"
            >
              Política de datos
            </a>
            <span className="text-white/15">·</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase tracking-wider hover:text-neon-cyan"
            >
              Contacto
            </a>
          </div>
          <p className="text-[11px] text-white/35">
            © {new Date().getFullYear()} {settings.name} · Hecho con IA y mucho
            neon
          </p>
        </div>
      </footer>
    </main>
  );
}
