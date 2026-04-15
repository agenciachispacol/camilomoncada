-- Schema para Supabase (ejecutar en el SQL editor)
-- https://supabase.com/dashboard/project/jcusalimpfqgtothjqkx/sql/new

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  body text not null,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles enable row level security;
alter table public.prompts enable row level security;

-- Lectura pública (landing, /articulos, /prompts)
drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
  for select to anon, authenticated using (true);

drop policy if exists "prompts_public_read" on public.prompts;
create policy "prompts_public_read" on public.prompts
  for select to anon, authenticated using (true);

-- Las escrituras solo se harán con service_role (bypass RLS)
-- así que no definimos policies de insert/update/delete.

create index if not exists articles_created_at_idx on public.articles (created_at desc);
create index if not exists prompts_created_at_idx on public.prompts (created_at desc);

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

drop trigger if exists prompts_set_updated_at on public.prompts;
create trigger prompts_set_updated_at
  before update on public.prompts
  for each row execute function public.set_updated_at();
