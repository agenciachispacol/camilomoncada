"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import Field, { inputCls } from "../shared/Field";
import UploadField from "../shared/UploadField";
import SaveButton from "../shared/SaveButton";

type LinkItem = {
  id: string;
  title: string;
  subtitle: string | null;
  url: string;
  icon_name: string | null;
  icon_url: string | null;
  accent: "pink" | "cyan" | "purple" | "green" | "yellow";
  external: boolean;
  position: number;
  visible: boolean;
};

const ACCENTS: LinkItem["accent"][] = [
  "pink",
  "cyan",
  "purple",
  "green",
  "yellow",
];
const ACCENT_CLS: Record<LinkItem["accent"], string> = {
  pink: "from-neon-pink/40 to-neon-pink/10 border-neon-pink/40",
  cyan: "from-neon-cyan/40 to-neon-cyan/10 border-neon-cyan/40",
  purple: "from-neon-purple/40 to-neon-purple/10 border-neon-purple/40",
  green: "from-neon-green/30 to-neon-green/5 border-neon-green/40",
  yellow: "from-neon-yellow/30 to-neon-yellow/5 border-neon-yellow/40",
};

export default function LinksModule({ token }: { token: string }) {
  const [items, setItems] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<LinkItem> | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/links", {
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
  }, [token]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === id);
    if (idx < 0) return;
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[idx];
    const b = items[target];
    // swap positions
    await fetch("/api/links", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: a.id, data: { position: b.position } }),
    });
    await fetch("/api/links", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: b.id, data: { position: a.position } }),
    });
    fetchItems();
  };

  const toggleVisible = async (item: LinkItem) => {
    await fetch("/api/links", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: item.id,
        data: { visible: !item.visible },
      }),
    });
    fetchItems();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Borrar este link?")) return;
    await fetch("/api/links", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  const save = async (data: Partial<LinkItem>, id?: string) => {
    const res = await fetch("/api/links", {
      method: id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, data }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error al guardar");
    setEditing(null);
    fetchItems();
  };

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl border border-neon-pink/40 bg-neon-pink/10 p-3 text-center text-sm text-neon-pink">
          {error}
        </p>
      )}

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <LinkForm
              token={token}
              item={editing}
              onCancel={() => setEditing(null)}
              onSave={save}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              onClick={() => setEditing({})}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,43,214,0.5)] transition-[background-position] duration-500 hover:bg-[position:100%_0%] active:scale-[0.98]"
            >
              <Plus size={16} /> Nuevo link
            </button>

            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-white/55 backdrop-blur-md">
                Aún no hay links. Crea el primero.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`group flex items-center gap-3 rounded-2xl border bg-gradient-to-r ${ACCENT_CLS[item.accent]} p-3 backdrop-blur-md transition-all`}
                  >
                    {/* Icon preview */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-950/60">
                      {item.icon_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.icon_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-white/70">
                          {item.icon_name?.slice(0, 3) || "•"}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-bold ${item.visible ? "text-white" : "text-white/40 line-through"}`}
                      >
                        {item.title}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 truncate text-[11px] text-white/50 hover:text-neon-cyan"
                      >
                        <ExternalLink size={10} /> {item.url}
                      </a>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => move(item.id, -1)}
                        disabled={idx === 0}
                        className="rounded-lg p-1.5 text-white/60 hover:text-white disabled:opacity-20"
                        aria-label="Subir"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => move(item.id, 1)}
                        disabled={idx === items.length - 1}
                        className="rounded-lg p-1.5 text-white/60 hover:text-white disabled:opacity-20"
                        aria-label="Bajar"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => toggleVisible(item)}
                        className="rounded-lg p-1.5 text-white/60 hover:text-neon-cyan"
                        aria-label="Visibilidad"
                      >
                        {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => setEditing(item)}
                        className="rounded-lg p-1.5 text-white/60 hover:text-white"
                        aria-label="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="rounded-lg p-1.5 text-white/60 hover:text-neon-pink"
                        aria-label="Borrar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LinkForm({
  token,
  item,
  onCancel,
  onSave,
}: {
  token: string;
  item: Partial<LinkItem>;
  onCancel: () => void;
  onSave: (data: Partial<LinkItem>, id?: string) => Promise<void>;
}) {
  const isEdit = Boolean(item.id);
  const [title, setTitle] = useState(item.title ?? "");
  const [subtitle, setSubtitle] = useState(item.subtitle ?? "");
  const [url, setUrl] = useState(item.url ?? "");
  const [iconName, setIconName] = useState(item.icon_name ?? "");
  const [iconUrl, setIconUrl] = useState(item.icon_url ?? "");
  const [accent, setAccent] = useState<LinkItem["accent"]>(
    item.accent ?? "pink",
  );
  const [external, setExternal] = useState(item.external ?? true);
  const [visible, setVisible] = useState(item.visible ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(
        {
          title,
          subtitle,
          url,
          icon_name: iconName || null,
          icon_url: iconUrl || null,
          accent,
          external,
          visible,
        },
        item.id,
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-6"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-bold neon-text-pink">
          {isEdit ? "Editar link" : "Nuevo link"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/15 bg-white/5 p-2 text-white/70 hover:text-neon-pink"
        >
          <X size={16} />
        </button>
      </div>

      <Field label="Título">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
        />
      </Field>
      <Field label="Subtítulo">
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className={inputCls}
          placeholder="opcional"
        />
      </Field>
      <Field label="URL">
        <input
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={inputCls}
          placeholder="https://... o /ruta o #ancla"
        />
      </Field>

      <UploadField
        value={iconUrl ?? ""}
        onChange={setIconUrl}
        token={token}
        folder="icons"
        label="Icono personalizado (opcional)"
        help="Si subes uno, anula el ícono por nombre"
      />

      <Field
        label="O nombre de ícono Lucide"
        hint="Ej: MessageCircle, Instagram, Sparkles, BookOpen"
      >
        <input
          value={iconName ?? ""}
          onChange={(e) => setIconName(e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Color de acento">
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAccent(a)}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                accent === a
                  ? `bg-gradient-to-r ${ACCENT_CLS[a]} text-white`
                  : "border-white/10 bg-white/5 text-white/55 hover:text-white"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Field>

      <div className="flex flex-wrap gap-3">
        <Toggle
          label="Visible en la landing"
          checked={visible}
          onChange={setVisible}
        />
        <Toggle
          label="Abrir en nueva pestaña"
          checked={external}
          onChange={setExternal}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white/70 hover:text-white"
        >
          Cancelar
        </button>
        <div className="flex-1">
          <SaveButton
            loading={saving}
            label={isEdit ? "Guardar" : "Crear link"}
          />
        </div>
      </div>

      {error && <p className="text-center text-sm text-neon-pink">{error}</p>}
    </form>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/75 transition-all hover:border-neon-cyan/40 hover:text-white">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`h-3 w-6 rounded-full transition-all ${checked ? "bg-gradient-to-r from-neon-pink to-neon-cyan shadow-[0_0_10px_rgba(255,43,214,0.5)]" : "bg-white/20"}`}
      >
        <span
          className={`block h-3 w-3 rounded-full bg-white transition-all ${checked ? "translate-x-3" : ""}`}
        />
      </span>
      {label}
    </label>
  );
}
