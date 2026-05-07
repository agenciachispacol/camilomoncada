"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Plus } from "lucide-react";

type Props = {
  images: string[];
  onChange: (urls: string[]) => void;
  token: string;
  folder?: string;
};

export default function MultiImageUpload({
  images,
  onChange,
  token,
  folder = "prompts",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error subiendo");
      onChange([...images, json.url]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
        Imágenes / ingredientes
      </span>
      <p className="mb-3 text-[11px] text-white/40">
        Sube fotos de referencia que complementen el prompt. Se muestran como galería.
      </p>

      {/* Grid de imágenes */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((url, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-ink-950/60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-ink-950/80 p-1 text-white/80 opacity-0 transition-opacity group-hover:opacity-100 hover:text-neon-pink"
              aria-label="Quitar"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Botón agregar */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.03] text-white/40 transition-all hover:border-neon-cyan/50 hover:text-neon-cyan disabled:opacity-50"
        >
          {uploading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-neon-cyan" />
          ) : (
            <Plus size={24} />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-[11px] text-neon-pink">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
    </div>
  );
}
