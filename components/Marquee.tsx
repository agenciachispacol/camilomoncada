"use client";

const items = [
  "✦ CONSULTORÍA GRATUITA",
  "✦ IA PARA EMPRENDEDORES",
  "✦ CLASES VIRTUALES",
  "✦ AUTOMATIZACIONES",
  "✦ PROMPTS & ARTÍCULOS",
  "✦ CRECE TU EMPRESA",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-gradient-to-r from-neon-pink/10 via-neon-purple/10 to-neon-cyan/10 py-3">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {row.map((t, i) => (
          <span
            key={i}
            className="mx-6 text-xs font-bold uppercase tracking-[0.2em] text-white/80 sm:text-sm"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
