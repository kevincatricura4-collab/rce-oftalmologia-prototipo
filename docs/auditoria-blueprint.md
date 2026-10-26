# Revisión de la interfaz Blueprint 6.21.0

La interfaz utiliza los componentes reales de Blueprint, con adaptadores para conservar el
vocabulario de los formularios clínicos. Tailwind aporta el layout responsivo y los tokens
mantienen el significado de OD, OI, pendientes y errores.

## Cobertura

- Ingreso por perfiles con Card y Button.
- Barra superior Navbar; navegación Menu, panel móvil Drawer y confirmación de reinicio Alert.
- Agenda, pre-atención, historial y las cinco etapas de consulta.
- Formularios InputGroup, HTMLSelect, TextArea y FormGroup; RadioGroup y Checkbox.
- Pestañas Tabs vinculadas a la URL; tablas HTMLTable, avisos Callout y estados Tag.
- Reportes de jefatura y administración de usuarios, plantillas, catálogos y auditoría.
- Documentos con Dialog, DialogBody y DialogFooter; impresión en negro sobre blanco.

## Verificación realizada

- `npm test`: reglas de emisión de documentos, decisión de catarata y anexos posteriores.
- `npm run build`: comprobación de tipos y versión de producción.
- Recorrido clínico automatizado en Edge: conservación de datos al plegar campos, receta
  incompleta bloqueada y receta completa emitida, edición que requiere nueva emisión,
  sincronización del ojo de catarata, contrarreferencia validada y cierre con confirmación.
- Resultados añadidos tras el cierre: preservan la orden y la consulta originales, incluyen
  autor y fecha y sobreviven a una recarga.
- Los cuatro roles: acceso del oftalmólogo, vista restringida del tecnólogo, reportes de
  jefatura y administración sin ficha clínica. Edición de casillas en plantillas comprobada.
- Revisión de las pantallas clínicas en claro y oscuro a 1366 px; agenda, examen,
  indicaciones, cierre y reportes también a 768 y 375 px, sin desbordamiento horizontal de página.
- Tabs por teclado, Drawer con foco y Escape, diálogo con retorno de foco desde impresión,
  Alert cancelable y etiquetas asociadas a los campos.
- Documento de prueba impreso desde modo oscuro: valores de las celdas negros y aplicación
  oculta; menú móvil sobre la barra superior.
- No se observaron excepciones de ejecución en los recorridos de navegador.

## Límites

No sustituye una auditoría WCAG completa ni la validación clínica con un oftalmólogo. Los
permisos y el almacenamiento continúan siendo simulaciones locales. Los gráficos accesibles
existentes y sus tablas de datos se conservan; la marca y los iconos clínicos Carbon se
mantienen junto a los iconos internos de los controles Blueprint.

La advertencia de dependencia de `react-popper` documentada en README permanece; los
componentes usados en esta migración se probaron con React 19. No se cambió la versión de Vite.
