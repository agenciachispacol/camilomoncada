"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  X,
  Copy,
  Check,
} from "lucide-react";
import RenderedContent from "@/components/RenderedContent";
import type { Prompt } from "@/lib/supabase";

export default function PromptAccordion({
  prompts,
}: {
  prompts: Prompt[];
}) {
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div className="space-y-2">
        {prompts.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            onClick={() => setSelected(p)}
            className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left backdrop-blur-md transition-all duration-300 hover:border-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] active:scale-[0.98] sm:px-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20">
              <Sparkles size={18} className="text-neon-cyan" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white sm:text-base">
                {p.title}
              </p>
              {p.tags && p.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-neon-cyan/80"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <ChevronRight
              size={18}
              className="shrink-0 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-neon-cyan"
            />
          </motion.button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
            onClick={() => setSelected(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm" />

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.3, type: "spring", damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-ink-900/95 p-5 shadow-[0_0_60px_rgba(255,43,214,0.25)] backdrop-blur-xl sm:p-6"
            >
              {/* Glow decoration */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-neon-pink/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-neon-cyan/20 blur-3xl" />

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/5 p-2 text-white/70 transition-all hover:border-neon-pink/50 hover:text-neon-pink"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>

              {/* Content */}
              <div className="relative">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-neon-cyan">
                  Prompt
                </p>
                <h2 className="pr-10 text-lg font-bold text-white neon-text-pink sm:text-xl">
                  {selected.title}
                </h2>

                {/* CTA Copy arriba para prompts largos */}
                <button
                  onClick={() => handleCopy(selected.body)}
                  className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(255,43,214,0.55)] transition-[background-position,transform] duration-500 hover:bg-[position:100%_0%] active:scale-[0.97]"
                >
                  {copied ? (
                    <>
                      <Check size={18} /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={18} /> Copiar Prompt
                    </>
                  )}
                </button>

                {selected.description && (
                  <div className="mt-3 text-sm text-white/75">
                    <RenderedContent html={selected.description} />
                  </div>
                )}

                {/* Prompt body */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-ink-950/80 p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                    <code>{selected.body}</code>
                  </pre>
                </div>

                {/* Tags */}
                {selected.tags && selected.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-neon-cyan"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
