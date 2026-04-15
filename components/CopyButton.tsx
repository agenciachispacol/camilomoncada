"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copiar"
      className="shrink-0 rounded-full border border-white/15 bg-white/5 p-2 text-white/70 backdrop-blur-md transition-all hover:border-neon-cyan/50 hover:text-neon-cyan active:scale-95"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
