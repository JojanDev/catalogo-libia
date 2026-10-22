# Plan: migración a Next.js — tienda completa Tonorosa by Leyar

## Contexto

Libia eligió la **tienda completa** (catálogo, panel, carrito, pago con Wompi, pedidos). La cotización ya está cerrada (`docs/cotizacion/`, `decisiones.md`).

**Fechas:**
- Toma de fotos: 25–26 de octubre.
- Fotos entregadas: hacia el 30–31 de octubre.
- **Meta:** lanzar una versión usable entre el 1 y el 3 de noviembre y completar el resto después.

**Stack:**
- Next.js App Router.
- Supabase: datos, un solo usuario administrador, RLS.
- Cloudinary: fotos y videos, con subida firmada.
- Wompi Web Checkout: la firma de integridad y el webhook van en rutas de Next.js.
- Resend: correos.
- Netlify: hosting.

**Plan B de lanzamiento:** si Wompi no está aprobado, se publica con el pedido enviado por WhatsApp. Se controla con la variable `PAGOS_WOMPI_ACTIVO` y el pedido queda registrado igual.

**Hallazgos de la revisión del código que el plan corrige:**
- **Seguridad:**
  - `pedidos` permite que cualquiera lea los datos de las clientas e inserte pedidos con totales falsos.
  - Los códigos promocionales se pueden listar.
  - Cualquier usuario autenticado puede escribir todo.
  - `productos` y `colecciones` no tienen RLS.
- **Errores en el prototipo:**
  - El mapper de tallas descarta todas las tallas. PostgREST devuelve un objeto, no un arreglo (`Prototipo2Page.tsx:16-19`, `Prototipo3Page.tsx:27-30`).
  - Los descuentos vencen a las 7 p. m. del día anterior, por la zona horaria UTC (`src/lib/pricing.ts`).
  - Las tallas se ordenan como texto.
  - Borrar una colección la elimina de verdad, en vez de inactivarla.
  - Solo se aplica el primer descuento de cada producto.
- **Faltan:** tablas de carrusel, guía de tallas, galería y video, configuración e ítems de pedido; datos de pago en `pedidos`; subida de imágenes (hoy se pega una URL); persistencia del carrito.

## Enfoque

- **Respaldo y rama:** crear la etiqueta `prototipo-vite` sobre `main` como respaldo y trabajar en la rama `migracion-nextjs`, en esta misma carpeta.
- **Andamiaje con `create-next-app`, no con Vite:**
  1. Generarlo en una carpeta temporal (fuera del repositorio) con `npx create-next-app@latest tonorosa-base --ts --tailwind --app --src-dir --import-alias "@/*" --eslint --use-npm`.
  2. Copiar al repositorio la configuración que genera: `package.json` (scripts y dependencias), `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`, `src/app/layout.tsx` y `globals.css`.
  3. Mover el código reutilizable a la nueva estructura y borrar los archivos de Vite.

  `create-next-app` no se ejecuta en esta carpeta porque no acepta carpetas con archivos.
- **Tailwind 4** (el que trae `create-next-app`): los tokens de Tonorosa se definen con `@theme` en `globals.css` y desaparece `tailwind.config.js`. Como la paleta es nueva de todos modos, no hay nada que migrar.
- **Versiones:** si Next o TypeScript 6 fallan con Netlify, se fija la versión anterior.
- **Prototipos:** se trasladan y se eliminan. Los `Admin*.tsx` pasan a `src/components/admin/`, y los mappers y filtros a `src/lib/`. Se borran `features/landing`, `prototipo-2`, `prototipo-3`, `checkout`, `useHashRoute`, `App.tsx`, `main.tsx`, `index.html` y `vite.config.ts`.
- **Datos:**
  - Las páginas públicas son componentes de servidor que leen con el cliente anónimo y se actualizan cada 300 s.
  - El panel usa *server actions*. Cada una verifica `requerirAdmin()` y luego llama `revalidatePath`.
  - Las rutas API son solo para el checkout, la validación de códigos, el webhook de Wompi y la firma y el borrado en Cloudinary.
- **Variables de entorno:**
  - Públicas: `NEXT_PUBLIC_*`.
  - Secretas: service role de Supabase, llaves de Cloudinary y Wompi y Resend. Nunca son públicas y se importan solo en archivos marcados `server-only`.

