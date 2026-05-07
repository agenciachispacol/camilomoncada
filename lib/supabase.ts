import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anonKey);

export const supabase = supabaseEnabled
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: false },
    })
  : null;

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  created_at: string;
};

export type Prompt = {
  id: string;
  title: string;
  description: string | null;
  body: string;
  tags: string[] | null;
  images: string[] | null;
  created_at: string;
};
