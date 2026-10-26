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

Está instalado `@blueprintjs/core` 6.21.0 (Blueprint 6), que declara soporte para React 19. Los componentes
actuales conservan el sistema de diseño del prototipo. Para incorporar componentes Blueprint
en una pantalla, importe el componente y su hoja de estilos:

```tsx
import { Button } from '@blueprintjs/core'
import '@blueprintjs/core/lib/css/blueprint.css'
```

La hoja de estilos contiene reglas globales: al incorporarla hay que revisar su convivencia
con Tailwind y los tokens clínicos. Para el tema oscuro, Blueprint utiliza la clase `bp6-dark`
en un contenedor. No se requieren CDN ni instalaciones globales.

La instalación y `npm ci --dry-run` finalizan correctamente, aunque npm advierte que la
dependencia interna `react-popper@2.3.0` declara React hasta la versión 18. No se forzaron
versiones ni se ocultó la advertencia. Antes de migrar ventanas emergentes, verificar esos
componentes con React 19. La compilación y las pruebas del prototipo pasan con Blueprint instalado.

`npm audit` también detecta un aviso de severidad alta en el Vite 8.3.2 que ya utilizaba el
proyecto; corresponde a las herramientas de desarrollo, no a un paquete nuevo de Blueprint.

React, TypeScript, Vite y Tailwind CSS. El sistema completo contempla backend en Python con
FastAPI y base de datos PostgreSQL, con el modelo de datos homologado a recursos HL7 FHIR.

Sistema de diseño elaborado con [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (licencia MIT).
Íconos de [IBM Carbon](https://carbondesignsystem.com/elements/icons/library/) (licencia Apache-2.0, ver
[docs/licencias/carbon-icons-LICENSE](docs/licencias/carbon-icons-LICENSE)); la marca de cuatro E de Snellen es propia.
