# Camilo Moncada · Landing neon

Landing personal tipo Linktree con diseño **neon minimalista**, **mobile first** y muchas animaciones. Hecha en **Next.js 14 + Tailwind + Framer Motion + Tiptap** e integrada con **Supabase** (Auth + Storage + DB) y **Cal.com** (consultorías gratuitas).

Todo el contenido (perfil, links, WhatsApp, Cal, artículos, prompts, política de datos) se administra desde un panel privado en `/estudio` con login por email y contraseña.

## Stack

- Next.js 14 App Router · Tailwind CSS · Framer Motion
- Tiptap (rich text editor) con estilos neon personalizados
- Supabase Auth (login por email) + Storage (fotos e iconos) + Postgres
- @calcom/embed-react para el booking
- lucide-react para iconos
- Mobile first + SEO + JSON-LD + sitemap dinámico

## Rutas

- `/` — Landing dinámica (todo viene de Supabase)
- `/articulos` y `/articulos/[slug]` — Blog
- `/prompts` — Biblioteca de prompts
- `/privacidad` — Política de tratamiento de datos (editable)
- `/estudio` — Panel admin privado con login (noindex + disallow en robots)
- `/sitemap.xml` y `/robots.txt` — SEO

## Variables de entorno

| Variable | Qué es |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (lectura pública) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role, solo servidor (para escrituras y storage) |
| `NEXT_PUBLIC_SITE_URL` | URL canónica del sitio para SEO/sitemap |

## Setup de Supabase (una sola vez)

1. Crea un proyecto en [supabase.com](https://supabase.com) y copia sus keys.
2. En el SQL editor, ejecuta en orden:
   - `supabase/schema.sql` — tablas `articles` y `prompts`
   - `supabase/002_storage_and_settings.sql` — bucket `media`, tabla `site_settings`, tabla `links`, columnas `visible`
3. En **Authentication → Users → Add user**, crea tu usuario admin (email + contraseña). Esta es tu clave secreta para entrar a `/estudio`.
4. Completa `.env.local` con las keys.

## Panel `/estudio`

Módulos:

- **Perfil** — nombre, rol, tagline, subtagline, foto (subida al bucket `media`)
- **Links** — árbol completo de enlaces con CRUD, upload de ícono custom, orden, visibilidad
- **Contacto** — número de WhatsApp, mensaje predeterminado, Cal.com namespace y link
- **Contenido** — tabs de Artículos y Prompts con editor rich-text (Tiptap estilo neon), visibilidad, portadas
- **Legal** — política de tratamiento de datos (editor rich-text)

Todas las escrituras pasan por API routes (`/api/content`, `/api/links`, `/api/settings`, `/api/upload`) que validan el JWT de Supabase Auth y usan el service role para bypassear RLS.

## Puesta en marcha local

```bash
npm install
cp .env.example .env.local
# rellena las variables
npm run dev
```

Visita `http://localhost:3000` y el panel en `http://localhost:3000/estudio`.

## Deploy

Recomendado: [Vercel](https://vercel.com). Importa el repo, configura las variables de entorno y listo.
