"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
};

export default function NeonButton({
  href,
  onClick,
  children,
  variant = "primary",
  external,
  className = "",
}: Props) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 sm:text-base";

  const styles =
    variant === "primary"
      ? "text-white bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] shadow-[0_0_30px_rgba(255,43,214,0.55)] hover:bg-[position:100%_0%]"
      : "text-white border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10";

  const content = (
    <motion.span
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${styles} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -z-0 animate-gradient-shift rounded-full blur-md opacity-70 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan" />
      )}
    </motion.span>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="inline-block"
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block">
      {content}
    </button>
  );
}