**Estructura:**
```
src/proxy.ts (sesión en /admin)
src/app/
  layout.tsx, globals.css, sitemap.ts, robots.ts, not-found.tsx
  (tienda)/  page (inicio) · catalogo · colecciones/[slug] · producto/[slug] · guia-de-tallas · nosotros · contacto · checkout · pedido/[referencia]
  admin/     login · (panel)/ con guardia: productos · colecciones · tallas · carrusel · guia-tallas · descuentos · codigos · pedidos · configuracion
  api/       checkout · promo/validar · wompi/webhook · cloudinary/firma · cloudinary/eliminar
src/lib/     supabase/{navegador,servidor,publico,servicio} · auth/requerirAdmin · datos/* · mappers · pricing · formato · slug · pedidos/cotizar · wompi · cloudinary · correo
src/components/ tienda/ · carrito/ · admin/ · compartidos/
src/context/CartContext.tsx · src/types/index.ts
```

## Orden de trabajo (decidido por el usuario): primero un mockup funcional en Next.js

**Etapa A, mockup funcional (22–27 oct).** Antes de conectar servicios reales se construyen en Next.js todas las pantallas definitivas con **datos falsos**: tienda pública, carrito y checkout, y panel de administración. El usuario las revisa y, al aprobarlas, se conectan a los datos reales sin rehacer nada.

- **Capa de datos intercambiable.** Todas las pantallas leen y escriben solo a través de `src/lib/datos/*` (por ejemplo, `obtenerProductosActivos()`, `guardarProducto()`). En la etapa A esas funciones usan un almacén en memoria del servidor sembrado con datos de ejemplo (`src/lib/mock/semilla.ts`: unas 3 colecciones, unas 16 prendas con tallas, carrusel, guía de tallas, descuentos, códigos y pedidos de ejemplo). En la etapa B se reemplaza por Supabase **manteniendo las mismas firmas**.
- **Panel funcional:** las server actions modifican el almacén en memoria, así que crear, editar, inactivar, destacar y cambiar estados se refleja en la tienda.
  - Funciona de forma consistente con `npm run dev` en local.
  - En la vista previa de Netlify los cambios pueden reiniciarse; para revisar la navegación sirve igual.
- **Login simulado:** una contraseña de prueba (variable `MOCK_ADMIN_PASSWORD`) y una cookie, con la misma guardia `requerirAdmin()` que usará la versión real.
- **Fotos:** imágenes de relleno locales en `public/mock/` (proporción 4:5, paleta Tonorosa) más el logo. Sin Cloudinary todavía. El subidor del panel acepta archivos y los muestra con una URL local de vista previa.
- **Pago simulado:** el checkout crea el pedido en memoria y lleva a `/pago-simulado/[referencia]` con los botones "Aprobar" y "Rechazar", que imitan el retorno de Wompi y el webhook. El modo WhatsApp funciona igual que en la versión final.
- **Sin correos:** las notificaciones se registran en consola.
- **Incluye todas las pantallas de las tareas** 1.2–1.6, 1.8, 1.11, 1.12, 2.3 y 2.6, más el carrito persistente (2.1) y la cotización en el servidor (`cotizar.ts`, 2.2) sobre los datos falsos.
- **Revisión:**
  - El usuario navega en local y en celular (`npm run dev -- -H 0.0.0.0` en su red, o vista previa de Netlify).
  - Se itera el diseño con el agente `ui-ux`.

**Diseño del mockup:**
- **El diseño visual sale directamente de `docs/borrador_libia.jpeg` y del logo**, no de la interfaz del prototipo. Del prototipo solo se reutilizan la lógica y el comportamiento (carrito, filtros, formularios). Sus estilos se descartan por completo: paleta naranja y crema, fuente Comfortaa, `tailwind.config.js`.
- **Del borrador se toman:**
  - La franja de anuncio.
  - El encabezado con el logo centrado.
  - La navegación Inicio · Colección · Tallas · Nosotros · Contacto.
  - El hero con frase manuscrita.
  - Los 4 beneficios.
  - La bienvenida con el botón "Descubrir colección".
  - Las flores y los corazones.
- **Ajustes acordados:** quitar el ícono de usuario y versión móvil primero.
- **Pantallas que el borrador no muestra** (catálogo, producto, carrito, checkout, confirmación, guía, nosotros, contacto): `ui-ux` las define con el mismo lenguaje visual.
- **El panel** usa la misma paleta y fuentes, pero más sobrio y funcional.

