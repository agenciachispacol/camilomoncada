import { NextResponse } from "next/server";
import { adminClient, requireUser } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/links → lista completa (para admin; público lee desde server component)
export async function GET(req: Request) {
  const user = await requireUser(req);
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const supabase = adminClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("position", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: data ?? [] });
}

// POST /api/links  body: { data }
export async function POST(req: Request) {
  const user = await requireUser(req);
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.data)
    return NextResponse.json({ error: "data requerido" }, { status: 400 });
  const d = body.data;
  if (!d.title || !d.url)
    return NextResponse.json(
      { error: "title y url son obligatorios" },
      { status: 400 },
    );

  const supabase = adminClient();
  // Calcular posición al final si no viene
  const { data: maxRow } = await supabase
    .from("links")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPos = ((maxRow?.position as number | undefined) ?? 0) + 10;

  const { data, error } = await supabase
    .from("links")
    .insert({
      title: d.title,
      subtitle: d.subtitle || null,
      url: d.url,
      icon_name: d.icon_name || null,
      icon_url: d.icon_url || null,
      accent: d.accent || "pink",
      external: d.external ?? true,
      visible: d.visible ?? true,
      position: d.position ?? nextPos,
    })
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data });
}

// PATCH /api/links  body: { id, data }
export async function PATCH(req: Request) {
  const user = await requireUser(req);
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.id)
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  const supabase = adminClient();
  const allowed = [
    "title",
    "subtitle",
    "url",
    "icon_name",
    "icon_url",
    "accent",
    "external",
    "visible",
    "position",
  ];
  const payload: Record<string, any> = {};
  for (const k of allowed) {
    if (body.data && body.data[k] !== undefined) payload[k] = body.data[k];
  }
  const { data, error } = await supabase
    .from("links")
    .update(payload)
    .eq("id", body.id)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: data });
}

// DELETE /api/links  body: { id }
export async function DELETE(req: Request) {
  const user = await requireUser(req);
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.id)
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  const supabase = adminClient();
  const { error } = await supabase.from("links").delete().eq("id", body.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
