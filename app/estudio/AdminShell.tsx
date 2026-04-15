"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Lock, ShieldCheck, Mail } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import AdminDashboard from "./AdminDashboard";

export default function AdminShell() {
  const supabase = getSupabaseBrowser();

  const [session, setSession] = useState<Session | null>(null);
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga sesión inicial y se suscribe a cambios
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setMounted(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s),
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos"
          : error.message,
      );
      return;
    }
    setPassword("");
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {session ? (
        <motion.div
          key="dash"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon-pink/25 to-neon-cyan/25 text-neon-green">
                <ShieldCheck size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon-cyan">
                  Panel privado
                </p>
                <h1 className="truncate text-xl font-bold neon-text-pink sm:text-2xl">
                  {session.user.email}
                </h1>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 backdrop-blur-md transition-all hover:border-neon-pink/50 hover:text-white"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
          <AdminDashboard
            session={session}
            onInvalid={logout}
          />
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
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-pink/30 via-neon-purple/30 to-neon-cyan/30 text-white shadow-[0_0_30px_rgba(255,43,214,0.4)]"
            >
              <Lock size={26} />
            </motion.div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-neon-cyan">
              Acceso restringido
            </p>
            <h1 className="mt-1 text-h2 neon-text-pink">Panel secreto</h1>
            <p className="mt-2 text-sm text-white/60">
              Inicia sesión para gestionar artículos y prompts.
            </p>
          </div>

          <form
            onSubmit={login}
            className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-6"
          >
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                Email
              </span>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-white/10 bg-ink-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 transition-colors focus:border-neon-cyan/60 focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                Contraseña
              </span>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-ink-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 transition-colors focus:border-neon-cyan/60 focus:outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading || !email || !password}
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
