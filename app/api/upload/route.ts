import { NextResponse } from "next/server";
import { adminClient, requireUser } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST multipart/form-data
// Campos: file (obligatorio), folder (opcional, default "uploads")
export async function POST(req: Request) {
  const user = await requireUser(req);
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form)
    return NextResponse.json({ error: "Form inválido" }, { status: 400 });

  const file = form.get("file");
  const folder = (form.get("folder") as string) || "uploads";
  if (!(file instanceof Blob))
    return NextResponse.json({ error: "Archivo faltante" }, { status: 400 });

  // Validación básica
  if (file.size > 8 * 1024 * 1024)
    return NextResponse.json({ error: "Máximo 8MB" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Extensión
  const name = (file as File).name || "file";
  const ext = name.includes(".") ? name.split(".").pop() : "bin";
  const safeFolder = folder.replace(/[^a-z0-9/-]/gi, "");
  const path = `${safeFolder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const supabase = adminClient();
  const { error } = await supabase.storage
    .from("media")
    .upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
      cacheControl: "3600",
    });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
