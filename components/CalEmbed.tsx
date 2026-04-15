"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { site } from "@/lib/site";

/**
 * Embed de Cal.com inline. Mobile first:
 * - usa layout mobile automáticamente
 * - altura con clamp para no romper en pantallas pequeñas
 */
export default function CalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: site.cal.namespace });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: {
          branding: { brandColor: "#ff2bd6" },
        },
      });
    })();
  }, []);

  return (
    <div className="relative">
      {/* Borde neon animado */}
      <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan opacity-60 blur-lg" />
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/80 p-2 backdrop-blur-xl sm:p-3">
        {/* Usamos iframe estilo Cal via button inline para móvil */}
        {/* El popup nativo funciona mejor mobile first que el inline pesado */}
        <div className="flex flex-col items-center gap-4 px-4 py-6 text-center sm:py-8">
          <p className="text-xs uppercase tracking-[0.3em] text-neon-cyan">
            Agenda gratuita · 30 min
          </p>
          <h3 className="text-h2 neon-text-pink">Consultoría 1 a 1</h3>
          <p className="max-w-md text-lead text-white/70">
            Bloquea 30 minutos conmigo y diseñemos juntos cómo aplicar IA en tu
            emprendimiento. Sin costo, sin compromiso.
          </p>
          <button
            data-cal-namespace={site.cal.namespace}
            data-cal-link={site.cal.link}
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(255,43,214,0.55)] transition-[background-position,transform] duration-500 hover:bg-[position:100%_0%] active:scale-95 sm:text-base"
          >
            Reservar mi consultoría
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
