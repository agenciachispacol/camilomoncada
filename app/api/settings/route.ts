import { NextResponse } from "next/server";
import { adminClient, requireUser } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unconfigured() {
  return NextResponse.json(
    { error: "Supabase no está configurado en el servidor" },
    { status: 503 },
  );
}

// GET /api/settings → devuelve todas las settings (lectura pública)
export async function GET() {
  const supabase = adminClient();
  if (!supabase) return unconfigured();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  const obj = Object.fromEntries(
    (data ?? []).map((r: any) => [r.key, r.value]),
  );
  return NextResponse.json({ settings: obj });
}

// PATCH /api/settings  body: { key, value } o { updates: { k: v } }
export async function PATCH(req: Request) {
  const user = await requireUser(req);
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });

  const updates: Record<string, string> =
    body.updates && typeof body.updates === "object"
      ? body.updates
      : body.key
        ? { [body.key]: body.value ?? "" }
        : {};

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "Sin cambios" }, { status: 400 });

  const supabase = adminClient();
  if (!supabase) return unconfigured();
  const rows = Object.entries(updates).map(([key, value]) => ({
    key,
    value: value ?? "",
  }));

  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
