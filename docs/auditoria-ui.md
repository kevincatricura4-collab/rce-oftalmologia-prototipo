# Auditoría de interfaz y usabilidad

Revisión del prototipo contra la lista de control de `design-system/MASTER.md` y las guías del
skill UI UX Pro Max (accesibilidad, formularios, tablas, modo oscuro). Fecha: octubre de 2026.

## Método

| Revisión | Herramienta | Alcance |
|---|---|---|
| Accesibilidad automática | axe-core 4 (reglas WCAG 2.0, 2.1 y 2.2 A/AA y buenas prácticas) | 23 pantallas y estados, en tema claro y oscuro (46 pasadas), con los cuatro roles |
| Contraste | Cálculo WCAG sobre los tokens de `src/index.css` | 31 pares de color por tema: texto, bordes de campo, anillo de foco, estados |
| Teclado | Recorrido con Tab en Chromium | Ingreso, agenda, examen y cierre: orden, foco visible, trampas |
| Ancho de pantalla | Chromium a 390, 768, 1024 y 1366 px | Nueve pantallas por ancho: desplazamiento horizontal y columnas OD/OI visibles |
| Flujo completo | Pruebas de punta a punta en Chromium, navegador en inglés | 40 comprobaciones: roles, precarga, plantillas, cierre, documentos, formatos |
| Revisión visual | Capturas en ambos temas | Las diez pantallas |

## Resultado

| Criterio de la lista de control | Estado |
|---|---|
| Contraste de texto ≥ 4,5:1 y de bordes de campo ≥ 3:1, en claro y oscuro | Cumple. Mínimos: texto 4,57:1 (verde sobre verde suave, claro); borde de campo 3,34:1 (claro) |
| Foco visible y orden de tabulación igual al visual | Cumple. Enlace "Saltar al contenido" como primer elemento |
| Campos con etiqueta; botones de solo ícono con nombre | Cumple (axe: 0 fallas) |
| Ninguna información depende solo del color | Cumple: estados, faltantes y PIO alta llevan ícono y texto |
| OD a la izquierda y OI a la derecha, con sigla | Cumple en todos los anchos; en teléfono la etiqueta sube y OD/OI siguen lado a lado |
| Sin emojis; íconos de un solo sistema | Cumple: IBM Carbon desde `components/iconos.tsx`, en 16 o 20 px |
| Sin hex fuera de los tokens | Cumple en componentes (los hex viven solo en `src/index.css`) |
| 1366×768 y 768 px sin desplazamiento horizontal | Cumple, también a 390 y 1024 px |
| El rol que no corresponde no ve la pantalla ni el dato | Cumple; el intento queda en el registro de accesos |

## Problemas encontrados y corregidos

| Problema | Corrección |
|---|---|
| Los `select` se veían deshabilitados (la regla de solo lectura los alcanzaba) | La regla se limita a `input` y `textarea` |
| Texto de ejemplo de los campos a 3,6:1 en tema claro | Usa `fg-muted` completo (7,6:1) y lleva "Ej.:"; desaparece en solo lectura |
| Borde ámbar de avisos a 2,9:1 en tema claro | Token `warn-line` claro pasa a `#B45309` (4,5:1) |
| Botón deshabilitado ilegible (2,2:1) | Estilo gris propio en vez de transparencia, con texto que explica cómo habilitarlo |
| Fechas y horas en formato del navegador (06/15/2026, 08:11 PM) | Campos de fecha (dd-mm-aaaa) y hora (24 h) propios, independientes del idioma |
| En teléfono la columna OI quedaba fuera de la vista | La tabla por ojo se reordena bajo 640 px |
| En teléfono la agenda escondía la columna de acción | Cada cita se vuelve tarjeta bajo 768 px |
| Texto para lector de pantalla ensanchaba la página en teléfono | Los contenedores con desplazamiento propio son el contexto de posición |
| Al pasar de paso, la página quedaba abajo | Al cambiar de pantalla se vuelve arriba y el foco pasa al contenido |
| Una lista de la SIC con estructura inválida (axe) | Corregida |
| La pestaña del navegador decía siempre lo mismo | Título por pantalla; con número de ficha, nunca con el nombre del paciente |
| "Copiar OD → OI" aparecía en AV y PIO | Solo en grupos descriptivos, definido en la plantilla (`copiarOdOi`) |
| Consulta cerrada mostraba campos vacíos con ejemplos | Solo lectura muestra lo registrado y dice lo que no se emitió |
| "El intento queda registrado" sin registrarse | El acceso denegado se escribe en el registro de accesos |

