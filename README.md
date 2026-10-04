# rce-oftalmologia-prototipo

Proyecto de Título, Informática Biomédica, Duoc UC.

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

## Documentación

- [Especificación del prototipo](docs/especificacion.md): roles, requerimientos, pantallas,
  plantillas, modelo de datos.
- [Sistema de diseño](design-system/MASTER.md): colores, tipografía y convenciones clínicas.

## Tecnología

React, TypeScript, Vite y Tailwind CSS. El sistema completo contempla backend en Python con
FastAPI y base de datos PostgreSQL, con el modelo de datos homologado a recursos HL7 FHIR.

Sistema de diseño elaborado con [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (licencia MIT).
