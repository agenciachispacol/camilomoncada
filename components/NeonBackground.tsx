"use client";

import { motion } from "framer-motion";

/**
 * Fondo neon animado: grid + blobs gradientes + partículas sutiles.
 * Pensado mobile first: usa transform/opacity (GPU), sin layout shifts.
 */
export default function NeonBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Gradiente base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(176,38,255,0.25),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(0,240,255,0.18),_transparent_60%)]" />

      {/* Grid neon */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Blobs animados */}
      <motion.div
        className="blob bg-neon-pink"
        style={{ width: 280, height: 280, top: "-6%", left: "-10%" }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, 30, -10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob bg-neon-cyan"
        style={{ width: 320, height: 320, top: "30%", right: "-15%" }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob bg-neon-purple"
        style={{ width: 260, height: 260, bottom: "-8%", left: "20%" }}
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.05, 0.92, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Scanline sutil */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 3px)",
        }}
      />
    </div>
  );
}