## Mejoras de uso (intuitividad)

- Ingreso con un recorrido sugerido de cinco pasos para quien evalúa el prototipo.
- Agenda con tarjeta "Siguiente paciente" según el rol, filtro por estado (franja segmentada con "Todos") y
  confirmación al volver de la pre-atención.
- Consulta con enlace de vuelta a la agenda, cita y estado visibles, y "Siguiente paciente" al
  cerrar.
- Pestaña de indicaciones marcada "opcional" o con el número de documentos emitidos, en vez de un
  visto bueno que sugería un paso obligatorio.
- Texto explícito de que cada cambio se guarda solo, además del botón "Guardar borrador".
- Dar de baja un usuario pide confirmación.

## Fuera de alcance de esta revisión

- Prueba con lector de pantalla real (NVDA o VoiceOver) y con usuarios clínicos.
- Medición de tiempos de registro frente a la ficha en papel (RNF-05).

## Segunda revisión: íconos y aspecto de plantilla

Kevin observó que los íconos "se veían hechos por IA". Un panel de tres propuestas de diseño
(clínica, técnica y crítica) y un juez definieron el cambio:

- **Íconos:** de Phosphor a IBM Carbon, el sistema de IBM para software empresarial y de salud. Se
  copian los dibujos con `scripts/generar-iconos.mjs` en vez de instalar `@carbon/icons-react`,
  porque ese paquete envía métricas de uso a IBM al instalarse en servidores de CI.
- **Marca:** cuatro E de Snellen (cartilla de E direccional) en vez del ojo en un cuadrado azul.
- **Estados por forma:** anillo punteado, cuña, mitad, check relleno; severidad también por forma
  (triángulo, hexágono, círculo tachado, círculo con i).
- **Patrones de plantilla eliminados:** íconos en cuadrados de color, tarjetas de indicador con
  ícono, pastillas de color en estados e insignias, grilla de tarjetas en el ingreso.

Tras el cambio se repitieron axe-core (0 fallas en claro y oscuro), las 40 comprobaciones de flujo,
el recorrido con teclado y los cuatro anchos de pantalla.

## Tercera revisión: tres revisores independientes

Tres revisores (anti-plantilla, clínico y de defectos visuales) juzgaron 31 capturas y cada
hallazgo se intentó refutar contra el código antes de corregirlo. Se descartó uno (mover el grupo
"Control" del examen) y se corrigieron estos:

| Hallazgo | Corrección |
|---|---|
| Las barras de Reportes no respetaban los valores (883 y 548 se veían iguales) | Largo proporcional al valor; diagnósticos a ancho completo |
| Gráficos de indicadores desalineados entre tarjetas | El gráfico va al pie de cada tarjeta |
| Radios del desenlace de distinto tamaño | El radio no se encoge cuando el texto ocupa dos líneas |
| A 390 px se cortaban el nombre del producto y las pestañas de pasos | Menos separación en el encabezado; las pestañas pasan a dos filas |
| Sigla del ojo separada de su valor ("OI" / "1,0") | Cada par sigla-valor no se corta |
| "Sin hallazgos" se confundía con un campo ya llenado | Casilla de verificación; no aparece en solo lectura |
| "Con pre-atención" y "En atención" casi iguales | "En atención" pasa a anillo con disco |
| La pestaña Examen se veía "sin empezar" con datos | Dice "faltan N"; Indicaciones dice "opcional" o "N doc." |
| Agenda con seis botones rellenos, filas altas y "Consulta en curso" equivocada | Un solo botón relleno, el nombre abre el historial, la consulta en curso es la última trabajada |
| La PIO solo se marcaba sobre 21 mmHg | En glaucoma se marca sobre la PIO objetivo de cada ojo |
| "Campos obligatorios" no impiden cerrar, pero no se decía | Nota explícita y un solo enlace al examen |
| Consulta cerrada con controles deshabilitados | Se muestra solo el valor registrado |
| Textos que explicaban el diseño al usuario | Eliminados o reducidos a lo que el usuario necesita |
| Celeste saturado en modo oscuro | `primary` oscuro pasa a `#6CB0E0` (7,1:1 con su texto) |

Tras los cambios: axe-core sin fallas en claro y oscuro, 64 comprobaciones de flujo, teclado y
cuatro anchos sin desplazamiento horizontal.
