# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Tienda en línea **Tonorosa by Leyar** (ropa infantil, Colombia). Next.js 16 (App Router, Turbopack) + React 19 + TypeScript 5.9 + Tailwind 4, con Supabase (datos y login de un solo administrador), Cloudinary (fotos/videos), Wompi (pagos) y Resend (correos). Hosting en Netlify. Textos, identificadores y columnas en español.

Estado actual: rama `migracion-nextjs`. **Etapa A (mockup funcional)**: todas las pantallas definitivas funcionan con datos falsos en memoria; la **Etapa B** conecta Supabase, Cloudinary, Wompi y Resend sin cambiar las pantallas. Plan completo: `docs/plan-migracion-nextjs.md`. Diseño: `docs/diseno-tonorosa.md`. Decisiones de negocio: `docs/cotizacion/decisiones.md`.

`_referencia/` contiene el prototipo anterior (Vite, rutas con `#`). Es **solo de lectura** para reutilizar lógica; está excluido de tsconfig y eslint y se borra al terminar la migración. No importar nada desde ahí.

## Commands

- `npm run dev` — servidor de desarrollo (`npm run dev -- -H 0.0.0.0` para verlo desde el celular en la misma red)
- `npm run build` — build de producción con chequeo de tipos; es la verificación obligatoria
- `npm run lint` — ESLint
- `npm run start` — sirve el build

No hay framework de pruebas ni CI.

## Environment

Ver `.env.example`. Públicas: `NEXT_PUBLIC_*`. Secretas (solo servidor, nunca `NEXT_PUBLIC_`): service role de Supabase, llaves de Cloudinary, Wompi y Resend. En la etapa A solo se usa `MOCK_ADMIN_PASSWORD`.

## TypeScript constraints (tsconfig.json)

- `verbatimModuleSyntax` — imports de tipos con `import type`.
- `noUnusedLocals` / `noUnusedParameters` — código sin usar rompe el build.
- Sin `enum` ni `namespace`: usar objetos `const` y uniones.
- Imports con el alias `@/` (`@/lib/pricing`) y **sin extensión**.

## Architecture

```
src/app/
  (tienda)/   inicio, catalogo, colecciones/[slug], producto/[slug], guia-de-tallas, nosotros, contacto, checkout, pago-simulado/[referencia], pedido/[referencia]
  admin/      login y (panel)/ con guardia: productos, colecciones, tallas, carrusel, guia-tallas, descuentos, codigos, pedidos, configuracion
  api/        checkout, promo/validar (luego wompi/webhook, cloudinary/*)
src/lib/      datos/* (capa de datos), mock/ (almacén en memoria de la etapa A), auth/requerirAdmin, pricing, formato, slug, pedidos/cotizar
src/components/ tienda/ · carrito/ · admin/ · decor/ · ui/
src/context/CartContext.tsx · src/types/index.ts
```

- **Capa de datos**: las pantallas leen y escriben **solo** mediante funciones de `src/lib/datos/*`. Nunca llaman a Supabase ni al almacén mock directamente. En la etapa B se cambia la implementación conservando las firmas.
- **Server Components por defecto**; `"use client"` solo en componentes con estado, eventos o APIs del navegador.
- **Panel**: server actions en `acciones.ts` junto a cada página; cada acción llama `requerirAdmin()` y luego `revalidatePath`.
- **Navegación** con `<Link>` / `useRouter` y URLs reales; filtros del catálogo en query params.
- **Dinero** en pesos enteros (COP). El servidor recalcula precios, descuentos y totales (`src/lib/pedidos/cotizar.ts`); el cliente solo muestra.
- **Descuentos**: se aplica el mayor porcentaje vigente entre producto y colección; vigente hasta el final del día de `fecha_vencimiento` en hora de Bogotá.
- **Inventario**: por defecto sobre pedido (marca `agotado` por prenda y por talla). Productos y colecciones se inactivan, no se borran.
- `next.config.ts` tiene `cacheComponents: true` (Next 16): el acceso a datos es dinámico salvo que se marque con `"use cache"`.

**Styling**: Tailwind 4 con tokens en `@theme` de `src/app/globals.css` (`canvas`, `surface`, `rosa-suave`, `rosa-medio`, `rosa-deco`, `rosa-accion`, `rosa-hover`, `taupe`, `cafe`, `tenue`, `salvia`, `borde`, estados). Fuentes con `next/font/google`: `font-display` Marcellus, `font-script` Dancing Script (solo frases decorativas grandes), `font-body` Nunito. Íconos de `lucide-react`. Detalle y reglas de contraste en `docs/diseno-tonorosa.md`. Mobile-first.

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

Reglas de costo: ningún subagente escanea el repo (nada de `Glob '**/*'` ni `Grep` sin `path`); localizar con `Grep -n` antes de abrir; no leer completos archivos grandes (p. ej. `_referencia/features/prototipo-3/Prototipo3Page.tsx`) — usar `offset`/`limit`; razonamiento bajo en tareas mecánicas; reportes = confirmación + lista de archivos.

### Particularidades de este proyecto

Los agentes de `.claude/agents/` están adaptados a este proyecto; en caso de conflicto, prevalece este archivo:

- **"Backend"** = `src/lib/**` (capa de datos, almacén mock, pricing, cotización, auth), `src/types`, `src/context/CartContext.tsx`, server actions (`acciones.ts`), route handlers (`src/app/api/**`) y archivos SQL nuevos en la raíz. Nunca ejecutar SQL contra la base real; solo escribir el `.sql`.
- **"Frontend"** = páginas y layouts de `src/app/**` (excepto `api/` y `acciones.ts`) y componentes de `src/components/**`. Colores y fuentes solo con los tokens de `globals.css`; nada de hex sueltos ni `bg-[#...]` (excepción: el verde de WhatsApp #25D366).
- **QA**: la verificación es `npm run build` (y `npm run lint`) más revisión de los archivos listados con `git diff` / `git status` acotados.
- Sin comentarios en el código nuevo, mínimo código, sin refactors fuera de alcance.

## Database

El esquema se maneja a mano ejecutando los `supabase-*.sql` de la raíz en el editor SQL de Supabase (sin herramienta de migraciones). Orden: `supabase-schema.sql` → `supabase-migration-relational.sql` → `supabase-migration-descuentos.sql` → `supabase-update-tallas-colombia.sql` → (etapa B) `supabase-migration-nextjs.sql`. Al cambiar la forma de los datos, agregar un SQL nuevo y actualizar los mappers de `src/lib`.
