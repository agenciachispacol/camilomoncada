"use client";

import { useEffect, useState } from "react";
import Field, { inputCls } from "../shared/Field";
import UploadField from "../shared/UploadField";
import SaveButton from "../shared/SaveButton";

export default function ProfileModule({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [tagline, setTagline] = useState("");
  const [subtagline, setSubtagline] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings");
      const json = await res.json();
      const s = json.settings ?? {};
      setName(s.name ?? "");
      setRole(s.role ?? "");
      setTagline(s.tagline ?? "");
      setSubtagline(s.subtagline ?? "");
      setAvatarUrl(s.avatar_url ?? "");
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
            name,
            role,
            tagline,
            subtagline,
            avatar_url: avatarUrl,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setMessage({ type: "ok", text: "Perfil actualizado" });
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
      <UploadField
        value={avatarUrl}
        onChange={setAvatarUrl}
        token={token}
        folder="profile"
        label="Foto de perfil"
        help="Se muestra en el hero de la landing"
      />
      <Field label="Nombre">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </Field>
      <Field label="Rol / título">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputCls}
          placeholder="AI para Emprendedores"
        />
      </Field>
      <Field label="Tagline principal">
        <textarea
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className={`${inputCls} min-h-[80px]`}
        />
      </Field>
      <Field label="Subtagline">
        <textarea
          value={subtagline}
          onChange={(e) => setSubtagline(e.target.value)}
          className={`${inputCls} min-h-[60px]`}
        />
      </Field>
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