**Etapa B, conexión real (27–31 oct).** Comprende:
- SQL de migración y nuevo proyecto Supabase.
- Clientes de Supabase y RLS.
- Implementación Supabase de `src/lib/datos/*`.
- Login real.
- Cloudinary: firma, subida directa y borrado.
- Wompi: Web Checkout en sandbox y webhook.
- Resend.
- Variables en Netlify.

Las tareas 0.3, 0.4, 0.6, 1.7, 1.9, 1.10 (sobre Supabase), 2.4 y 2.5 pasan a esta etapa.

## Inventario antes de migrar

**Respaldo general:** etiqueta `prototipo-vite` sobre `main`, con todo el estado actual. Además se copia este plan a `docs/plan-migracion-nextjs.md` para que quede en el repositorio y se pueda usar desde Claude Code en la web.

| Destino | Archivos |
|---|---|
| **Se conservan tal cual** | `.git/`, `.claude/agents/*`, `docs/` (borrador, logo, cotización HTML/PDF, `decisiones.md`), `supabase-*.sql`, `wokflow.md`, `.env` (solo local) |
| **Se conservan y se actualizan** | `CLAUDE.md` (pasa a Next.js), `.env.example` (variables nuevas), `.gitignore` (agregar `.next`, `.netlify`) |
| **Se reutilizan y adaptan** | `src/context/CartContext.tsx`, `src/lib/pricing.ts`, `src/types/index.ts`, `src/constants/index.ts`, `src/data/categorias.ts`; la lógica de `src/components/shared/*` y `src/components/cart/*`; `src/features/prototipo-3/Admin*.tsx` y `hooks/useSupabaseSession.ts`; los mappers y filtros de `Prototipo2Page.tsx`/`Prototipo3Page.tsx`; `src/features/checkout/CheckoutPage.tsx` |
| **Se reemplazan por la plantilla de Next** | `package.json`, `package-lock.json`, `tsconfig.json`, `postcss.config.js` |
| **Se borran** | `index.html`, `vite.config.ts`, `tailwind.config.js`, `AGENTS.md` (obsoleto), `src/main.tsx`, `src/App.tsx`, `src/style.css`, `src/hooks/useHashRoute.ts`, `src/assets/*`, `public/icons.svg`, `src/features/landing`, `prototipo-2`, `prototipo-3` y `checkout` (después de extraer lo útil), `dist/`, `node_modules/` (se reinstala) |

**Fuera del repositorio, no se afecta:** la conversación y la memoria (`~/.claude/projects/...`) y este archivo de plan (`~/.claude/plans/...`).

## Base de datos: `supabase-migration-nextjs.sql` + `supabase-limpiar-demo.sql`

Se recomienda un **proyecto Supabase nuevo**, "tonorosa", con los 5 archivos aplicados y luego la limpieza de los datos de demostración. Los archivos SQL solo se escriben; los ejecuta Johan en el editor SQL de Supabase.

- **Administración:** tabla `administradores` y función `is_admin()`.
- **colecciones:** `activa`, `destacada` (solo una a la vez), `orden`, slug único.
- **productos:**
  - `slug` único, `coleccion_id` como llave foránea, `agotado`, `orden`.
  - Precio en enteros.
  - Activar RLS.
- **Tablas nuevas:**
  - `producto_medios`: galería de fotos y video.
  - `carrusel`.
  - `guia_tallas` (una sola fila, tabla en JSON).
  - `configuracion`: envío, WhatsApp, correo de avisos, modo de inventario `sobre_pedido`/`stock_fijo`, texto del anuncio.
  - `descuento_colecciones`.
  - `pedido_items`.
- **tallas:** `orden` y `activa`. **producto_tallas:** `agotado` (se conserva `stock`).
- **codigos_promo:** vencimiento, usos máximos, usos y monto mínimo.
- **pedidos:**
  - Datos nuevos: email, ciudad, departamento, notas.
  - Montos: subtotal, envío, código, descuento.
  - Pago: `referencia` única, id y estado de Wompi, `pagado_at`, `correo_enviado_at`.
  - Estados: `pendiente_pago/pagado/enviado/entregado/cancelado`.
- **RLS reescrito:**
  - Lectura pública solo de lo activo.
  - Escritura solo con `is_admin()`.
  - `pedidos`, `pedido_items` y `codigos_promo` sin acceso anónimo. Los pedidos se crean solo desde el servidor con el service role.
