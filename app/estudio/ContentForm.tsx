"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Article, Prompt } from "@/lib/supabase";
import NeonEditor from "@/components/NeonEditor";
import Field, { inputCls } from "./shared/Field";
import UploadField from "./shared/UploadField";
import SaveButton from "./shared/SaveButton";

type Kind = "article" | "prompt";
type Item = Partial<Article & Prompt & { visible: boolean }>;

export default function ContentForm({
  kind,
  item,
  onSave,
  onCancel,
  token,
}: {
  kind: Kind;
  item: Item;
  onSave: (data: any, id?: string) => Promise<void>;
  onCancel: () => void;
  token: string;
}) {
  const isEdit = Boolean(item?.id);

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
  // shared
  const [visible, setVisible] = useState(item.visible ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Uploader para imágenes dentro del editor
  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", kind === "article" ? "articles" : "prompts");
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error subiendo");
    return json.url;
  };

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
              visible,
            }
          : {
              title,
              description,
              body,
              tags: tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
              visible,
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
        <h2 className="text-lg font-bold neon-text-pink sm:text-xl">
          {isEdit ? "Editar" : "Nuevo"}{" "}
          {kind === "article" ? "artículo" : "prompt"}
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
            <UploadField
              value={coverUrl ?? ""}
              onChange={setCoverUrl}
              token={token}
              folder="articles"
              label="Portada"
              aspect="wide"
            />
            <div>
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                Contenido (editor enriquecido)
              </span>
              <NeonEditor
                value={content}
                onChange={setContent}
                placeholder="Escribe tu artículo..."
                onImageUpload={uploadImage}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                Descripción (editor enriquecido)
              </span>
              <NeonEditor
                value={description}
                onChange={setDescription}
                placeholder="Explica para qué sirve este prompt..."
                onImageUpload={uploadImage}
              />
            </div>
            <Field label="Prompt (texto plano para copiar)">
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={`${inputCls} min-h-[220px] font-mono text-sm`}
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

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-4 w-4 accent-neon-pink"
          />
          <span className="text-sm text-white/80">
            Visible públicamente
            <span className="ml-2 text-xs text-white/40">
              {visible ? "aparece en la landing" : "oculto"}
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white/70 transition-all hover:text-white"
          >
            Cancelar
          </button>
          <div className="flex-1">
            <SaveButton
              loading={saving}
              label={isEdit ? "Guardar cambios" : "Publicar"}
            />
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-neon-pink">{error}</p>
        )}
      </div>
    </form>
  );
}
