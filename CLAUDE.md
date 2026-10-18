# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

LIBIA catalog: a Spanish-language (Colombia) children's clothing storefront. React 19 + TypeScript 6 + Vite 8 + Tailwind 3, with Supabase as the only backend (no server code in this repo). UI text, identifiers, and DB columns are in Spanish.

Note: `AGENTS.md` is stale — it describes the earlier vanilla-TS version (`src/main.ts`, `counter.ts`). The app is now React (`src/main.tsx`).

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc && vite build`; this is the only way to type-check (no separate typecheck script)
- `npm run preview` — serve the production build

There is no test framework, no linter, and no CI.

## Environment

`.env` must define `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`). `src/lib/supabase.ts` throws at import time if they're missing, so the whole app fails to load without them.

## TypeScript constraints (tsconfig.json)

- `erasableSyntaxOnly` — no `enum`, `namespace`, or constructor parameter properties; use `const` objects / union types.
- `verbatimModuleSyntax` — type-only imports must use `import type` (or inline `type` modifiers).
- `noUnusedLocals` / `noUnusedParameters` — unused code fails the build.
- Imports include the file extension (`./App.tsx`, `../lib/supabase.ts`); follow this convention.

## Architecture

**Routing** is hash-based and hand-rolled: `src/hooks/useHashRoute.ts` parses `#/<page>/...` and `src/App.tsx` switches on `route.page`:
- `#/` (default) → `features/landing` — a landing page that links to the prototypes
- `#/catalogo` → `features/prototipo-2` — public read-only catalog
- `#/catalogo-admin` → `features/prototipo-3` — the same catalog plus a Supabase-auth-gated admin panel (products, collections, discounts, orders)
- `#/checkout` → `features/checkout` — inserts a row into `pedidos`

Navigation is done with plain `href="#/..."` links or by setting `window.location.hash`.

**Data access**: components call `supabase.from(...)` directly — there is no repository/service layer. `Prototipo3Page.tsx` is the hub for the admin prototype: it loads all data, owns the admin view state (`adminVista`, `editando*Id`), maps DB rows ↔ domain types (`mapProductoDesdeDB` / `mapProductoParaDB`), and passes CRUD handlers down to the `Admin*` components. The admin components are mostly presentational. `Prototipo2Page.tsx` has its own independent fetching/mapping for the public catalog.

**Domain vs DB shape**: domain types live in `src/types/index.ts`. DB uses `imagen_url` where the domain uses `imagen`; sizes come from the join `producto_tallas(stock, tallas(nombre))` and become `Producto.sizes`; discounts come from `descuento_productos(descuentos(...))` and become `Producto.descuento`. Products reference collections by **collection name** (`productos.coleccion` text), not by slug/FK, so renaming a collection requires updating products too (handled in `Prototipo3Page`).

**Cart**: `src/context/CartContext.tsx` (reducer + context, provided in `main.tsx`) holds cart items keyed by `(productId, size)`, enforces per-size stock, snapshots the product discount percentage at add time, and validates promo codes against the `codigos_promo` table. Price/discount helpers are in `src/lib/pricing.ts` (a discount is active until `fecha_vencimiento`). Orders are also sent via WhatsApp links (`WHATSAPP_NUMBER` in `src/constants`).

**Styling**: Tailwind with custom theme tokens in `tailwind.config.js` (`canvas`, `warm-accent`, `text-primary`, `text-muted`, `border-soft`, `pastel-*`, `rounded-soft`/`softer`, `font-heading` = Comfortaa, `font-body` = Nunito). Fonts load from Google Fonts in `index.html`. Icons from `lucide-react`.

## Flujo de trabajo obligatorio (Orquestador → subagentes → QA)

Todo requerimiento de código sigue este ciclo. Las definiciones de los subagentes están en `.claude/agents/` (`ui-ux`, `backend`, `frontend`, `qa`, todos en Sonnet). `wokflow.md` es la descripción original del flujo.

**La sesión principal es el Orquestador (modo PLAN). No escribe ni edita código de la aplicación.**

1. Analiza el requerimiento y lee **solo** el código necesario, anotando las rutas exactas que entregará a los ejecutores (esa lectura se hace una vez, aquí).
2. Si toca interfaz, llama primero a `ui-ux` para obtener lineamientos.
3. Delega a `backend` y/o `frontend` con: alcance cerrado, rutas exactas a tocar, 2–3 archivos análogos a imitar y los lineamientos de UI/UX. Si las partes son independientes, lánzalos en paralelo en un solo mensaje. Cada invocación debe ser autosuficiente (el contexto del subagente se descarta).
4. Llama a `qa` una sola vez después de los desarrolladores, pasándole la lista exacta de archivos que reportaron.
5. Si QA rechaza, vuelve a llamar al subagente responsable con el defecto concreto (no el requerimiento entero) y luego otra vez a QA, hasta `APROBADO`.
6. Si el mismo defecto llega a la tercera iteración, detén la delegación, reevalúa y reinicia con alcance reformulado.
7. Con `APROBADO`, entrega al usuario un informe final corto.

Reglas de costo: ningún subagente escanea el repo (nada de `Glob '**/*'` ni `Grep` sin `path`); localizar con `Grep -n` antes de abrir; no leer completos archivos grandes (p. ej. `Prototipo3Page.tsx`) — usar `offset`/`limit`; razonamiento bajo en tareas mecánicas; reportes = confirmación + lista de archivos.

### Particularidades de este proyecto

Los agentes de `.claude/agents/` ya están adaptados a este proyecto; en caso de conflicto, prevalece este archivo:

- **"Backend"** = acceso a datos con Supabase (`supabase.from(...)`, mappers en las páginas, `CartContext`, `src/lib/`) y archivos SQL nuevos en la raíz. No hay servidor propio. Nunca ejecutar SQL contra la base real; solo escribir el `.sql`.
- **"Frontend"** = componentes React/TSX en `src/components` y `src/features`. Colores/fuentes vía tokens de Tailwind de `tailwind.config.js` (`warm-accent`, `text-primary`, `canvas`, etc.), no `var(--bs-primary)` ni hex sueltos.
- **QA**: no hay tests ni linter. La verificación es `npm run build` (tsc + vite) más revisión de los archivos listados. Este proyecto **sí es un repositorio git**: QA puede usar `git diff` / `git status` acotado a los archivos listados.
- Sin comentarios en el código nuevo, mínimo código, sin refactors fuera de alcance.

## Database

Schema is managed manually by running the root `supabase-*.sql` files in the Supabase SQL editor (no migration tooling). Apply in order: `supabase-schema.sql` → `supabase-migration-relational.sql` (tallas, producto_tallas, codigos_promo, pedidos) → `supabase-migration-descuentos.sql` (descuentos, descuento_productos) → `supabase-update-tallas-colombia.sql`. When changing data shape, add a new SQL file and update the corresponding mappers.
