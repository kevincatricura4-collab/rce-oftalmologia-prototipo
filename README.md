# rce-oftalmologia-prototipo


Prototipo de alta fidelidad del **módulo de consulta médica oftalmológica** de un Registro
Clínico Electrónico para un hospital de la red pública de salud. Estructura el examen por ojo
(OD / OI), codifica el diagnóstico en CIE-10, emite recetas y órdenes de examen, y devuelve la
contrarreferencia al establecimiento de origen, sobre tres tipos de atención: consulta
general, catarata y glaucoma.

Es un prototipo navegable con **datos de prueba ficticios**. No tiene backend ni guarda
información de pacientes reales.

## Cómo ejecutarlo

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Para generar la versión estática:

```bash
npm run build
```

Para comprobar las reglas de emisión de documentos, sincronización de catarata y resultados
posteriores al cierre:

```bash
npm test
```

El examen muestra primero los campos del registro completo y permite desplegar los
adicionales. Los borradores guardados siguen disponibles. Los resultados recibidos después
del cierre se agregan desde **Indicaciones → orden emitida → Resultados posteriores al cierre**.
Se conserva la consulta original y cada incorporación tiene autor y fecha.

## Documentación

- [Especificación del prototipo](docs/especificacion.md): roles, requerimientos, pantallas,
  plantillas, modelo de datos.
- [Sistema de diseño](design-system/MASTER.md): colores, tipografía y convenciones clínicas.

## Tecnología

### Blueprint

La interfaz completa utiliza `@blueprintjs/core` **6.21.0**: navegación, tarjetas,
formularios, pestañas, tablas, estados y diálogos. Los adaptadores del dominio están en
`src/components/ui.tsx`; los estilos de Blueprint se cargan por capas desde `src/index.css`
y se ajustan en `src/blueprint.css`.

El tema oscuro utiliza `bp6-dark` en `html`, incluidos los portales. `OverlaysProvider`
administra el menú móvil y los diálogos. Los documentos se imprimen en negro sobre blanco.
No se requieren CDN ni instalaciones globales. El sistema de diseño está documentado en
`design-system/MASTER.md`.

La instalación y `npm ci --dry-run` finalizan correctamente, aunque npm advierte que la
dependencia interna `react-popper@2.3.0` declara React hasta la versión 18. No se forzaron
versiones ni se ocultó la advertencia. Los componentes utilizados (Drawer, Dialog, Alert, formularios y pestañas) se verificaron
en navegador con React 19; cualquier uso futuro de otros componentes emergentes requiere su prueba. La compilación y las pruebas del prototipo pasan con Blueprint instalado.

`npm audit` también detecta un aviso de severidad alta en el Vite 8.3.2 que ya utilizaba el
proyecto; corresponde a las herramientas de desarrollo, no a un paquete nuevo de Blueprint.

React, TypeScript, Vite y Tailwind CSS. El sistema completo contempla backend en Python con
FastAPI y base de datos PostgreSQL, con el modelo de datos homologado a recursos HL7 FHIR.

Guías de usabilidad originales de [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (licencia MIT).
Íconos de [IBM Carbon](https://carbondesignsystem.com/elements/icons/library/) (licencia Apache-2.0, ver
[docs/licencias/carbon-icons-LICENSE](docs/licencias/carbon-icons-LICENSE)); la marca de cuatro E de Snellen es propia.
