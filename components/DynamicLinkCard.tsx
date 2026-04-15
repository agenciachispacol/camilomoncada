"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as Icons from "lucide-react";
import type { LinkItem } from "@/lib/data";

const accents: Record<string, string> = {
  pink: "shadow-[0_0_25px_rgba(255,43,214,0.35)] hover:shadow-[0_0_35px_rgba(255,43,214,0.6)]",
  cyan: "shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)]",
  purple:
    "shadow-[0_0_25px_rgba(176,38,255,0.35)] hover:shadow-[0_0_35px_rgba(176,38,255,0.6)]",
  green:
    "shadow-[0_0_25px_rgba(57,255,20,0.35)] hover:shadow-[0_0_35px_rgba(57,255,20,0.6)]",
  yellow:
    "shadow-[0_0_25px_rgba(255,245,3,0.35)] hover:shadow-[0_0_35px_rgba(255,245,3,0.6)]",
};

// Icono TikTok manual (Lucide no lo trae)
function TikTokIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.6 6.7a5.3 5.3 0 0 1-3.2-1.2 5.3 5.3 0 0 1-2-3.5h-3.3v13.5a2.6 2.6 0 1 1-1.9-2.5V9.5a5.9 5.9 0 1 0 5.2 5.9V9.2a8.6 8.6 0 0 0 5.2 1.7V7.5c-.1-.2 0-.5 0-.8z" />
    </svg>
  );
}

function renderIcon(item: LinkItem) {
  if (item.icon_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={item.icon_url}
        alt=""
        className="h-6 w-6 object-contain"
        loading="lazy"
      />
    );
  }
  if (!item.icon_name) return <span className="text-lg">✦</span>;
  if (item.icon_name.toLowerCase() === "tiktok") return <TikTokIcon />;
  const Ico = (Icons as any)[item.icon_name];
  if (Ico) return <Ico size={22} />;
  return <span className="text-lg">✦</span>;
}

export default function DynamicLinkCard({
  item,
  index,
}: {
  item: LinkItem;
  index: number;
}) {
  const Comp: any = item.external ? "a" : Link;
  const extraProps = item.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -3 }}
      className="w-full"
    >
      <Comp
        href={item.url}
        {...extraProps}
        className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-md transition-all duration-300 ${accents[item.accent] ?? accents.pink}`}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 text-white">
          {renderIcon(item)}
        </div>
        <div className="relative min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight text-white sm:text-base">
            {item.title}
          </p>
          {item.subtitle && (
            <p className="truncate text-xs text-white/60 sm:text-sm">
              {item.subtitle}
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
