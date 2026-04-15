import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_TOKEN no configurado en el servidor" },
      { status: 500 },
    );
  }
  if (token !== expected) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase no configurado" },
      { status: 500 },
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { kind, data } = payload ?? {};

  if (kind === "article") {
    if (!data?.title || !data?.slug || !data?.content) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios del artículo" },
        { status: 400 },
      );
    }
    const { error } = await supabase.from("articles").insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      cover_url: data.cover_url || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (kind === "prompt") {
    if (!data?.title || !data?.body) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios del prompt" },
        { status: 400 },
      );
    }
    const { error } = await supabase.from("prompts").insert({
      title: data.title,
      description: data.description || null,
      body: data.body,
      tags: data.tags ?? [],
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Tipo desconocido" }, { status: 400 });
}
