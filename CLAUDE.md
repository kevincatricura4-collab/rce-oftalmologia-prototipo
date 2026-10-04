# RCE Oftalmología — prototipo

Proyecto de Título de Kevin Catricura (Informática Biomédica, Duoc UC, 2026). Módulo de
registro clínico electrónico para la consulta oftalmológica de un hospital público chileno.
Este repositorio es el **frontend como prototipo de alta fidelidad**, navegable, con datos de
prueba y sin backend.

## Leer antes de construir

1. `docs/especificacion.md` — requisitos, las 10 pantallas con sus campos, plantillas por
   tipo de atención, modelo de datos, reglas de dominio y datos de prueba. Sale del informe
   de título, que no está en el repo.
2. `design-system/MASTER.md` — tokens, tipografía, convenciones clínicas y lista de control.
   Si existe `design-system/pages/<pantalla>.md`, esa regla manda sobre el MASTER.
3. `docs/referencia/figura-4-examen-glaucoma.png` — la pantalla de examen tal como aparece
   en el informe. La versión construida debe contener todo lo que muestra.

## Stack y comandos

React 19 + TypeScript + Vite + Tailwind CSS v4. Enrutado con `react-router-dom` (HashRouter).
Íconos Phosphor. Fuentes Figtree y Noto Sans empaquetadas con Fontsource.

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción en dist/
npm run typecheck
```

`npm run build` debe pasar antes de cada commit.

## Estructura

```
src/
  main.tsx            arranque, fuentes, proveedor de estado
  App.tsx             rutas y guardas por rol
  index.css           tokens de color (claro/oscuro) y @theme de Tailwind
  lib/tipos.ts        tipos del dominio (reflejan el modelo de datos)
  lib/store.tsx       sesión (usuario/rol) y tema; aquí crece el estado de las consultas
  lib/                datos de prueba, plantillas de tipo de atención, utilidades
  components/         piezas reutilizables (layout, tabla por ojo, campos, documentos)
  pages/              una carpeta o archivo por pantalla
design-system/        MASTER.md y excepciones por pantalla
docs/                 especificación y figuras de referencia
.claude/skills/       skill UI UX Pro Max (ver abajo)
```

## Reglas del proyecto

- **Idioma:** interfaz en español de Chile. Nombres de dominio en el código también en
  español (`paciente`, `consulta`, `hallazgo`, `lateralidad`), igual que el modelo de datos.
- **Datos:** todo ficticio y marcado como "Datos de prueba". Nunca nombres, RUN ni
  establecimientos reales.
- **Sin CDN externos:** el sistema final corre en intranet. Fuentes, íconos y librerías van
  empaquetados por npm.
- **Colores solo por token** (`bg-surface`, `text-fg-muted`, `border-line`, `text-od`…). Nada
  de hex en componentes ni de la paleta por defecto de Tailwind.
- **OD a la izquierda, OI a la derecha, siempre**, con la sigla visible.
- **Formulario de examen dirigido por plantilla:** los campos de cada tipo de atención salen
  de una definición de datos, no se escriben a mano por tipo (RNF-07).
- **Obligatorio por estado:** siempre se puede guardar borrador; lo exigido se valida al
  cerrar la consulta (RNF-06).
- **Acceso por rol** según la matriz de `docs/especificacion.md` sección 3. El administrador
  no ve datos clínicos; el tecnólogo ve solo AV y PIO del historial.
- **Modo claro y oscuro:** cada pantalla se revisa en ambos.
- Sin emojis como íconos. Sin animaciones más allá de transiciones de color de 150–200 ms.

## UI UX Pro Max

El skill está en `.claude/skills/ui-ux-pro-max/` (copiado del paquete MIT
`nextlevelbuilder/ui-ux-pro-max-skill`). El sistema de diseño ya está generado y guardado en
`design-system/MASTER.md`; **no regenerarlo**, construir con él. Usar el skill para consultas
puntuales (gráficos, guías UX, reglas del stack) antes de diseñar algo nuevo:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form validation table" --domain ux
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "trend comparison" --domain chart
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "state forms" --stack react
```

Antes de dar una pantalla por terminada, pasar la lista de control del MASTER.

## Estado

Hecho: las diez pantallas del informe, navegables por rol, con datos de prueba; tema claro y
oscuro revisados; documentos imprimibles; workflow de GitHub Pages (`.github/workflows/pages.yml`).
Kevin debe activar Pages en Settings → Pages → Source: GitHub Actions para que publique al unir a `main`.

Mapa del código:

- `lib/plantillas.ts`: plantillas de consulta general, catarata y glaucoma como datos. El
  formulario de examen (`components/FormularioExamen.tsx`) se dibuja desde aquí, y
  Administración → Plantillas agrega campos en caliente.
- `lib/datos.ts`: agenda de diez pacientes del Box 2 (jornada fija `FECHA_JORNADA` en
  `lib/formato.ts`), SIC, controles previos. `lib/store.tsx` guarda el recorrido en
  `localStorage` y se restablece desde la barra lateral.
- `lib/consulta.ts`: reglas de la consulta (estado de la cita, precarga desde pre-atención,
  lo que bloquea el cierre, campos pendientes, SIC incompleta, controles previos).
- `lib/reportes.ts`: simulación con semilla fija de seis meses para los tres indicadores.
- `pages/consulta/`: los cinco pasos de la consulta (pantallas 3 a 7).

Decisiones tomadas al construir (confirmar con Kevin):

- **Cierre en dos niveles.** Bloquea el cierre lo mínimo para que la consulta tenga sentido:
  motivo, diagnóstico principal con lateralidad, desenlace (y plazo / ojo a operar) e
  indicación de tratamiento. Los campos obligatorios del tipo de atención no bloquean: si
  faltan, se pide confirmación y la consulta queda marcada como incompleta. Si bloquearan,
  el indicador 1 (≥ 70 % completas) sería siempre 100 % y no mediría nada.
- La pre-atención exige al menos un valor para pasar a "Con pre-atención". Una vez abierta la
  consulta queda en solo lectura: el oftalmólogo corrige en el examen y el valor pierde la
  marca "desde pre-atención".
- Gráficos sin librería (`components/Graficos.tsx`): una serie por gráfico (OD y OI en
  gráficos separados), porque los tonos `od`/`oi` no se distinguen bien entre sí como par de
  series (validado con el skill dataviz).
- Los RUN de prueba están sobre 90 millones (rango no asignado).

Pendiente: revisión de Kevin y de un oftalmólogo; pruebas de usabilidad con el flujo real.

## Git

Trabajar en rama y abrir pull request hacia `main`. Commits en español, en imperativo corto.
