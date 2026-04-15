import { NextResponse } from "next/server";
import { adminClient, requireUser } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/content?kind=article|prompt → lista (requiere auth)
export async function GET(req: Request) {
  const user = await requireUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const table =
    kind === "prompt" ? "prompts" : kind === "article" ? "articles" : null;
  if (!table)
    return NextResponse.json({ error: "kind inválido" }, { status: 400 });

  const supabase = adminClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: data ?? [] });
}

// POST /api/content  body: { kind, data }
export async function POST(req: Request) {
  const user = await requireUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  const { kind, data } = body;
  const supabase = adminClient();

  if (kind === "article") {
    if (!data?.title || !data?.content)
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    const payload = {
      title: data.title,
      slug: data.slug || slugify(data.title),
      excerpt: data.excerpt || null,
      content: data.content,
      cover_url: data.cover_url || null,
    };
    const { data: inserted, error } = await supabase
      .from("articles")
      .insert(payload)
      .select()
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ item: inserted });
  }

  if (kind === "prompt") {
    if (!data?.title || !data?.body)
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    const payload = {
      title: data.title,
      description: data.description || null,
      body: data.body,
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
    const { data: inserted, error } = await supabase
      .from("prompts")
      .insert(payload)
      .select()
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ item: inserted });
  }

  return NextResponse.json({ error: "kind inválido" }, { status: 400 });
}

// PATCH /api/content  body: { kind, id, data }
export async function PATCH(req: Request) {
  const user = await requireUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  const { kind, id, data } = body;
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  const table =
    kind === "prompt" ? "prompts" : kind === "article" ? "articles" : null;
  if (!table)
    return NextResponse.json({ error: "kind inválido" }, { status: 400 });

  const supabase = adminClient();
  const payload: Record<string, any> = {};
  if (kind === "article") {
    if (data.title !== undefined) payload.title = data.title;
    if (data.slug !== undefined)
      payload.slug = data.slug || slugify(data.title ?? "");
    if (data.excerpt !== undefined) payload.excerpt = data.excerpt || null;
    if (data.content !== undefined) payload.content = data.content;
    if (data.cover_url !== undefined)
      payload.cover_url = data.cover_url || null;
  } else {
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined)
      payload.description = data.description || null;
    if (data.body !== undefined) payload.body = data.body;
    if (data.tags !== undefined)
      payload.tags = Array.isArray(data.tags) ? data.tags : [];
  }

  const { data: updated, error } = await supabase
    .from(table)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ item: updated });
}

// DELETE /api/content  body: { kind, id }
export async function DELETE(req: Request) {
  const user = await requireUser(req);
  if (!user) return unauthorized();

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  const { kind, id } = body;
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  const table =
    kind === "prompt" ? "prompts" : kind === "article" ? "articles" : null;
  if (!table)
    return NextResponse.json({ error: "kind inválido" }, { status: 400 });

  const supabase = adminClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
