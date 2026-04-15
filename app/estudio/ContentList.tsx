"use client";

import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import type { Article, Prompt } from "@/lib/supabase";

type Kind = "article" | "prompt";
type ItemVisible = (Article | Prompt) & { visible?: boolean };

export default function ContentList({
  kind,
  items,
  loading,
  onEdit,
  onDelete,
  onToggleVisible,
}: {
  kind: Kind;
  items: (Article | Prompt)[];
  loading: boolean;
  onEdit: (item: Article | Prompt) => void;
  onDelete: (id: string) => void;
  onToggleVisible: (item: ItemVisible) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-white/55 backdrop-blur-md">
        Aún no hay {kind === "article" ? "artículos" : "prompts"}. Crea el
        primero con el botón de arriba.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((raw) => {
        const item = raw as ItemVisible;
        const a = item as Article;
        const p = item as Prompt;
        const isArticle = kind === "article";
        const visible = item.visible !== false;
        return (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md transition-all hover:border-neon-pink/40 hover:shadow-[0_0_20px_rgba(255,43,214,0.25)] sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3
                  className={`truncate text-base font-bold sm:text-lg ${visible ? "text-white" : "text-white/40 line-through"}`}
                >
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/55">
                  {isArticle
                    ? a.excerpt ||
                      (a.content || "").replace(/<[^>]+>/g, "").slice(0, 120)
                    : p.description ||
                      (p.body || "").slice(0, 120)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-white/40">
                  <span className="text-neon-cyan">
                    {new Date(item.created_at).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {!visible && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/50">
                      oculto
                    </span>
                  )}
                  {isArticle && a.slug && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                      /{a.slug}
                    </span>
                  )}
                  {!isArticle &&
                    p.tags?.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-2 py-0.5 text-neon-cyan"
                      >
                        #{t}
                      </span>
                    ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => onToggleVisible(item)}
                  aria-label="Visibilidad"
                  className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 backdrop-blur-md transition-all hover:border-neon-cyan/50 hover:text-neon-cyan active:scale-95"
                >
                  {visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => onEdit(item)}
                  aria-label="Editar"
                  className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 backdrop-blur-md transition-all hover:border-neon-cyan/50 hover:text-neon-cyan active:scale-95"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  aria-label="Borrar"
                  className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 backdrop-blur-md transition-all hover:border-neon-pink/60 hover:text-neon-pink active:scale-95"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
