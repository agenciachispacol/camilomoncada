import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-neon-cyan/60 focus:outline-none";

export default function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
        {label}
      </span>
      {children}
      {hint && <p className="mt-1 text-[11px] text-white/40">{hint}</p>}
    </label>
  );
}
