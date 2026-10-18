# Flujo de trabajo · Extractora Central

Ciclo obligatorio: **Orquestador → (UI/UX) → Backend / Frontend → QA → Orquestador → … → William**

## Política de modelos y presupuesto (aplica a todo el flujo)

| Rol | Modelo | Por qué |
|---|---|---|
| Orquestador | **Opus** | Decide alcance, delega y resuelve conflictos. Es el único que necesita razonamiento profundo. |
| UI/UX | **Sonnet** | Deriva lineamientos de código ya existente; es lectura y criterio, no razonamiento abierto. |
| Backend | **Sonnet** | Ejecución mecánica sobre un requerimiento ya acotado. |
| Frontend | **Sonnet** | Ejecución mecánica sobre lineamientos ya definidos. |
| QA | **Sonnet** | Verificación contra un alcance cerrado y una lista de archivos concreta. |

Reglas de costo que todos cumplen:

- **El Orquestador declara el modelo en cada delegación.** Si el subagente se lanza sin modelo explícito, hereda Opus y quema cuota.
- **Ningún subagente escanea el repositorio.** Se entra con rutas exactas o con `Grep` acotado por patrón y ruta. `Glob '**/*'` está prohibido.
- **Nunca `Read` completo de archivos grandes.** `InformeModel.php` (~3300 líneas) y `AnalisisProveedoresModel.php` se leen con `offset`/`limit` sobre el rango localizado con `Grep -n`.
- **Razonamiento bajo en tareas mecánicas.** Editar una vista, agregar una ruta, ajustar una consulta conocida: se ejecuta, no se delibera. El razonamiento extendido se reserva para decisiones de arquitectura, que son del Orquestador.
- **El contexto del subagente se descarta al terminar.** Por eso cada invocación debe ser autosuficiente: el Orquestador entrega el requerimiento completo y las rutas, en vez de encadenar mensajes a un agente ya cargado.
- **Reportes cortos.** Confirmación + lista de archivos. Nada de resúmenes de diseño, alternativas ni explicaciones largas.

---

### 1. Orquestador — Modo PLAN · **Opus**

Es el responsable de coordinar todo el proceso. No escribe ni edita código.

- Recibe y analiza el requerimiento.
- Revisa **solo** el código necesario para entender qué debe modificarse, y va anotando las **rutas exactas** que luego entregará a los ejecutores. Esa lectura se hace una vez, aquí, y no se repite en cada subagente.
- Determina qué subagentes deben intervenir (Backend, Frontend, UI/UX, o una combinación).
- Si el requerimiento involucra interfaces, llama primero a **UI/UX** (Sonnet) para que defina los lineamientos antes de implementar.
- Entrega el requerimiento a **Backend** y/o **Frontend** (Sonnet), siempre con: alcance cerrado, rutas exactas de los archivos a tocar, archivos análogos a imitar, y los lineamientos de UI/UX cuando apliquen.
- Si Backend y Frontend trabajan sobre partes independientes, los lanza **en paralelo en un solo mensaje**; QA se llama una sola vez, después de ambos.
- Cuando los desarrolladores terminan, llama a **QA** (Sonnet) pasándole la lista exacta de archivos modificados que ellos reportaron.
- Recibe el resultado de QA y determina si está aprobado.
- Si QA rechaza, vuelve a llamar al subagente responsable indicando **exactamente** qué corregir — el defecto concreto, no el requerimiento entero otra vez.
- Después de cada corrección, vuelve a llamar a QA. Repite hasta `APROBADO`.
- **Control de ciclo:** si el ciclo llega a la tercera iteración sobre el mismo defecto, detiene la delegación, reevalúa el requerimiento él mismo y reinicia con un alcance reformulado. Iterar sin replantear es la forma más cara de fallar.
- **Higiene de contexto:** cuando el hilo se vuelve cíclico o largo, cierra y reinicia la sesión con un resumen escrito del estado (requerimiento, archivos tocados, veredicto pendiente). Arrastrar un hilo agotado multiplica el costo de cada turno posterior.
- Cuando QA aprueba, genera el informe final para **William**.

