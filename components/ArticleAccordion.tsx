"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, BookOpen, ArrowRight } from "lucide-react";
import type { Article } from "@/lib/supabase";

export default function ArticleAccordion({
  articles,
}: {
  articles: Article[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-2">
      {articles.map((a, i) => {
        const isOpen = openId === a.id;
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className={`overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300 ${
              isOpen
                ? "border-neon-pink/40 bg-white/[0.06] shadow-[0_0_25px_rgba(255,43,214,0.25)]"
                : "border-white/10 bg-white/[0.04] hover:border-white/20"
            }`}
          >
            {/* Header (always visible) */}
            <button
              onClick={() => toggle(a.id)}
              className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20">
                <BookOpen size={18} className="text-neon-pink" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold sm:text-base ${
                    isOpen ? "neon-text-pink" : "text-white"
                  }`}
                >
                  {a.title}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
                  {new Date(a.created_at).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <ChevronDown
                size={18}
                className={`shrink-0 text-white/40 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-neon-pink" : ""
                }`}
              />
            </button>

            {/* Expanded content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 px-4 pb-5 pt-4 sm:px-5">
                    {a.cover_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.cover_url}
                        alt={a.title}
                        className="mb-4 h-40 w-full rounded-xl border border-white/10 object-cover shadow-[0_0_20px_rgba(255,43,214,0.2)]"
                      />
                    )}
                    {a.excerpt && (
                      <p className="text-sm leading-relaxed text-white/70">
                        {a.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/articulos/${a.slug}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,43,214,0.45)] transition-[background-position,transform] duration-500 hover:bg-[position:100%_0%] active:scale-[0.97]"
                    >
                      Leer artículo completo
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
