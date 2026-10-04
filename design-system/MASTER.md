# Sistema de diseño — RCE Oftalmología

Fuente de verdad del diseño. Generado con el skill **UI UX Pro Max** (`.claude/skills/ui-ux-pro-max`)
y ajustado al contexto clínico. Si una pantalla necesita desviarse, se documenta en
`design-system/pages/<pantalla>.md` y esa regla manda sobre este archivo.

## Origen de las decisiones

| Dimensión | Resultado del skill | Aplicación |
|---|---|---|
| Tipo de producto | Patient Portal / Health Records (#182) | Registro clínico de uso profesional |
| Estilo | Trust & Authority + Accessible & Ethical; secundario Minimalism | Sobrio, plano, alto contraste, sin decoración |
| Densidad | Data-Dense Dashboard | Tablas y formularios compactos: 20 a 30 pacientes por jornada |
| Color | Clinical blue + health green + alert red | Tokens de abajo |
| Tipografía | Medical Clean: Figtree + Noto Sans | Figtree en títulos, Noto Sans en texto y datos |
| Íconos | Phosphor (`@phosphor-icons/react`) | Un solo peso (regular) por nivel |

**Anti-patrones del skill para salud:** colores neón, animación abundante, degradados
morado/rosa "de IA", e información transmitida solo por color.

## Tokens de color

Definidos en `src/index.css` como variables CSS y expuestos a Tailwind con `@theme inline`.
Las pantallas usan **solo clases de token** (`bg-surface`, `text-fg-muted`, `border-line`…),
nunca hex ni colores de la paleta por defecto de Tailwind.

| Token | Clase | Claro | Oscuro | Uso |
|---|---|---|---|---|
| canvas | `bg-canvas` | `#F0F9FF` | `#06141D` | Fondo de la aplicación |
| surface | `bg-surface` | `#FFFFFF` | `#0C2130` | Tarjetas, tablas, campos |
| muted | `bg-muted` | `#E8F2F8` | `#12303F` | Encabezados de tabla, paneles secundarios |
| fg | `text-fg` | `#082F49` | `#E6F3FB` | Texto principal |
| fg-muted | `text-fg-muted` | `#475569` | `#A3BCCC` | Texto secundario, etiquetas |
| line | `border-line` | `#CFE3EF` | `#1D4155` | Divisores y bordes de tarjeta |
| line-strong | `border-line-strong` | `#6B8CA3` | `#5D889F` | Borde de campos (contraste 3:1) |
| primary | `bg-primary` `text-primary` | `#0369A1` | `#38BDF8` | Acción principal, enlaces, selección |
| primary-hover | `bg-primary-hover` | `#075985` | `#7DD3FC` | Hover de la acción principal |
| primary-soft | `bg-primary-soft` | `#E0F2FE` | `#0B3A52` | Fondo de elemento seleccionado |
| on-primary | `text-on-primary` | `#FFFFFF` | `#04202E` | Texto sobre primary |
| ok / ok-soft | `text-ok` `bg-ok-soft` | `#15803D` / `#DCFCE7` | `#4ADE80` / `#0F3A23` | Completo, cerrado, dentro de meta |
| warn / warn-soft / warn-line | `text-warn` `bg-warn-soft` `border-warn-line` | `#92400E` / `#FEF3C7` / `#D97706` | `#FCD34D` / `#3B2A07` / `#D97706` | Dato faltante, SIC incompleta, pendiente |
| danger / danger-soft | `text-danger` `bg-danger-soft` | `#B91C1C` / `#FEE2E2` | `#FCA5A5` / `#4A1616` | Error, valor fuera de rango, acción destructiva |
| od / od-soft | `text-od` `bg-od-soft` | `#0369A1` / `#E0F2FE` | `#7DD3FC` / `#0B3A52` | Ojo derecho |
| oi / oi-soft | `text-oi` `bg-oi-soft` | `#0F766E` / `#CCFBF1` | `#5EEAD4` / `#0C3B38` | Ojo izquierdo |
| ring | `outline-ring` | `#0284C7` | `#7DD3FC` | Foco de teclado |

El azul primario del skill (`#0284C7`) con texto blanco da 4,1:1, bajo el mínimo AA. Por eso
el botón usa `#0369A1` (5,9:1) y `#0284C7` queda solo para el anillo de foco.

### Modo box oscuro

La lámpara de hendidura y el fondo de ojo se hacen con la luz baja, y una pantalla blanca
encandila. El tema oscuro (`data-theme="dark"` en `<html>`) existe por eso. Toda pantalla se
revisa en ambos temas antes de darla por terminada.

## Tipografía

| Rol | Fuente | Tamaño | Peso |
|---|---|---|---|
| Título de pantalla | Figtree (`font-display`) | 22–24 px | 700 |
| Título de sección | Figtree | 16–18 px | 600 |
| Texto y campos | Noto Sans (`font-sans`) | 15–16 px | 400 |
| Etiqueta de campo | Noto Sans | 13 px | 500 |
| Celda de tabla | Noto Sans | 14–15 px | 400 |
| Valor clínico | Noto Sans, `tabular-nums` | 15–16 px | 500–600 |

- Nada por debajo de 13 px.
- Las fuentes se empaquetan con Fontsource (`@fontsource-variable/*`). **No usar Google
  Fonts por CDN**: el sistema corre en intranet, sin salida a internet.
- Números con coma decimal (0,5) y siempre `tabular-nums` para que las columnas OD/OI alineen.

## Espaciado y forma

- Ritmo de 4/8 px. Relleno de tarjeta 16–20 px; separación entre secciones 24 px.
- Fila de tabla 40–44 px; campo de formulario 40 px de alto.
- Radio 8 px en tarjetas y 6 px en campos y botones. Sin sombras decorativas: las tarjetas
  se separan con borde `line`. Sombra solo en capas flotantes (menú, modal).
- Barra lateral 240 px, encabezado 56 px. Bajo 1024 px la barra lateral se colapsa.
- Diseñado para escritorio de box (1366×768 en adelante) y usable en tablet. Sin
  desplazamiento horizontal de página; las tablas anchas se desplazan dentro de su contenedor.

## Convenciones clínicas

1. **OD a la izquierda, OI a la derecha, siempre.** Columnas fijas, con la sigla en el
   encabezado. El color (`od` / `oi`) acompaña, nunca reemplaza a la sigla.
2. **Origen del dato visible.** Un valor que viene de la pre-atención lleva la etiqueta
   "desde pre-atención"; uno que viene de la SIC, "desde SIC".
3. **Dato faltante ≠ error.** Lo que falta se marca en ámbar (`warn`) con ícono y texto. Rojo
   (`danger`) solo para errores y valores fuera de rango.
4. **Obligatorio por estado.** No hay asteriscos rojos en todo el formulario. Lo exigido para
   cerrar se lista en el paso de cierre.
5. **Estado con ícono + texto.** En espera, con pre-atención, en atención, cerrado: cada uno
   con su ícono; nunca un punto de color solo.
6. **Autoría visible.** Cada bloque registrado muestra quién y a qué hora.
7. **Marca "Datos de prueba"** siempre visible en el encabezado.

## Componentes

- **Botón primario:** uno por pantalla (la acción que avanza el flujo). Secundario con borde.
  Destructivo en `danger`, separado del primario.
- **Campo:** etiqueta visible arriba, nunca solo placeholder. Borde `line-strong`. Error bajo
  el campo, con `role="alert"`.
- **Tabla por ojo:** primera columna el campo, luego OD y OI de igual ancho. Encabezado fijo
  si la tabla es larga.
- **Selector segmentado:** para tipo de atención y lateralidad (OD / OI / AO).
- **Pasos de la consulta:** pestañas numeradas con marca de completo o pendiente.
- **Aviso:** franja con ícono, título corto y qué hacer. Ámbar para faltantes, azul para
  información, verde para confirmación.
- **Documento imprimible:** receta, orden, contrarreferencia y resumen comparten una hoja
  con membrete del hospital, datos del paciente, cuerpo, autor y fecha.

## Movimiento

Transiciones de 150–200 ms solo en color y opacidad. Sin animaciones de entrada, sin
parallax, sin desplazamiento animado. Se respeta `prefers-reduced-motion`.

## Lista de control antes de entregar una pantalla

- [ ] Contraste de texto ≥ 4,5:1 y de bordes de campo ≥ 3:1, en claro y en oscuro
- [ ] Foco visible en todo elemento interactivo; orden de tabulación igual al visual
- [ ] Todo campo con etiqueta asociada; botones de solo ícono con `aria-label`
- [ ] Ninguna información depende solo del color
- [ ] OD a la izquierda y OI a la derecha, con sigla
- [ ] Sin emojis como íconos; íconos Phosphor del mismo peso
- [ ] Sin hex ni colores fuera de los tokens
- [ ] Funciona a 1366×768 y a 768 px de ancho sin desplazamiento horizontal
- [ ] El rol que no corresponde no ve la pantalla ni el dato
