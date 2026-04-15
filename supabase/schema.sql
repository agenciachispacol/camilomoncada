-- Schema para Supabase (ejecutar en SQL editor)
-- Crea tablas de artículos y prompts con políticas RLS de lectura pública.

-- ARTICLES -------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_url text,
  created_at timestamptz not null default now()
);

alter table public.articles enable row level security;

-- Lectura pública
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read"
on public.articles for select
to anon, authenticated
using (true);

-- Escritura: solo con service role (bypass RLS)
-- no se crea policy de insert/update para anon.

-- PROMPTS --------------------------------------------------------
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  body text not null,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

alter table public.prompts enable row level security;

drop policy if exists "prompts_public_read" on public.prompts;
create policy "prompts_public_read"
on public.prompts for select
to anon, authenticated
using (true);

-- Índices útiles
create index if not exists articles_created_at_idx on public.articles (created_at desc);
create index if not exists prompts_created_at_idx on public.prompts (created_at desc);
