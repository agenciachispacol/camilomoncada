"use client";

import { motion } from "framer-motion";

type Props = {
  name: string;
  initials?: string;
  url?: string;
};

/**
 * Avatar con anillo cónico rotativo + halo pulsante.
 * Mobile first: tamaño por defecto 128px, escala con sm/md.
 * Si `url` está vacío, muestra iniciales con efecto neon.
 */
export default function Avatar({ name, initials, url }: Props) {
  const fallback =
    initials ||
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="relative mx-auto flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40 md:h-48 md:w-48">
      {/* Anillo rotativo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #ff2bd6, #b026ff, #00f0ff, #39ff14, #ff2bd6)",
          padding: 3,
          filter: "drop-shadow(0 0 18px rgba(255,43,214,0.5))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <div className="h-full w-full rounded-full bg-ink-950" />
      </motion.div>

      {/* Halo pulsante */}
      <motion.div
        className="absolute inset-[-10px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,43,214,0.35), transparent 70%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Foto o iniciales */}
      <div className="relative z-10 flex h-[86%] w-[86%] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-ink-800 to-ink-950">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-4xl font-black tracking-tight neon-text-pink sm:text-5xl md:text-6xl">
            {fallback}
          </span>
        )}
      </div>
    </div>
  );
}
