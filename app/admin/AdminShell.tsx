"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Lock, ShieldCheck } from "lucide-react";
import AdminDashboard from "./AdminDashboard";

const LS_KEY = "camilo_admin_token";

export default function AdminShell() {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setToken(saved);
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/content?kind=article", {
        headers: { "x-admin-token": input },
      });
      if (res.status === 401) throw new Error("Contraseña incorrecta");
      if (!res.ok) throw new Error("Error de conexión");
      localStorage.setItem(LS_KEY, input);
      setToken(input);
      setInput("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(LS_KEY);
    setToken(null);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {token ? (
        <motion.div
          key="dash"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink/25 to-neon-cyan/25 text-neon-green">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon-cyan">
                  Panel privado
                </p>
                <h1 className="text-xl font-bold sm:text-2xl neon-text-pink">
                  Dashboard
                </h1>
              </div>
            </div>
            <button
              onClick={logout}
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 backdrop-blur-md transition-all hover:border-neon-pink/50 hover:text-white"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
          <AdminDashboard token={token} onInvalid={logout} />
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-md"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-pink/30 via-neon-purple/30 to-neon-cyan/30 text-white shadow-[0_0_30px_rgba(255,43,214,0.4)]"
            >
              <Lock size={26} />
            </motion.div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-neon-cyan">
              Acceso restringido
            </p>
            <h1 className="mt-1 text-h2 neon-text-pink">Panel secreto</h1>
            <p className="mt-2 text-sm text-white/60">
              Ingresa tu contraseña para gestionar artículos y prompts.
            </p>
          </div>

          <form
            onSubmit={login}
            className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-6"
          >
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                Contraseña
              </span>
              <input
                type="password"
                required
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-neon-cyan/60 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={loading || !input}
              className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-[length:200%_100%] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(255,43,214,0.5)] transition-[background-position] duration-500 hover:bg-[position:100%_0%] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>
            {error && (
              <p className="text-center text-sm text-neon-pink">{error}</p>
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
