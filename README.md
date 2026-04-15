# Camilo Moncada · Landing neon

Landing personal tipo Linktree con diseño **neon minimalista**, **mobile first** y muchas animaciones. Hecha en **Next.js 14 + Tailwind + Framer Motion** e integrada con **Supabase** (artículos y biblioteca de prompts) y **Cal.com** (consultorías gratuitas).

## Stack

- Next.js 14 (App Router)
- Tailwind CSS + diseño mobile first
- Framer Motion para animaciones
- Supabase para artículos y prompts
- @calcom/embed-react para el booking
- lucide-react para iconos

## Puesta en marcha

```bash
npm install
cp .env.example .env.local
# rellena las variables
npm run dev
```

Visita http://localhost:3000.

### Variables de entorno

| Variable | Qué es |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (lectura pública) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (solo servidor, usado por `/api/publish`) |
| `ADMIN_TOKEN` | Token compartido para proteger el panel `/admin` |

## Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ejecuta `supabase/schema.sql` en el SQL editor.
3. Copia las keys a tu `.env.local`.

## Rutas

- `/` — Landing neon con hero, links, servicios y Cal.com
- `/articulos` — Listado de artículos desde Supabase
- `/articulos/[slug]` — Detalle de artículo
- `/prompts` — Biblioteca de prompts con botón copiar
- `/admin` — Formulario protegido por `ADMIN_TOKEN` para publicar artículos/prompts
- `/api/publish` — API POST que escribe en Supabase usando el service role

## Personalización

Todos los datos personales están en `lib/site.ts` (nombre, WhatsApp, mensaje, Cal.com, redes sociales). Cambia allí y listo.

### Foto

Cuando tengas tu foto, súbela como `public/camilo.jpg` (o cambia la ruta en `components/Avatar.tsx`). Mientras no exista, el avatar muestra las iniciales con efecto neon.

### WhatsApp

El número y el mensaje predeterminado viven en `lib/site.ts`. El enlace se genera como `https://wa.me/<numero>?text=<mensaje>`.

### Cal.com

El embed usa el namespace `30min` y el link `camilo-moncada-0kerld/30min`. Edítalo en `lib/site.ts` y en `components/CalEmbed.tsx`.

## Deploy

Recomendado: [Vercel](https://vercel.com). Importa el repo, configura las variables de entorno y listo.

## Licencia

Uso personal de Camilo Moncada.
