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

`docs/cotizacion/Cotizacion-Tonorosa.pdf`, generado desde `cotizacion-tonorosa.html` con Chrome sin interfaz (páginas de 108 × 228 mm, formato celular).

Para regenerarlo:

```
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 "--print-to-pdf=<ruta>\Cotizacion-Tonorosa.pdf" "file:///<ruta>/cotizacion-tonorosa.html"
```

| # en el PDF | Opción | Valor | Mensualidad |
|---|---|---|---|
| 1 | Tienda completa (lo que pidió): panel, descuentos y códigos, carrito con pago Wompi, pedidos con estados, correos automáticos | 4.300.000 | 100.000 |
| 2 | Catálogo con carrito por WhatsApp: panel, descuentos en prendas, carrito que envía el pedido a WhatsApp, códigos de descuento | 2.500.000 | 70.000 |
| 3 | Catálogo autogestionable: panel (productos, colecciones, tallas, carrusel, guía de tallas, ocultar y mostrar), descuentos en prendas | 1.800.000 | 60.000 |
| 4 | Catálogo de la primera propuesta: Johan sube los cambios | 500.000 | 80.000 solo en meses con cambios (hasta 20 productos; adicionales a 4.000 c/u) |

**Todas incluyen:**
- Diseño del borrador, pensado primero para celular.
- Carrusel, catálogo con buscador y colecciones (destacada y filtro).
- Guía de tallas, Nosotros y Contacto.
- SEO básico, vista previa al compartir el enlace y contador de visitas.

**Solo para Johan (no va en el PDF):**
- Valor de mercado aproximado: 6–9 M, 3,8–5,5 M, 3–4,5 M y 1,5–2,2 M, en el orden de la tabla.
- Tarifa de referencia: 40–60 mil COP/h.

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
- **Inventario:** en las opciones 2–4 no hay cantidades; las prendas se marcan agotadas. En la opción 1 se le pregunta si quiere stock fijo o sobre pedido.
- **Códigos de descuento:** solo con carrito, porque se validan y se calcula el total antes de enviar.
- **Dominio:** `tonorosa.com`, comprado por Libia a su nombre, con renovación automática. Verificar que esté disponible.
- **Wompi:** Plan Avanzado (2,65 % + 700 + IVA). La cuenta la abre Libia con su RUT. Confirmar que no cobre afiliación.
- **Factura electrónica de la DIAN:** fuera del sistema.

## Pendientes

- Verificar que tonorosa.com esté disponible.
- Confirmar con Wompi que no cobra costo de afiliación.
- Enviar la cotización y esperar qué opción elige.
- Después: pedirle el material (logo, textos, fotos, guía de tallas y datos de las prendas) y planear la entrega por fases para el 26 de octubre.
