"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Article, Prompt } from "@/lib/supabase";

type Kind = "article" | "prompt";
type Item = Partial<Article & Prompt>;

export default function ContentForm({
  kind,
  item,
  onSave,
  onCancel,
}: {
  kind: Kind;
  item: Item;
  onSave: (data: any, id?: string) => Promise<void>;
  onCancel: () => void;
}) {
  const isEdit = Boolean(item?.id);

  // shared
  const [title, setTitle] = useState(item.title ?? "");
  // article
  const [slug, setSlug] = useState(item.slug ?? "");
  const [excerpt, setExcerpt] = useState(item.excerpt ?? "");
  const [content, setContent] = useState(item.content ?? "");
  const [coverUrl, setCoverUrl] = useState(item.cover_url ?? "");
  // prompt
  const [description, setDescription] = useState(item.description ?? "");
  const [body, setBody] = useState(item.body ?? "");
  const [tags, setTags] = useState((item.tags ?? []).join(", "));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data =
        kind === "article"
          ? {
              title,
              slug,
              excerpt,
              content,
              cover_url: coverUrl,
            }
          : {
              title,
              description,
              body,
              tags: tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            };
      await onSave(data, item.id);
    } catch (err: any) {
      setError(err.message ?? "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold sm:text-xl neon-text-pink">
          {isEdit ? "Editar" : "Nuevo"} {kind === "article" ? "artículo" : "prompt"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar"
          className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 transition-all hover:border-neon-pink/50 hover:text-neon-pink"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <Field label="Título">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </Field>

        {kind === "article" ? (
          <>
            <Field label="Slug (opcional)">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="se genera desde el título si lo dejas vacío"
                className={inputCls}
              />
            </Field>
            <Field label="Extracto">
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className={`${inputCls} min-h-[80px]`}
              />
            </Field>
            <Field label="Contenido">
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`${inputCls} min-h-[260px] font-mono text-sm`}
              />
            </Field>
            <Field label="URL de portada (opcional)">
              <input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className={inputCls}
                placeholder="https://..."
              />
            </Field>
          </>
        ) : (
          <>
            <Field label="Descripción corta">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Prompt">
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={`${inputCls} min-h-[260px] font-mono text-sm`}
                placeholder="Actúa como..."
              />
            </Field>
            <Field label="Tags (separados por coma)">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="marketing, copywriting, ventas"
                className={inputCls}
              />
            </Field>
          </>
        )}

        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white/70 transition-all hover:text-white sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="relative flex-1 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,43,214,0.5)] transition-[background-position] duration-500 hover:bg-[position:100%_0%] active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Publicar"}
          </button>
        </div>

        {error && (
          <p className="text-center text-sm text-neon-pink">{error}</p>
        )}
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-neon-cyan/60 focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
        {label}
      </span>
      {children}
    </label>
  );
}
