"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

type Props = {
  namespace: string;
  link: string;
};

export default function CalEmbed({ namespace, link }: Props) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: { branding: { brandColor: "#ff2bd6" } },
      });
    })();
  }, [namespace]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan opacity-60 blur-lg" />
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/80 p-2 backdrop-blur-xl sm:p-3">
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
            data-cal-namespace={namespace}
            data-cal-link={link}
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(255,43,214,0.55)] transition-[background-position,transform] duration-500 hover:bg-[position:100%_0%] active:scale-95 sm:text-base"
          >
            Reservar mi consultoría
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
          <p className="mt-1 max-w-xs text-[10px] uppercase tracking-wider text-white/35">
            Al agendar aceptas la{" "}
            <a
              href="/privacidad"
              className="text-neon-cyan underline underline-offset-2 hover:text-white"
            >
              política de datos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
