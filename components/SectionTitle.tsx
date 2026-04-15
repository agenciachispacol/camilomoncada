"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function SectionTitle({
  kicker,
  children,
}: {
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6 text-center">
      {kicker && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-neon-cyan sm:text-xs"
        >
          {kicker}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="text-h2 neon-text-pink"
      >
        {children}
      </motion.h2>
    </div>
  );
}
