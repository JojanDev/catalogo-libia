# Rediseño de la tienda pública (opción 1)

Resumen de la auditoría de diseño hecha sobre las capturas de la tanda `tienda-opcion-1 2026-11-19 12h18` (34 vistas en 1366, 768 y 390 px). Se implementa por fases; cada fase pasa por ui-ux → frontend → QA y termina en un commit.

## Adaptaciones obligatorias al proyecto

- Colores solo con los tokens de `src/app/globals.css` (nada de `bg-[#...]`; excepción el verde de WhatsApp). La propuesta original traía hex sueltos y otros valores de salvia: se usan los tokens existentes.
- Sin comentarios en el código nuevo, Server Components salvo necesidad, `import type`, alias `@/`.
- Botones principales: fondo `rosa-boton` con texto `cafe-oscuro` (decidido por el usuario).
- Instagram `@tonorosa`: queda como texto, **sin enlace**, hasta confirmar el perfil real.
- Alcance de la opción 1: no hay página índice de colecciones, Nosotros, Contacto ni carrito. No inventar campos de datos nuevos (por ejemplo, `SlideCarrusel` no tiene `etiqueta`).
- Conservar: nombre y logo (`public/logo-tonorosa.svg`), flores en acuarela (`public/decor/*.png`), fuentes Marcellus / Dancing Script / Nunito, rutas y query params (`/`, `/catalogo?q&coleccion&categoria&min&max`, `/colecciones/[slug]`, `/producto/[slug]`), el mensaje de WhatsApp, los tipos de `src/types/index.ts`, metadatos Open Graph y JSON-LD.

## Problemas detectados

1. **Encabezado:** en 1366 px la franja de anuncio, el logo de 96 px y la navegación debajo suman más de 150 px de alto; la lupa queda aislada arriba a la derecha y al abrir el buscador se inserta un bloque que empuja la navegación (salto de diseño).
2. **Menú lateral (390 y 768 px):** solo Inicio y Catálogo; más del 75 % del panel vacío, sin colecciones ni canales de contacto.
3. **Carrusel:** el degradado inferior café (`from-cafe/70`) oscurece la estética pastel; bajo 1024 px desaparecen las flechas; la imagen va a sangre sin marco. Al tocar, `onTouchStart` pausa la rotación y nada la reanuda.
4. **Nuestras colecciones:** la destacada (16:9) queda más baja que las secundarias (4:5) en 390 y 768 px; en 1366 px la fila queda desnivelada.
5. **Beneficios en móvil:** 3 columnas estrechas parten cada frase en tres líneas.
6. **Catálogo:** en 390 px los chips se cortan en el borde (“Pequeños Sueño”) sin señal de desplazamiento; el modal usa `<select>` nativos; no hay vista de filtros activos removibles; `min > max` o `?min=abc` vacían la grilla sin aviso.
7. **Tarjetas:** bloque inferior grande para solo nombre y precio; el agotado en escala de grises fría desentona con la paleta.
8. **Producto:** en 390 px la barra fija parte “Consultar por WhatsApp” en dos líneas; en 1366 px las miniaturas quedan debajo de la imagen; los acordeones son texto plano.
9. **Pie y 404:** el pie centra todo en una columna estrecha sobre un bloque rosa alto; la 404 no tiene encabezado ni pie y su botón secundario dice “Ver colección” aunque va a `/catalogo`.

## Especificación por fase

### Fase 1: encabezado y menú lateral
- Escritorio (≥1024 px): una sola barra de unos 80 px en grilla de 3 columnas: navegación a la izquierda (Inicio, Catálogo), logo centrado (más compacto que hoy pero legible), acciones a la derecha: buscador que se expande en su sitio o como superposición **sin desplazar el contenido** y acceso “Asesoría” a WhatsApp.
- Móvil y tableta (<1024 px): barra de unos 64 px con menú, logo centrado y lupa; el buscador abierto no debe mover la página bruscamente.
- Menú lateral: Inicio y Catálogo, sección “Nuestras colecciones” con las colecciones activas (la destacada marcada) que llevan a `/colecciones/[slug]`, y al pie un botón “Atención por WhatsApp”, “Envíos a toda Colombia” e `@tonorosa` como texto. Los datos (colecciones, whatsapp) llegan desde `src/app/(tienda)/layout.tsx`.
- Franja de anuncio: se conserva, más compacta.

### Fase 2: inicio
- Carrusel con marco suave (bordes redondeados, sin degradado oscuro pesado), texto legible sobre un velo cálido claro, botón principal y controles (puntos y flechas) visibles en todos los tamaños; `onTouchEnd` reanuda la rotación. Respetar las proporciones por tamaño y `urlMovil`.
- Beneficios: 1 columna en móvil (tarjetas horizontales con ícono en círculo `rosa-suave`), 3 columnas desde md.
- Colecciones: grilla de 12 columnas en lg (destacada 6, demás 3) con altura igualada; en móvil y tableta alturas coherentes.
- “Recién llegado” con el enlace “Ver todo”.

### Fase 3: catálogo, filtros y tarjetas
- Chips con degradado lateral que indique desplazamiento en móvil.
- Barra de filtros activos removibles sobre la grilla (búsqueda, colección, tipo, precio) con “Limpiar todo”.
- Modal de filtros con píldoras táctiles en lugar de `<select>`; si `min > max` se intercambian antes de navegar; valores no numéricos se ignoran.
- Tarjeta: imagen 4:5 con zoom sutil, etiqueta de colección arriba, categoría en micro-etiqueta, nombre y precio con `tabular-nums`; agotado con tono cálido desaturado (sepia leve y opacidad) en lugar de gris; evitar que el lector de pantalla lea dos veces el nombre.
- `formatearPrecio` con espacio de no separación entre `$` y el número.

### Fase 4: ficha de producto
- Galería: medios ordenados por `orden` (respaldo `producto.imagen`), miniaturas verticales a la izquierda en lg, contador `1 / N` en móvil.
- Tallas con estado claro y opción de quitar la selección.
- Vista previa del mensaje de WhatsApp que se actualiza al elegir talla.
- Barra fija móvil de una sola línea: precio a la izquierda, botón a la derecha sin partirse.
- Sellos de confianza (envíos, WhatsApp) y acordeones con mejor jerarquía.

### Fase 5: pie de página y 404
- Pie en 3 columnas desde md (marca y frase; explorar con inicio, catálogo y colecciones; atención con WhatsApp y `@tonorosa` como texto), rematado por la ola.
- 404 con encabezado y pie de la tienda; botón secundario “Explorar catálogo”.
