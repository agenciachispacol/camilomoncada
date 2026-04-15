"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  token: string;
  folder?: string;
  label?: string;
  help?: string;
  aspect?: "square" | "wide";
};

export default function UploadField({
  value,
  onChange,
  token,
  folder = "uploads",
  label = "Imagen",
  help,
  aspect = "square",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async (file: File) => {
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
      onChange(json.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-ink-950/60 ${
            aspect === "square" ? "h-20 w-20" : "h-20 w-32"
          }`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={24} className="text-white/25" />
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded-full bg-ink-950/80 p-1 text-white/80 hover:text-neon-pink"
              aria-label="Quitar"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/80 backdrop-blur-md transition-all hover:border-neon-cyan/50 hover:text-white disabled:opacity-50"
          >
            <Upload size={14} />
            {uploading ? "Subiendo..." : value ? "Reemplazar" : "Subir imagen"}
          </button>
          {help && <p className="text-[10px] text-white/40">{help}</p>}
          {error && <p className="text-[11px] text-neon-pink">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
      />
    </div>
  );
}
