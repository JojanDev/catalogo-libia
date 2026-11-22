# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Catálogo en línea **Tonorosa by Leyar** (ropa infantil, Colombia), **opción 1 de la cotización**: inicio con carrusel de fotos y videos, catálogo con buscador y filtros, colecciones (una destacada y filtro por colección), detalle de cada prenda con tallas y **consulta por WhatsApp**, y SEO básico. Johan carga y actualiza los productos (hasta 20 por mes); no hay panel de administración, carrito, pagos, pedidos, descuentos, Nosotros, Contacto, guía de tallas ni políticas. Next.js 16 (App Router, Turbopack) + React 19 + TypeScript 5.9 + Tailwind 4. Hosting previsto en Netlify; dominio `tonorosabyleyar.com` (Cloudflare). Textos, identificadores y columnas en español.

Estado actual: rama `main`, conectada a **Supabase** (esquema en `supabase-opcion-1.sql`; fotos en Supabase Storage, bucket `productos`, por carpeta `productos/<slug>/1.jpg…`). Diseño: `docs/diseno-tonorosa.md` y el rediseño aplicado en `docs/rediseno-tienda.md`. Alcance y precio acordados: `docs/cotizacion-opcion-1.md` (PDF completo en `docs/Cotizacion-Tonorosa.pdf`). Versiones y cómo volver a cada una: `VERSIONES.md`.

La tienda completa (opción 4: panel, carrito, Wompi, pedidos) quedó guardada en la rama `opcion-4-tienda-completa`.

## Commands

- `npm run dev` — servidor de desarrollo (`npm run dev -- -H 0.0.0.0 -p 3001` para verlo desde el celular en la misma red; el puerto 3000 lo usa otro proyecto)
- `npm run build` — build de producción con chequeo de tipos; es la verificación obligatoria. Con el servidor de desarrollo encendido el chequeo de tipos puede fallar por archivos de `.next/dev/types`: detener el servidor antes del build.
- `npm run lint` — ESLint
- `npm run start` — sirve el build

No hay framework de pruebas ni CI.

## Environment

Ver `.env.example`. Públicas: `NEXT_PUBLIC_*` (`NEXT_PUBLIC_SITE_URL`, número de WhatsApp, Supabase). Secretas (solo servidor, nunca `NEXT_PUBLIC_`): service role de Supabase, si se llega a necesitar.

## TypeScript constraints (tsconfig.json)

- `verbatimModuleSyntax` — imports de tipos con `import type`.
- `noUnusedLocals` / `noUnusedParameters` — código sin usar rompe el build.
- Sin `enum` ni `namespace`: usar objetos `const` y uniones.
- Imports con el alias `@/` (`@/lib/formato`) y **sin extensión**.

## Architecture

```
src/app/
  (tienda)/   inicio, catalogo, colecciones/[slug], producto/[slug]
  layout.tsx · not-found.tsx · opengraph-image.tsx
src/lib/      datos/tienda.ts (capa de datos), supabase/ (cliente), filtros-url, formato, slug
src/components/ tienda/ · decor/ · ui/
src/types/index.ts
public/decor/ (flores en acuarela) · public/mock/ (imágenes de prueba)
```

- **Capa de datos**: las pantallas leen **solo** mediante funciones de `src/lib/datos/tienda.ts`. Nunca llaman a Supabase directamente.
- **Server Components por defecto**; `"use client"` solo en componentes con estado, eventos o APIs del navegador.
- **Navegación** con `<Link>` / `useRouter` y URLs reales; filtros del catálogo en query params (`q`, `coleccion`, `categoria`, `min`, `max`).
- **Consulta por WhatsApp** (`src/components/tienda/ConsultaWhatsApp.tsx`): mensaje con prenda, talla opcional, precio y URL del producto; las prendas agotadas preguntan por disponibilidad.
- **Dinero** en pesos enteros (COP); `formatearPrecio` deja un espacio de no separación entre `$` y el número.
- **Inventario**: sobre pedido, marca `agotado` por prenda y por talla. Productos y colecciones se inactivan, no se borran.
- `next.config.ts` tiene `cacheComponents: true` (Next 16): el acceso a datos es dinámico salvo que se marque con `"use cache"`; evitar `new Date()` en Server Components.