- **Pasos manuales en Supabase:** desactivar los registros nuevos en Auth, crear la usuaria administradora, insertarla en `administradores` y configurar la Site URL.

## Tareas (B = backend, F = frontend, U = ui-ux; ★ = mínimo para el lanzamiento)

Se sigue el flujo de `CLAUDE.md`: el orquestador delega, los agentes independientes van en paralelo y QA revisa al cerrar cada bloque.

### Fase 0: preparación (22–23 oct)

| # | Quién | Tarea |
|---|---|---|
| 0.1★ | Orquestador | Etiqueta + rama; actualizar `CLAUDE.md` y `.claude/agents/*` a Next.js (rutas, server actions, tokens nuevos, verificación con `next build`). |
| 0.2★ | B | Montar Next: `package.json`, `next.config.ts` (Cloudinary), `tsconfig` (alias `@/`), `postcss`/`tailwind`, `netlify.toml`, `.env.example`, layout raíz; borrar los archivos de Vite. |
| 0.3★ | B | Clientes de Supabase (navegador, servidor, público, servicio), `proxy.ts`, `requerirAdmin`. |
| 0.4★ | B | Archivos SQL de migración y limpieza. |
| 0.5★ | U | Lineamientos Tonorosa a partir del borrador y el logo (detalle abajo). |
| 0.6★ | Johan | Supabase nuevo y SQL aplicado; cuentas de Cloudinary, Netlify (sitio ligado a la rama), Resend, Wompi sandbox y Cloudflare Analytics. |

**Detalle de 0.5:**
- **Colores:**
  - Rosa de fondo, rosa suave, rosa de acento.
  - Taupe `#A99883`, solo para títulos grandes y el logo.
  - Café para el texto, por contraste.
  - Salvia.
- **Fuentes:** Marcellus, una cursiva y Nunito.
- **Componentes base:** anuncio, encabezado, tarjeta 4:5, botones, separador con corazón, beneficios.

### Fase 1: tienda pública y panel (23–29 oct)

| # | Quién | Tarea |
|---|---|---|
| 1.1★ | B | Tipos nuevos; `mappers.ts` único con las correcciones; `pricing.ts` (zona Bogotá, mayor descuento entre producto y colección, pesos enteros); `datos/catalogo.ts`. |
| 1.2★ | F | Tokens y fuentes; layout de la tienda (anuncio, encabezado con menú móvil, pie de página, carrito, WhatsApp); quitar los 9 usos de rutas con `#`. |
| 1.3★ ∥ | F | Inicio: carrusel (imagen o video), beneficios, bienvenida, colección destacada, novedades. |
| 1.4★ ∥ | F | Catálogo: el servidor carga los datos y el cliente filtra (búsqueda, colección, categoría, precio, todo en la URL); tarjeta 4:5 con marca "Agotado". |
| 1.5★ ∥ | F | `/producto/[slug]`: galería, tallas (las agotadas deshabilitadas), agregar al carrito, metadatos y vista previa del enlace. Reemplaza `ProductModal`. |
| 1.6★ ∥ | F | Colección, guía de tallas, nosotros, contacto, 404. |
| 1.7★ ∥ | B | SEO: `metadataBase`, `sitemap`, `robots`, `revalidate`, script de analítica. |
| 1.8★ | B | Login del panel con contraseña y guardia del panel. |
| 1.9★ | B+F | Cloudinary: la ruta de firma (solo admin) y el componente `SubidorMedios`, que **sube directo desde el navegador**, porque Netlify limita el tamaño de lo que pasa por sus funciones. Loader `f_auto,q_auto`. |
| 1.10★ | B | Server actions: productos, colecciones (inactivar, destacar), tallas, carrusel, guía, configuración. Al reemplazar un archivo se borra el anterior en Cloudinary. |
| 1.11★ ∥ | F | Pantallas del panel: adaptar las existentes (`AdminProductoForm`, etc.) y crear tallas, carrusel, guía y configuración. Las firmas de las acciones se acuerdan antes, para que B y F trabajen en paralelo. |
| 1.12 | B+F | Descuentos por producto o colección y códigos promocionales en el panel. ★ si al lanzar hay promociones. |

### Fase 2: carrito, checkout, pagos y pedidos (27–31 oct)

