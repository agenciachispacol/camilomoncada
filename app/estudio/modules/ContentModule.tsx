"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Plus } from "lucide-react";
import type { Article, Prompt } from "@/lib/supabase";
import ContentList from "../ContentList";
import ContentForm from "../ContentForm";

type Kind = "article" | "prompt";
type Item = Article | Prompt;

export default function ContentModule({ token }: { token: string }) {
  const [tab, setTab] = useState<Kind>("article");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(
    async (kind: Kind) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/content?kind=${kind}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Error");
        setItems(json.items ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    fetchItems(tab);
    setEditing(null);
  }, [tab, fetchItems]);

  const handleSave = async (data: any, id?: string) => {
    const res = await fetch("/api/content", {
      method: id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ kind: tab, id, data }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error al guardar");
    setEditing(null);
    await fetchItems(tab);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrarlo? No se puede deshacer."))
      return;
    const res = await fetch("/api/content", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ kind: tab, id }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Error al borrar");
      return;
    }
    await fetchItems(tab);
  };

  const handleToggleVisible = async (item: any) => {
    await fetch("/api/content", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        kind: tab,
        id: item.id,
        data: { visible: !(item.visible !== false) },
      }),
    });
    fetchItems(tab);
  };

  return (
    <div>
      <div className="mb-6 flex gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
        {(
          [
            {
              id: "article",
              label: "Artículos",
              icon: <BookOpen size={16} />,
            },
            {
              id: "prompt",
              label: "Prompts",
              icon: <Sparkles size={16} />,
            },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all sm:text-sm ${
              tab === t.id ? "text-white" : "text-white/55 hover:text-white"
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="content-tab-bg"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan shadow-[0_0_20px_rgba(255,43,214,0.45)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {t.icon}
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-neon-pink/40 bg-neon-pink/10 p-3 text-center text-sm text-neon-pink">
          {error}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={editing ? "form" : "list"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {editing !== null ? (
            <ContentForm
              kind={tab}
              item={editing}
              token={token}
              onCancel={() => setEditing(null)}
              onSave={handleSave}
            />
          ) : (
            <>
              <button
                onClick={() => setEditing({} as Item)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,43,214,0.5)] transition-[background-position] duration-500 hover:bg-[position:100%_0%] active:scale-[0.98]"
              >
                <Plus size={16} />
                Nuevo {tab === "article" ? "artículo" : "prompt"}
              </button>
              <ContentList
                kind={tab}
                items={items}
                loading={loading}
                onEdit={(item) => setEditing(item)}
                onDelete={handleDelete}
                onToggleVisible={handleToggleVisible}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