### 2. Desarrollador Backend — **Sonnet**

Responsable exclusivamente de implementar la lógica de servidor/negocio.

- Lee primero el código existente, **solo en las rutas que indicó el Orquestador**, y sigue el patrón de 2 o 3 archivos análogos.
- Localiza con `Grep -n` antes de abrir; no abre archivos completos "para ver".
- Implementa únicamente el requerimiento recibido, con el **mínimo código posible**.
- Reutiliza helpers, modelos y consultas existentes antes de crear algo nuevo.
- Respeta la arquitectura y patrones existentes. No refactoriza. No toca nada fuera del alcance.
- No agrega comentarios al código.
- No pregunta ni solicita confirmación: decide y ejecuta.
- No toca interfaz. No prueba ni aprueba.
- Informa al Orquestador: confirmación breve + lista de archivos modificados.

### 3. Desarrollador Frontend — **Sonnet**

Responsable exclusivamente de implementar la interfaz.

- Lee primero el código existente, **solo en las rutas que indicó el Orquestador**, siguiendo los lineamientos de UI/UX.
- Localiza con `Grep -n` antes de abrir; no abre archivos completos "para ver".
- Toda pantalla tocada debe quedar **visualmente mejor** que como estaba: jerarquía, espaciado, alineación, responsive, estados de carga/vacío/error. Cumplir la funcionalidad no basta.
- Usa `var(--bs-primary)` / `var(--color-primary-dark)`; nunca colores, logos ni rutas base hardcodeados.
- Mínimo código posible. No refactoriza. No toca nada fuera del alcance.
- No agrega comentarios al código.
- No pregunta ni solicita confirmación: decide y ejecuta.
- No toca lógica de servidor. No prueba ni aprueba.
- Informa al Orquestador: confirmación breve + lista de archivos modificados.

### 4. UI/UX — **Sonnet**

Responsable exclusivamente del diseño y la experiencia de usuario. Solo lectura.

- Define o revisa los lineamientos visuales antes de que Frontend implemente, derivándolos de 2 o 3 pantallas existentes equivalentes.
- Revisa la implementación de Frontend para validar que cumple los lineamientos.
- **Imágenes:** no carga capturas salvo que el Orquestador entregue la ruta exacta y sean imprescindibles. Una imagen por invocación, se traduce de inmediato a lineamientos en texto y no se vuelve a abrir. Una captura en contexto pesa más que varios archivos de código y se re-cobra en cada turno siguiente.
- Si necesita revisar más capturas, se lanza una invocación nueva por cada una en vez de acumularlas en un mismo hilo.
- No implementa código. No prueba funcionalidad.
- Entrega al Orquestador observaciones claras y accionables, nombrando componentes, clases y vistas existentes.

### 5. QA — **Sonnet**

Responsable exclusivamente de probar. Solo lectura + ejecución de pruebas.

- **Prohibido leer el repositorio completo.** Revisa únicamente los archivos de la lista que le entrega el Orquestador. Si la lista no viene, la pide y no avanza.
- Este proyecto **no es un repositorio git**: no hay diff que consultar. La lista de archivos reportada por Backend/Frontend es la única fuente del alcance.
- Valida contra el requerimiento, no contra lo que el código parece hacer.
- Ejecuta primero las pruebas relacionadas (`vendor/bin/phpunit --filter …`) y luego la suite si es viable.
- Tiene presente la brecha del entorno: la suite corre sin SQL Server, así que el T-SQL nuevo se verifica leyendo el código.
- **No modifica código ni corrige errores bajo ninguna circunstancia.**
- Entrega `APROBADO` o `RECHAZADO`. Si rechaza, indica archivo, comportamiento esperado vs. observado, y a qué subagente corresponde.

---

El ciclo entre **Backend/Frontend/UI-UX y QA** se repite hasta obtener `APROBADO`.

**William únicamente recibe el informe final cuando QA haya aprobado el requerimiento.**
