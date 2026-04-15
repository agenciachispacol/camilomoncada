"use client";

export default function SaveButton({
  loading,
  label = "Guardar cambios",
  className = "",
}: {
  loading?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`relative w-full overflow-hidden rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,43,214,0.5)] transition-[background-position] duration-500 hover:bg-[position:100%_0%] active:scale-[0.98] disabled:opacity-60 ${className}`}
    >
      {loading ? "Guardando..." : label}
    </button>
  );
}