**Styling**: Tailwind 4 con tokens en `@theme` de `src/app/globals.css` (`canvas`, `surface`, `rosa-suave`, `rosa-medio`, `rosa-deco`, `rosa-boton`/`rosa-boton-hover` con texto `cafe-oscuro` para botones, `rosa-accion`/`rosa-hover` para enlaces y estados activos, `taupe`, `cafe`, `tenue`, `salvia`, `borde`, estados). Fuentes con `next/font/google`: `font-display` Marcellus, `font-script` Dancing Script (solo frases decorativas grandes), `font-body` Nunito. Íconos de `lucide-react`. Detalle y reglas de contraste en `docs/diseno-tonorosa.md`. Mobile-first.

## Flujo de trabajo obligatorio (Orquestador → subagentes → QA)

Todo requerimiento de código sigue este ciclo. Las definiciones de los subagentes están en `.claude/agents/` (`ui-ux`, `backend`, `frontend`, `qa`). `wokflow.md` es la descripción original del flujo.

**La sesión principal es el Orquestador (modo PLAN). No escribe ni edita código de la aplicación.**

1. Analiza el requerimiento y lee **solo** el código necesario, anotando las rutas exactas que entregará a los ejecutores (esa lectura se hace una vez, aquí).
2. Si toca interfaz, llama primero a `ui-ux` para obtener lineamientos (o usa `docs/diseno-tonorosa.md` si ya cubre el caso).
3. Delega a `backend` y/o `frontend` con: alcance cerrado, rutas exactas a tocar, 2–3 archivos análogos a imitar y los lineamientos de UI/UX. Si las partes son independientes, lánzalos en paralelo en un solo mensaje. Cada invocación debe ser autosuficiente (el contexto del subagente se descarta).
4. Llama a `qa` una sola vez después de los desarrolladores, pasándole la lista exacta de archivos que reportaron.
5. Si QA rechaza, vuelve a llamar al subagente responsable con el defecto concreto (no el requerimiento entero) y luego otra vez a QA, hasta `APROBADO`.
6. Si el mismo defecto llega a la tercera iteración, detén la delegación, reevalúa y reinicia con alcance reformulado.
7. Con `APROBADO`, entrega al usuario un informe final corto.

Reglas de costo: ningún subagente escanea el repo (nada de `Glob '**/*'` ni `Grep` sin `path`); localizar con `Grep -n` antes de abrir; no leer completos archivos grandes — usar `offset`/`limit`; razonamiento bajo en tareas mecánicas; reportes = confirmación + lista de archivos.

### Particularidades de este proyecto

Los agentes de `.claude/agents/` están adaptados a este proyecto; en caso de conflicto, prevalece este archivo:

- **"Backend"** = `src/lib/**` (capa de datos, datos de prueba, formato, slug), `src/types` y archivos SQL nuevos en la raíz. Nunca ejecutar SQL contra la base real; solo escribir el `.sql`.
- **"Frontend"** = páginas y layouts de `src/app/**` y componentes de `src/components/**`. Colores y fuentes solo con los tokens de `globals.css`; nada de hex sueltos ni `bg-[#...]` (excepción: el verde de WhatsApp #25D366).
- **QA**: la verificación es `npm run build` (y `npm run lint`) más revisión de los archivos listados con `git diff` / `git status` acotados.
- Sin comentarios en el código nuevo, mínimo código, sin refactors fuera de alcance.
- Commits firmados por el usuario (ver memoria), sin coautoría de Claude.

## Database

El esquema de la opción 1 está en `supabase-opcion-1.sql`, que se ejecuta a mano en el editor SQL de Supabase (sin herramienta de migraciones). Si la base ya tiene aplicado el esquema de la tienda completa (`supabase-opcion-4.sql`, en la rama `opcion-4-tienda-completa`), ejecutar también `supabase-configuracion-publica.sql` para que la clave pública pueda leer `whatsapp` y `texto_anuncio`. Al cambiar la forma de los datos, agregar un SQL nuevo y actualizar los mappers de `src/lib`.
