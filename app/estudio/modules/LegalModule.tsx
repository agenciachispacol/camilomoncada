"use client";

import { useEffect, useState } from "react";
import NeonEditor from "@/components/NeonEditor";
import SaveButton from "../shared/SaveButton";

export default function LegalModule({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [policy, setPolicy] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings");
      const json = await res.json();
      setPolicy(json.settings?.privacy_policy ?? "");
      setLoading(false);
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          updates: { privacy_policy: policy },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setMessage({ type: "ok", text: "Política actualizada" });
    } catch (err: any) {
      setMessage({ type: "err", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
    );

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md sm:p-6"
    >
      <div>
        <p className="mb-3 text-xs text-white/55">
          Esta política se muestra en la página{" "}
          <span className="text-neon-cyan">/privacidad</span> y se enlaza debajo
          del botón de WhatsApp. El visitante acepta automáticamente al
          escribirte o agendar.
        </p>
        <NeonEditor
          value={policy}
          onChange={setPolicy}
          placeholder="Escribe tu política de tratamiento de datos..."
        />
      </div>
      <SaveButton loading={saving} />
      {message && (
        <p
          className={`text-center text-sm ${
            message.type === "ok" ? "text-neon-green" : "text-neon-pink"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
