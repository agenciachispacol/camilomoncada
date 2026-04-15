-- Paso 2 del setup · corre esto en el SQL Editor:
-- https://supabase.com/dashboard/project/jcusalimpfqgtothjqkx/sql/new
--
-- Crea:
--   1) Bucket público "media" para foto de perfil, iconos y portadas
--   2) Tabla site_settings (clave/valor) con todas las config del sitio
--   3) Tabla links (árbol de links editable con orden, visibilidad, iconos)
--   4) Columnas "visible" en articles y prompts
--   5) Políticas RLS y triggers updated_at

-- ============================================================
-- 1) BUCKET DE STORAGE
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'media');

-- Escrituras solo con service_role (bypass RLS)

-- ============================================================
-- 2) SITE SETTINGS (clave/valor)
-- ============================================================
create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read"
on public.site_settings for select
to anon, authenticated
using (true);

-- Seed de keys por defecto
insert into public.site_settings (key, value) values
  ('name', 'Camilo Moncada'),
  ('role', 'AI para Emprendedores'),
  ('tagline', 'Ayudo a emprendedores a crecer sus empresas con soluciones de Inteligencia Artificial.'),
  ('subtagline', 'Consultorías, clases virtuales y automatizaciones con IA hechas a la medida.'),
  ('avatar_url', ''),
  ('whatsapp_number', '57320946700'),
  ('whatsapp_message', 'Hola Camilo, vi tu landing y quiero agendar una consultoría gratuita para crecer mi empresa con IA.'),
  ('cal_namespace', '30min'),
  ('cal_link', 'camilo-moncada-0kerld/30min'),
  ('privacy_policy',
'POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES

Camilo Moncada respeta y protege tu información. Al escribir por WhatsApp, agendar una consultoría o enviar cualquier dato a través de esta página, aceptas los siguientes términos:

1. Finalidad: Los datos que compartes (nombre, teléfono, correo, mensaje) serán utilizados exclusivamente para brindarte información, atención comercial, consultorías y servicios relacionados con soluciones de Inteligencia Artificial para emprendimientos.

2. Confidencialidad: Tu información no será compartida con terceros, vendida ni cedida a empresas ajenas. Se guarda de forma segura y solo es accesible por Camilo Moncada y su equipo de trabajo.

3. Derechos: Tienes derecho a conocer, actualizar, rectificar o suprimir los datos que compartiste en cualquier momento. Para ejercer estos derechos escribe al WhatsApp de contacto.

4. Conservación: Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad expuesta y las obligaciones legales aplicables.

5. Aceptación: Al iniciar una conversación por WhatsApp o agendar una cita por Cal.com aceptas expresamente esta política.

Para cualquier pregunta sobre el manejo de tus datos, contáctame por los canales oficiales publicados en esta página.')
on conflict (key) do nothing;

create or replace function public.settings_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists settings_set_updated_at on public.site_settings;
create trigger settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.settings_set_updated_at();

-- ============================================================
-- 3) LINKS (árbol editable)
-- ============================================================
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  url text not null,
  icon_name text,           -- nombre de ícono Lucide (MessageCircle, Instagram...)
  icon_url text,            -- URL de ícono custom subido al bucket media (prioritario)
  accent text default 'pink' check (accent in ('pink','cyan','purple','green','yellow')),
  external boolean default true,
  position int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.links enable row level security;

drop policy if exists "links_public_read" on public.links;
create policy "links_public_read"
on public.links for select
to anon, authenticated
using (true);

create index if not exists links_position_idx on public.links (position asc);

drop trigger if exists links_set_updated_at on public.links;
create trigger links_set_updated_at
  before update on public.links
  for each row execute function public.settings_set_updated_at();

-- Seed de links iniciales (solo si la tabla está vacía)
insert into public.links (title, subtitle, url, icon_name, accent, position)
select * from (values
  ('Escríbeme por WhatsApp', 'Mensaje directo con respuesta rápida', 'https://wa.me/57320946700', 'MessageCircle', 'green', 10),
  ('Consultoría gratuita 30 min', 'Agenda vía Cal.com', '#consultoria', 'Calendar', 'pink', 20),
  ('Clases de IA para emprendimientos', 'Formación virtual práctica', '#clases', 'GraduationCap', 'purple', 30),
  ('Artículos & tips', 'IA aplicada a negocios', '/articulos', 'BookOpen', 'cyan', 40),
  ('Biblioteca de prompts', 'Plantillas listas para usar', '/prompts', 'Sparkles', 'pink', 50),
  ('Instagram', '@camilomoncada.ia', 'https://www.instagram.com/camilomoncada.ia', 'Instagram', 'purple', 60),
  ('TikTok', '@camilomoncada.ia', 'https://www.tiktok.com/@camilomoncada.ia', 'TikTok', 'cyan', 70)
) as v(title, subtitle, url, icon_name, accent, position)
where not exists (select 1 from public.links);

-- ============================================================
-- 4) VISIBILIDAD EN ARTICLES Y PROMPTS
-- ============================================================
alter table public.articles add column if not exists visible boolean not null default true;
alter table public.prompts  add column if not exists visible boolean not null default true;
