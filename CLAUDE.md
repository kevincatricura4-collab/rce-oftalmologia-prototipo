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

Hecho: andamiaje del proyecto, tokens y tema claro/oscuro, pantalla de ingreso por rol con
usuarios de prueba, especificación y sistema de diseño.

Pendiente, en este orden:

1. `lib/`: tipos completos, plantillas de tipo de atención, datos de prueba (agenda de unos
   diez pacientes según sección 11 de la especificación) y estado de las consultas.
2. Layout con barra lateral por rol y encabezado; componentes base.
3. Pantalla 4 — examen por ojo, tipo glaucoma (la central del informe). Luego catarata y
   consulta general sobre la misma plantilla.
4. Pantalla 1 — agenda. Pantalla 2 — pre-atención.
5. Pantallas 3, 5, 6 y 7 — resto del flujo de consulta, con documentos imprimibles.
6. Pantalla 8 — historial. Pantalla 9 — reportes. Pantalla 10 — administración.
7. Publicación en GitHub Pages: workflow que compile y despliegue `dist/` al unir a `main`.
   Kevin debe activar Pages en Settings → Pages → Source: GitHub Actions.

## Git

Trabajar en rama y abrir pull request hacia `main`. Commits en español, en imperativo corto.