| # | Quién | Tarea |
|---|---|---|
| 2.1★ | B | `CartContext`: carrito guardado en el navegador, códigos validados en `/api/promo/validar`, totales solo informativos. |
| 2.2★ | B | Ver el detalle debajo de la tabla. |
| 2.3★ ∥ | F | `/checkout`: formulario y resumen, con botón "Pagar" o "Enviar por WhatsApp". `/pedido/[referencia]`: confirmación con número de pedido. |
| 2.4 | B | Webhook de Wompi: verifica el checksum y el monto, no repite el proceso si llega dos veces, cambia el pedido a pagado o cancelado y envía los correos una sola vez. |
| 2.5★ ∥ | B | Correos con Resend: "nuevo pedido" para la tienda y "confirmación" para la clienta. |
| 2.6★ ∥ | B+F | Pedidos en el panel: lista por estado, detalle, cambio de estado, WhatsApp de la clienta. |

**Detalle de 2.2:**
- **`cotizar.ts`:** el servidor recalcula precios, descuentos, código y envío.
- **`/api/checkout`:**
  - Crea el pedido y sus ítems en `pendiente_pago`, con una referencia no adivinable.
  - Devuelve la URL de Web Checkout con la firma `SHA256(ref+centavos+COP+secreto)`, o la URL de WhatsApp.
- **`lib/wompi.ts`.**

**Lanzamiento (30 oct–3 nov):**
- Todo lo marcado con ★, en modo WhatsApp si Wompi no está aprobado.
- Carga de las fotos reales desde el panel.
- DNS de tonorosa.com en Netlify, variables de producción y Site URL en Supabase.
- Dominio verificado en Resend.
- Wompi se activa cambiando la variable y las llaves.

### Fase 3: después del lanzamiento

- Stock fijo con descuento de unidades en una transacción.
- Enlace mágico y recuperación de contraseña.
- Limpieza programada de archivos huérfanos.
- Borrar las columnas heredadas.
- Búsqueda y exportación de pedidos y número de guía de envío.
- Migrar a R2 si hace falta.
- Ajustes de diseño y capacitación a Laura.

## Archivos clave y código a reutilizar

- **Lógica:**
  - `src/context/CartContext.tsx`: reductor del carrito.
  - `src/lib/pricing.ts`.
  - `src/types/index.ts`.
- **Mappers y consultas:**
  - `Prototipo3Page.tsx:26-80` (mappers).
  - `Prototipo3Page.tsx:104-137` (carga).
  - `Prototipo3Page.tsx:200-360` (escrituras; leer con `offset`).
  - `Prototipo2Page.tsx:59-234` (filtros).
- **Componentes:**
  - Panel: `src/features/prototipo-3/Admin*.tsx`.
  - Tienda: `src/components/shared/*`, `src/components/cart/*`.
  - Checkout: `src/features/checkout/CheckoutPage.tsx`.
- **Diseño:** `docs/borrador_libia.jpeg`, `docs/Logo_Tonorosa.svg`.
- **SQL de referencia:** `supabase-migration-relational.sql`, `supabase-migration-descuentos.sql`.

## Verificación

- **Fase 0:**
  - `npm run build` en verde y vista previa de Netlify funcionando.
  - Prueba de RLS con la anon key. Leer o insertar `pedidos`, leer `codigos_promo`, ver productos inactivos y escribir en `productos` deben fallar.
- **Fase 1:**
  - Revisión en un celular real y a 375 px: catálogo, filtros, producto, inactivo = 404.
  - Panel: crear, editar, inactivar y reactivar cada cosa; subir foto y video; al reemplazar un archivo, el anterior se borra en Cloudinary.
  - SEO: `<title>` y `og:*`, `sitemap.xml`, `robots.txt`, vista previa en WhatsApp, Lighthouse SEO ≥ 90.
- **Fase 2:**
  - Alterar precios en la petición no cambia el total.
  - Pagos en sandbox:
    - Tarjeta `4242…` aprobada → `pagado` + correos.
    - Tarjeta `4111…` rechazada → `cancelado`.
    - Nequi sandbox.
  - Webhook: un checksum alterado da 401; un evento repetido no duplica nada.
  - Modo WhatsApp: el pedido se registra y abre `wa.me`.
- **Lanzamiento:** compra real de bajo monto cuando Wompi esté activo en producción.
