# Versiones del diseño — Tonorosa (opción 1)

Guía para revisar el rediseño de la tienda y comparar con cómo estaba antes. Todo está en la rama `main`.

## Qué revisar

La página pasó por un rediseño en 5 fases, a partir de una auditoría de diseño (`docs/rediseno-tienda.md`):

1. **Encabezado y menú:** barra de una sola línea, buscador que no empuja la página y menú del celular con las colecciones y WhatsApp.
2. **Inicio:** carrusel con marco y panel claro, beneficios en tarjetas y colecciones a la misma altura.
3. **Catálogo:** filtros activos que se quitan con ×, filtros con opciones para tocar y tarjetas de prenda nuevas.
4. **Ficha de producto:** galería con miniaturas, tallas más claras, vista previa del mensaje de WhatsApp y barra fija en el celular.
5. **Pie de página y página 404:** pie en tres columnas y 404 con el encabezado y el pie de la tienda.

Conviene revisarla en celular, tablet y computador.

## Cómo ver cada versión

En la carpeta del proyecto, desde la terminal:

| Para ver… | Comando |
|---|---|
| Cómo estaba **antes** del rediseño | `git switch --detach antes-del-rediseno` |
| El **rediseño completo** | `git switch --detach rediseno-completo` |
| Lo **más actual** de la rama | `git switch main` |

Con el servidor de desarrollo encendido (`npm run dev -- -H 0.0.0.0 -p 3001`), la página se actualiza sola al cambiar de versión. Se abre en el computador en http://localhost:3001 y en un celular de la misma red Wi-Fi en http://192.168.1.4:3001.

Para dejar de comparar, siempre se vuelve con `git switch main`. Cambiar de versión no borra nada.

## Capturas

En el computador de Johan, en `D:\personal-projects\evidencia-tonorosa\`:

- **Antes del rediseño:** `tienda-opcion-1 2026-11-19 12h18` (todas las pantallas en 1366, 768 y 390 px, con `LEEME.md` y la documentación).
- **Después:** `rediseno-fase-1`, `rediseno-fase-2`, `rediseno-fase-3`, `rediseno-fases-4-5` y `catalogo-filtros-movil`.

Los textos, las fotos y las prendas son datos de prueba; las fotos reales llegan después.

## Historial de cambios

Del más antiguo al más nuevo:

| Commit | Cambio |
|---|---|
| `bc4afc5` | Tienda completa (opción 4) con mejoras de diseño. Respaldo en la rama `opcion-4-tienda-completa`. |
| `395f0bb` | Recorte a la opción 1: solo catálogo y consulta por WhatsApp (sin carrito, pagos, panel, Nosotros, Contacto, guía de tallas ni políticas). |
| `182d64e` | Actualización de Next.js a 16.4.6 por seguridad. |
| `0a39ee5` | Botones en rosado coral como en el borrador. |
| `a5530a6` | Flores en acuarela en lugar de las hechas con código. ← **`antes-del-rediseno`** |
| `803141e` | Fase 1: encabezado compacto y menú lateral con colecciones. |
| `5b5259a` | Logo más grande y botón × en el buscador. |
| `1054317` | Fase 2: inicio con carrusel enmarcado, beneficios y colecciones parejas. |
| `190849b` | Carrusel más compacto en el celular. |
| `99ad50b` | Precios sin corte entre el `$` y el número. |
| `dbd2e53` | Fase 3: catálogo con filtros activos y tarjetas nuevas. |
| `09050d7` | Filtros activos compactos en el celular. |
| `9f65b47` | Fase 4: ficha de producto. |
| `c2c0346` | Fase 5: pie de página en tres columnas y página 404. |
| `2bc867b` | Más espacio entre los enlaces del pie en tablet. |
| `38fd887` | Catálogo en el celular sin filas de chips y filtros sin repetir. ← **`rediseno-completo`** |
