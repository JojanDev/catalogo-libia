# Lineamientos de diseño — Tonorosa by Leyar

Fuente visual: `docs/borrador_libia.jpeg`. Logo: `docs/Logo_Tonorosa.svg` (taupe #A99883). Mobile-first (base 360px). Tailwind 4 con tokens en `@theme` (`--color-*`), fuentes con `next/font/google`, íconos `lucide-react`.

## 1. Color

| Token | Hex | Uso |
|---|---|---|
| canvas | #FFF9F8 | fondo general |
| surface | #FFFFFF | tarjetas, modales, inputs |
| rosa-suave | #FCE8EC | franjas: anuncio, beneficios, hero, pie |
| rosa-medio | #F7D3DC | chips, skeleton, fondos de íconos |
| rosa-deco | #E8849F | solo decoración: corazones, líneas, íconos, subrayado del menú activo. Nunca texto |
| rosa-accion | #B84A6E | botón primario, enlaces, "Tonorosa" manuscrito, precio con descuento |
| rosa-hover | #A33D60 | hover del primario |
| taupe | #A99883 | solo logo y títulos decorativos ≥24px |
| cafe | #5A4636 | texto principal |
| tenue | #7A6657 | texto secundario (no sobre rosa-medio) |
| salvia | #8FA37E | hojas, decoración |
| borde | #F0D9DE | bordes |

**Estados (fondo/texto):** éxito #E6F2E4/#3F6B48 · error #FDECEA/#B3261E · aviso #FFF4D6/#8A5A00 · info #E8EEF7/#2F4F7A.

**Contrastes AA verificados:** cafe/canvas 8.6 · cafe/rosa-suave 7.5 · tenue/canvas 5.2 · blanco/rosa-accion 4.9. El rosa del botón del borrador (rosa-deco con texto blanco) no cumple; el botón usa rosa-accion. Foco visible: outline 2px rosa-accion, offset 2px.

**Insignias de pedido:** pendiente_pago = aviso · pagado = éxito · enviado = info · entregado = éxito · cancelado = error.

## 2. Tipografía

- **Display:** Marcellus 400 (títulos, sin negrita simulada).
- **Manuscrita:** Dancing Script 500/600, solo frases cortas ≥32px. Nunca para información ni botones.
- **Cuerpo:** Nunito 400/600/700.
- **Escala móvil/escritorio:** h1 32/48 · h2 26/36 · h3 20/24 · cuerpo 16/17 (inputs nunca <16) · pequeño 14 · etiqueta 12 Nunito 700 mayúsculas tracking 0.08em · manuscrita 40/64.

## 3. Forma y espaciado

- Radios: sm 8 (inputs, chips) · md 16 (tarjetas, imágenes) · lg 24 (hero, modales) · full (botones, badges).
- Sombras: card `0 2px 12px rgba(184,74,110,.08)`; elevada `0 8px 32px rgba(90,70,54,.14)`.
- Secciones py-12 / py-20; gutters px-4 / px-6 / px-8; grilla de productos gap 12 / 24; contenedor max-w 1200. Objetivos táctiles ≥44px.

## 4. Componentes

- **Anuncio:** rosa-suave, h-9, 13px cafe, "Moda infantil que hace florecer sonrisas" con corazones rosa-deco.
- **Encabezado** sticky (canvas, borde inferior). Móvil: hamburguesa · logo centrado (h-10) · búsqueda y carrito (badge rosa-accion). Escritorio: logo centrado h-16, nav debajo (Inicio · Colección · Tallas · Nosotros · Contacto, 15px/600, activo con subrayado rosa-deco y `aria-current`). Sin ícono de usuario. Menú lateral móvil desde la izquierda (85%, máx 320), overlay, Esc y foco atrapado.
- **Pie:** rosa-suave con ola SVG superior, logo, enlaces, WhatsApp y redes, "© Tonorosa by Leyar".
- **Botones** píldora h-12 px-6 Nunito 700: primario rosa-accion/blanco (hover rosa-hover); secundario borde rosa-accion; texto rosa-accion. Deshabilitado rosa-medio/tenue. Cargando con `Loader2` y `aria-busy`.
- **Tarjeta de producto:** surface, rounded-md, sombra card; imagen 4:5; nombre 2 líneas; precio 16/700. Descuento: precio rosa-accion + original tachado + badge "-20%" arriba a la izquierda. Agotado: imagen al 60%, badge "Agotado" cafe arriba a la derecha; sigue enlazando.
- **Selector de talla:** botones ≥44px, seleccionado rosa-accion/blanco; agotada tachada, borde discontinuo, no seleccionable. Enlace "Guía de tallas".
- **Separador:** línea rosa-deco 160px con corazón centrado.
- **Beneficios:** rosa-suave, 2×2 en móvil, 4 columnas en escritorio; íconos 32px rosa-deco (Heart, Shirt, Truck, ShieldCheck).
- **Carrusel:** móvil 4:5 o 1:1 con titular sobre degradado; escritorio 16:7; puntos, flechas solo escritorio, swipe, autoplay 6s (pausa al tocar, apagado con reduced-motion); video mute/loop/playsInline con póster.
- **Campos:** label arriba 14/600; input h-12, 16px, rounded-sm; foco rosa-accion; error con `AlertCircle` y `aria-describedby`.
- **Cajón del carrito:** derecha, 100% móvil / 420px; "Tu carrito (n)"; ítems con miniatura 4:5, talla, −/+, `Trash2`; pie con subtotal, "El envío se calcula al finalizar", "Ir a pagar" y "Seguir viendo".
- **WhatsApp flotante:** 56px, #25D366, `MessageCircle` blanco, abajo a la derecha; sube sobre barras fijas.

## 5. Pantallas (móvil, en orden)

- **Inicio:** anuncio, encabezado, carrusel, beneficios, bienvenida ("Bienvenidas a" + "Tonorosa" manuscrita + separador + texto + "Descubrir colección"), colecciones (scroll horizontal), novedades (2 col), banner de guía de tallas, pie.
- **Catálogo:** h1, buscador, chips de colección y categoría, botón "Filtros" (hoja inferior con precio, colección, categoría), contador, grilla 2 col, "Cargar más".
- **Colección:** portada rosa-suave con nombre y descripción, grilla con filtros.
- **Detalle:** migas, galería swipe 4:5, nombre, precio, descripción, tallas + guía, cantidad, barra fija "Agregar al carrito", acordeones (Detalles, Cuidados, Envíos), "También te puede gustar".
- **Carrito:** ítems, código de descuento, resumen, "Ir a pagar", estado vacío.
- **Checkout:** una página: contacto, dirección (departamento, ciudad, barrio, indicaciones), resumen colapsable, método de pago, "Confirmar pedido".
- **Pago simulado:** franja aviso "Modo de prueba: no se realiza ningún cobro real", resumen, "Pago exitoso" / "Pago fallido".
- **Confirmación:** `CheckCircle2` salvia, "¡Gracias por tu compra!", número de pedido, resumen, WhatsApp con el pedido, "Seguir comprando".
- **Guía de tallas:** tabla con scroll horizontal (edad, talla, pecho, cintura, largo en cm), cómo medir, CTA WhatsApp.
- **Nosotros:** hero corto, historia, 3 valores, CTA. **Contacto:** WhatsApp, correo, horario, redes.
- **404:** flor, "Esta página se perdió en el jardín", "Ir al inicio" y "Ver colección".
- **Panel:** canvas sin flores, Nunito (Marcellus solo en h1), tarjetas surface con borde, botones h-10. Móvil con menú lateral; escritorio sidebar 240px.
  - Login: tarjeta max-w 400, logo, correo, contraseña con mostrar/ocultar.
  - Resumen: métricas (pedidos pendientes, ventas del mes, agotados), últimos pedidos, accesos rápidos.
  - Listas: título + "Nuevo", búsqueda/filtros; tabla en escritorio, tarjetas en móvil; acciones con confirmación.
  - Formularios: 1 columna móvil / 2 en lg, secciones en tarjetas, subida con vista previa 4:5, barra fija "Guardar"/"Cancelar", toast de éxito. Carrusel ordenable con flechas.
  - Detalle de pedido: número, fecha, estado (selector), cliente, envío, ítems, totales, "Contactar por WhatsApp".

## 6. Microcopy (tuteo)

- "Agregar al carrito", "Ir a pagar", "Seguir comprando", "Descubrir colección", "Confirmar pedido", "Aplicar", "Guardar cambios".
- Carrito vacío: "Tu carrito está vacío. Mira nuestra colección y encuentra algo bonito para tu peque."
- Sin resultados: "No encontramos prendas con esos filtros. Prueba con otros o limpia los filtros."
- "Elige una talla para continuar" · "Ese código no es válido o ya venció" · "¡Listo! Agregamos la prenda a tu carrito" · "Algo salió mal. Inténtalo de nuevo en un momento".
- Panel: "Aún no hay productos. Crea el primero para verlo en la tienda." · "Cambios guardados".

## 7. Ilustraciones

SVG propios simples en `src/components/decor/` (flor de 5 pétalos rosa-deco con centro #F2B880, rama salvia, corazón, mariposa), `aria-hidden`, solo en hero, bienvenida, 404 y pie, a los costados, reducidos u ocultos en pantallas pequeñas. Componente `<Decor variant>` que pueda recibir más adelante los recursos de la clienta. El panel no lleva decoración.
