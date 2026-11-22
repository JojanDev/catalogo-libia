# Decisiones de la cotización — Tonorosa by Leyar

Resumen de lo acordado al preparar la cotización (octubre de 2026). Sirve como contexto para retomar el trabajo en otra sesión o computador.

## Contexto

- Clienta: Libia (tía de Johan). Marca: **Tonorosa by Leyar**, ropa infantil. Usa sobre todo el celular.
- Paga su hijo, que vive en EE. UU. Se cotiza en COP, como para una empresaria colombiana.
- Laura (25–30 años) administrará el panel.
- Lanzamiento de la colección: **26 de octubre de 2026**. Para esa fecha solo es realista una versión inicial (catálogo con el diseño del borrador y botón de WhatsApp). El resto se entrega por partes después.
- Borrador de diseño: `docs/borrador_libia.jpeg`. Logo: `docs/Logo_Tonorosa.svg`.
- Primera propuesta enviada antes (con video del prototipo): 500.000 COP + 80.000 COP/mes solo en meses con cambios, hasta 20 productos.

## Cotización entregada

`docs/cotizacion/Cotizacion-Tonorosa.pdf`, generado desde `cotizacion-tonorosa.html` con Chrome o Edge sin interfaz (páginas de 108 × 228 mm, formato celular; 12 páginas, una por sección).

Para regenerarlo (con Edge, cambiar la ruta por `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`):

```
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 "--print-to-pdf=<ruta>\Cotizacion-Tonorosa.pdf" "file:///<ruta>/cotizacion-tonorosa.html"
```

Las opciones van de menor a mayor, en tarjetas con el precio grande. Cada una dice "Todo lo de la opción N, más:" y lista solo lo que agrega.

| # en el PDF | Opción | Agrega | Valor | Mensualidad |
|---|---|---|---|---|
| 1 | Catálogo (primera propuesta) | Diseño del borrador para celular, catálogo con buscador y detalle, colecciones (destacada y filtro), carrusel, WhatsApp por prenda, SEO básico con vista previa al compartir, publicación. Johan sube los cambios | 500.000 | 80.000 solo en meses con cambios (hasta 20 productos; adicionales a 4.000 c/u) |
| 2 | Catálogo con carrito por WhatsApp | Nosotros, Contacto, guía de tallas, contador de visitas, Perfil de Empresa en Google, carrito que envía el pedido a WhatsApp, descuentos con fecha de fin, códigos de descuento. Johan sigue subiendo los cambios | 1.800.000 | 90.000 solo en meses con cambios |
| 3 | Catálogo autogestionable | Panel: productos, colecciones, tallas y agotados, ocultar y mostrar, carrusel, guía de tallas, descuentos y códigos; subida de fotos; capacitación | 3.500.000 | 80.000 |
| 4 | Tienda completa (lo que pidió) | Wompi, número de pedido y comprobante por correo, aviso a Libia por pedido, pedidos con estados, cantidades o sobre pedido, plantillas de políticas | 5.000.000 | 120.000 |

La tarjeta 4 lleva el argumento de venta: vende 24 h, la clienta paga apenas se decide, no hay que confirmar transferencias a mano, y una persona atendiendo WhatsApp cuesta más de 1 M al mes.

**Solo para Johan (no va en el PDF):**
- Valor de mercado aproximado, en el orden de la tabla: 1,5–2,2 M, 2,8–3,8 M, 4–5,8 M y 6–9 M.
- Estimación de horas por nivel: 35–45 h, +20–25 h, +35–45 h y +35–45 h.
- Tarifa de referencia: 40–60 mil COP/h. Tope acordado: 5 M.

**Decisiones de redacción del PDF:**
- Sin tiempos de entrega.
- Sin costos de trabajo adicional: "se cotiza aparte".
- Sin límite de rondas de ajustes.
- Sin valor de mercado.
- Fotos descritas como "verticales 4:5", sin píxeles.

## Decisiones técnicas

- **Datos:** Supabase guarda los datos, el login del panel (un solo usuario, sin módulo de usuarios) y las URL de los archivos. RLS obligatorio.
- **Archivos:**
  - Cloudinary para fotos y videos, con compresión automática; se sube desde el mismo panel.
  - Hay que firmar las subidas y borrar los archivos huérfanos con una Edge Function.
  - Si se supera el plan gratis de Cloudinary, migrar a Cloudflare R2 en vez de pagar el plan Plus (89 USD).
- **Hosting:** Netlify o Cloudflare Pages. El plan gratis de Vercel (Hobby) no permite uso comercial.
- **SEO:** migrar de rutas `#/` a URLs reales con prerenderizado (Next.js), en la misma carpeta y en una rama.
- **Productos y colecciones:** se inactivan en lugar de eliminarse, y se pueden reactivar desde el panel.
- **Inventario:** en las opciones 1–3 no hay cantidades; las prendas se marcan agotadas. En la opción 4 se le pregunta si quiere stock fijo o sobre pedido.
- **Perfil de Empresa en Google:** desde la opción 2. Lo crea Johan y Libia lo verifica (video o código); como negocio con zona de entregas.
- **Códigos de descuento:** solo con carrito, porque se validan y se calcula el total antes de enviar.
- **Dominio:** `tonorosa.com`, comprado por Libia a su nombre, con renovación automática. Verificar que esté disponible.
- **Wompi:** Plan Avanzado (2,65 % + 700 + IVA). La cuenta la abre Libia con su RUT. Confirmar que no cobre afiliación.
- **Factura electrónica de la DIAN:** fuera del sistema.

## Pendientes

- Verificar que tonorosa.com esté disponible.
- Confirmar con Wompi que no cobra costo de afiliación.
- Enviar la cotización y esperar qué opción elige.
- Después: pedirle el material (logo, textos, fotos, guía de tallas y datos de las prendas) y planear la entrega por fases para el 26 de octubre.
