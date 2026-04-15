"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Kind = "article" | "prompt";

export default function AdminForm() {
  const [token, setToken] = useState("");
  const [kind, setKind] = useState<Kind>("article");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // Article fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  // Prompt fields
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const payload =
      kind === "article"
        ? {
            kind,
            data: {
              title,
              slug:
                slug ||
                title
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, ""),
              excerpt,
              content,
              cover_url: coverUrl || null,
            },
          }
        : {
            kind,
            data: {
              title,
              description,
              body,
              tags: tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            },
          };

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setMessage({ type: "ok", text: "¡Publicado correctamente!" });
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setCoverUrl("");
      setDescription("");
      setBody("");
      setTags("");
    } catch (err: any) {
      setMessage({ type: "err", text: err.message ?? "Error desconocido" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-6"
    >
      <Field label="Token de admin">
        <input
          type="password"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className={inputCls}
          placeholder="ADMIN_TOKEN"
        />
      </Field>

      <Field label="Tipo">
        <div className="flex gap-2">
          {(["article", "prompt"] as Kind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-all ${
                kind === k
                  ? "border-neon-pink/60 bg-neon-pink/20 text-white shadow-[0_0_15px_rgba(255,43,214,0.4)]"
                  : "border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {k === "article" ? "Artículo" : "Prompt"}
            </button>
          ))}
        </div>
      </Field>

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
          <Field label="Slug (opcional, se genera)">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputCls}
              placeholder="mi-articulo-sobre-ia"
            />
          </Field>
          <Field label="Extracto">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={`${inputCls} min-h-[80px]`}
            />
          </Field>
          <Field label="Contenido (markdown o texto)">
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`${inputCls} min-h-[220px] font-mono text-sm`}
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
              className={`${inputCls} min-h-[220px] font-mono text-sm`}
              placeholder="Actúa como..."
            />
          </Field>
          <Field label="Tags (separados por coma)">
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputCls}
              placeholder="marketing, copywriting, ventas"
            />
          </Field>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="relative w-full rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,43,214,0.5)] transition-[background-position] duration-500 hover:bg-[position:100%_0%] active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Publicando..." : "Publicar"}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            message.type === "ok" ? "text-neon-green" : "text-neon-pink"
          }`}
        >
          {message.text}
        </p>
      )}
    </motion.form>
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
