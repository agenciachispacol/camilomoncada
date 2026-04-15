"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  external?: boolean;
  accent?: "pink" | "cyan" | "purple" | "green";
  delay?: number;
};

const accents: Record<string, string> = {
  pink: "shadow-[0_0_25px_rgba(255,43,214,0.35)] hover:shadow-[0_0_35px_rgba(255,43,214,0.6)]",
  cyan: "shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)]",
  purple:
    "shadow-[0_0_25px_rgba(176,38,255,0.35)] hover:shadow-[0_0_35px_rgba(176,38,255,0.6)]",
  green:
    "shadow-[0_0_25px_rgba(57,255,20,0.35)] hover:shadow-[0_0_35px_rgba(57,255,20,0.6)]",
};

export default function LinkCard({
  href,
  icon,
  title,
  subtitle,
  external,
  accent = "pink",
  delay = 0,
}: Props) {
  const Comp: any = external ? "a" : Link;
  const extraProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -3 }}
      className="w-full"
    >
      <Comp
        href={href}
        {...extraProps}
        className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-md transition-all duration-300 ${accents[accent]}`}
      >
        {/* Shine al hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 text-white">
          {icon}
        </div>

        <div className="relative min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight text-white sm:text-base">
            {title}
          </p>
          {subtitle && (
            <p className="truncate text-xs text-white/60 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>

        <span className="relative text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
          →
        </span>
      </Comp>
    </motion.div>
  );
}
