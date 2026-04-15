"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Link2,
  MessageSquare,
  FileText,
  Shield,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import ProfileModule from "./modules/ProfileModule";
import LinksModule from "./modules/LinksModule";
import ContactModule from "./modules/ContactModule";
import ContentModule from "./modules/ContentModule";
import LegalModule from "./modules/LegalModule";

type ModuleId = "profile" | "links" | "contact" | "content" | "legal";

const MODULES: {
  id: ModuleId;
  label: string;
  kicker: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "profile",
    label: "Perfil",
    kicker: "Quién eres",
    icon: <User size={18} />,
  },
  {
    id: "links",
    label: "Links",
    kicker: "Árbol de enlaces",
    icon: <Link2 size={18} />,
  },
  {
    id: "contact",
    label: "Contacto",
    kicker: "WhatsApp · Cal",
    icon: <MessageSquare size={18} />,
  },
  {
    id: "content",
    label: "Contenido",
    kicker: "Artículos · Prompts",
    icon: <FileText size={18} />,
  },
  {
    id: "legal",
    label: "Legal",
    kicker: "Política de datos",
    icon: <Shield size={18} />,
  },
];

export default function AdminDashboard({
  session,
}: {
  session: Session;
  onInvalid: () => void;
}) {
  const [active, setActive] = useState<ModuleId>("profile");
  const token = session.access_token;

  return (
    <div>
      {/* Nav de módulos · scroll horizontal en mobile, grid en desktop */}
      <div className="mb-6 -mx-1 overflow-x-auto pb-2">
        <div className="flex min-w-max gap-2 px-1">
          {MODULES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`group relative flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                active === m.id
                  ? "border-neon-pink/50 bg-gradient-to-br from-neon-pink/15 via-neon-purple/15 to-neon-cyan/15 shadow-[0_0_25px_rgba(255,43,214,0.35)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  active === m.id
                    ? "bg-gradient-to-br from-neon-pink/40 to-neon-cyan/40 text-white"
                    : "bg-white/5 text-white/60 group-hover:text-white"
                }`}
              >
                {m.icon}
              </div>
              <div>
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.25em] ${
                    active === m.id ? "text-neon-cyan" : "text-white/40"
                  }`}
                >
                  {m.kicker}
                </p>
                <p
                  className={`text-sm font-bold ${
                    active === m.id ? "text-white" : "text-white/70"
                  }`}
                >
                  {m.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {active === "profile" && <ProfileModule token={token} />}
          {active === "links" && <LinksModule token={token} />}
          {active === "contact" && <ContactModule token={token} />}
          {active === "content" && <ContentModule token={token} />}
          {active === "legal" && <LegalModule token={token} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
