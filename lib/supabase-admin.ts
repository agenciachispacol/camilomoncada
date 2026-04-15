import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || ANON;

export const supabaseConfigured = Boolean(SUPABASE_URL && ANON && SERVICE);

/**
 * Cliente con service_role para escrituras (salta RLS).
 * Retorna null si faltan las env vars — cada route handler debe chequear.
 */
export function adminClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SERVICE) return null;
  return createClient(SUPABASE_URL, SERVICE, {
    auth: { persistSession: false },
  });
}

/**
 * Verifica el JWT de Supabase Auth del header Authorization: Bearer <token>.
 * Retorna el user o null.
 */
export async function requireUser(req: Request) {
  if (!SUPABASE_URL || !ANON) return null;
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;
  const authClient = createClient(SUPABASE_URL, ANON, {
    auth: { persistSession: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
