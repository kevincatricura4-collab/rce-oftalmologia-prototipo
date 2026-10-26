# Sistema de diseño — RCE Oftalmología

Fuente de verdad de la interfaz. Por solicitud del usuario, la aplicación utiliza
**Blueprint 6.21.0**. Esta revisión sustituye las decisiones visuales previas, manteniendo
las convenciones clínicas y el alcance del prototipo.

## Componentes

| Función | Componente Blueprint | Integración |
|---|---|---|
| Acciones | Button | Adaptador `Boton`; variantes por intención y prioridad |
| Campos de texto | InputGroup, TextArea | Adaptadores `Entrada` y `AreaTexto` |
| Etiquetas y ayuda | FormGroup | Adaptador `Campo`; asociación label/id y errores accesibles |
| Listas de opciones | HTMLSelect | Adaptador `Seleccion` |
| Decisiones exclusivas | RadioGroup, Radio | Tipo de atención, lateralidad y desenlace |
| Opciones múltiples | Checkbox | Antecedentes, examen y configuración |
| Contenedores | Card | Tarjetas de perfiles, datos, documentos e indicadores |
| Avisos | Callout | Información, pendientes, confirmaciones y errores |
| Estados | Tag | Estados de citas, emisión de documentos y datos de prueba |
| Tablas | HTMLTable | Agenda, examen por ojo, historial, documentos y administración |
| Marco de aplicación | Navbar, Menu, MenuDivider | Barra superior y navegación por rol |
| Navegación móvil | Drawer | Foco, Escape, fondo modal y rótulo accesible |
| Pasos de consulta | Tabs, Tab | Panel activo ligado a la URL y navegación por teclado |
| Documentos | Dialog, DialogBody, DialogFooter | Vista previa, foco y retorno desde impresión |
| Reinicio de demostración | Alert | Confirmación explícita antes de restablecer datos |

Los adaptadores en `src/components/ui.tsx` conservan los contratos de los formularios.
Tailwind se utiliza para el layout responsivo, espaciado y convenciones clínicas; no es una
segunda biblioteca de controles. Los enlaces de navegación mantienen React Router y las clases
semánticas de Blueprint. Los gráficos SVG conservan su tabla de datos accesible.

## CSS y temas

- `src/index.css`: capas CSS y tokens semánticos claros/oscuros.
- `src/blueprint.css`: ajustes de layout, contraste, tipografía e impresión.
- Orden de capas: `theme → base → blueprint → components → utilities`.
- La clase `bp6-dark` se aplica a `html`, de modo que también heredan el tema los portales.
- `OverlaysProvider` administra los diálogos y el panel móvil.
- La barra superior es grafito en ambos temas; las superficies del contenido cambian de tema.
- Todas las fuentes, estilos e iconos se empaquetan; no se utilizan CDN.

| Token | Claro | Oscuro |
|---|---|---|
| canvas | `#f6f7f9` | `#1c2127` |
| surface | `#ffffff` | `#252a31` |
| muted | `#eef1f4` | `#2f343c` |
| fg | `#1c2127` | `#f6f7f9` |
| fg-muted | `#5f6b7c` | `#abb3bf` |
| line | `#dce0e5` | `#404854` |
| line-strong | `#738091` | `#738091` |
| primary | `#215db0` | `#8abbff` |

Usar tokens en las pantallas. Las intenciones de Blueprint identifican acciones y avisos;
no indicar un estado únicamente mediante color.

## Tipografía y densidad

- Noto Sans en campos y datos; Figtree en títulos. Fuentes locales de Fontsource.
- Texto general: 14 px; etiquetas, ayudas y estados: 13 px; títulos: 18–24 px.
- Controles de edición: 36 px; acciones principales: 40 px.
- Ritmo de espaciado de 4/8 px, tarjetas con 16–20 px de contenido y radio de 6 px.
- Barra superior: 56 px; lateral: 240 px. El menú se convierte en Drawer bajo 1024 px.
- Tablas anchas se desplazan dentro de su contenedor. En teléfono, la agenda y el examen
  conservan su presentación responsiva; no desplazar horizontalmente toda la página.
- No introducir animaciones decorativas. Mantener foco visible y respetar movimiento reducido.

## Convenciones clínicas

1. OD siempre a la izquierda, OI a la derecha, con sigla visible; el color es complementario.
2. Mantener visible la procedencia de los datos de pre-atención y SIC.
3. Los campos del registro completo permanecen visibles; los adicionales pueden desplegarse.
4. Borradores siempre permitidos. Validar al emitir documentos y al cerrar, según las reglas existentes.
5. Consulta cerrada en solo lectura. Resultados posteriores son anexos con autor y fecha.
6. Mantener roles, datos ficticios y marca permanente de datos de prueba.
7. Mantener iconos clínicos Carbon existentes y la marca de Snellen. Blueprint aporta sus iconos
   internos de control; no agregar otra biblioteca ni usar emojis como iconos.
8. Imprimir solo el documento, con texto y mediciones negros sobre blanco en ambos temas.

## Verificación

- Revisar todas las pantallas en claro y oscuro, y las pantallas clínicas a 1366, 768 y 375 px.
- Probar los cuatro roles y la restricción del historial del tecnólogo.
- Comprobar pestañas por teclado, asociación de etiquetas, foco de modales, Escape y retorno de impresión.
- Ejecutar `npm test` y `npm run build` antes de publicar cambios.
- La validación clínica y las pruebas con usuarios siguen pendientes.
