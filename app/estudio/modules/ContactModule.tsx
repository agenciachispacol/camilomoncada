"use client";

import { useEffect, useState } from "react";
import Field, { inputCls } from "../shared/Field";
import SaveButton from "../shared/SaveButton";

export default function ContactModule({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const [waNumber, setWaNumber] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [calNamespace, setCalNamespace] = useState("");
  const [calLink, setCalLink] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings");
      const json = await res.json();
      const s = json.settings ?? {};
      setWaNumber(s.whatsapp_number ?? "");
      setWaMessage(s.whatsapp_message ?? "");
      setCalNamespace(s.cal_namespace ?? "");
      setCalLink(s.cal_link ?? "");
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
          updates: {
            whatsapp_number: waNumber.replace(/\D/g, ""),
            whatsapp_message: waMessage,
            cal_namespace: calNamespace,
            cal_link: calLink,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setMessage({ type: "ok", text: "Contacto actualizado" });
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
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-neon-cyan">
          WhatsApp
        </h3>
        <div className="space-y-4">
          <Field
            label="Número (con código de país, sin +)"
            hint="Ej: 57320946700"
          >
            <input
              required
              inputMode="numeric"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field
            label="Mensaje predeterminado"
            hint="El mensaje que se autoescribe al hacer clic"
          >
            <textarea
              value={waMessage}
              onChange={(e) => setWaMessage(e.target.value)}
              className={`${inputCls} min-h-[80px]`}
            />
          </Field>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-neon-cyan">
          Cal.com
        </h3>
        <div className="space-y-4">
          <Field label="Namespace" hint="Ej: 30min">
            <input
              value={calNamespace}
              onChange={(e) => setCalNamespace(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Cal link" hint="Ej: camilo-moncada-0kerld/30min">
            <input
              value={calLink}
              onChange={(e) => setCalLink(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
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
