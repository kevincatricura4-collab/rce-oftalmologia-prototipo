// Genera src/components/iconos.tsx copiando el dibujo de los íconos IBM Carbon que usa el prototipo.
//
// Se copian los SVG en vez de depender de @carbon/icons-react porque ese paquete corre, al
// instalarse, un script que envía métricas a IBM (@ibm/telemetry-js) en servidores de CI y
// contenedores. Un sistema para la intranet de un hospital no debe tener esa dependencia.
//
// Para agregar o cambiar un ícono: editar ICONOS y correr
//   IBM_TELEMETRY_DISABLED=true npm install --no-save @carbon/icons-react@11
//   node scripts/generar-iconos.mjs
// Licencia de los dibujos: Apache-2.0, ver docs/licencias/carbon-icons-LICENSE.
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync } from 'node:fs'

const require = createRequire(import.meta.url)
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const carbon = require('@carbon/icons-react')
const version = JSON.parse(readFileSync(require.resolve('@carbon/icons-react/package.json'), 'utf8')).version

// Nombre en el prototipo → nombre en Carbon. Contorno para navegación y acciones; relleno para
// estado y severidad (design-system/MASTER.md).
const ICONOS = {
  // Navegación y marco
  IconoAgenda: 'EventSchedule',
  IconoHistorial: 'RecentlyViewed',
  IconoReportes: 'Analytics',
  IconoUsuarios: 'UserMultiple',
  IconoPlantillas: 'Template',
  IconoCatalogos: 'Catalog',
  IconoRegistroAccesos: 'DocumentView',
  IconoCambiarPerfil: 'Logout',
  IconoRestablecer: 'Reset',
  IconoMenu: 'Menu',
  IconoCerrar: 'Close',
  IconoModoOscuro: 'Asleep',
  IconoModoClaro: 'Light',
  IconoDatosPrueba: 'DataBase',
  // Estado de la cita: el relleno crece con el avance (anillo punteado, cuña, mitad, check)
  IconoSinIniciar: 'CircleDash',
  IconoConPreAtencion: 'InProgress',
  IconoEnAtencion: 'Incomplete',
  IconoCompleto: 'CheckmarkFilled',
  // Severidad: la forma distingue, no solo el color
  IconoFaltante: 'WarningAltFilled',
  IconoFueraDeRango: 'WarningHexFilled',
  IconoError: 'ErrorFilled',
  IconoInformacion: 'InformationFilled',
  // Acciones
  IconoMarcado: 'Checkmark',
  IconoAvanzar: 'ArrowRight',
  IconoVolver: 'ArrowLeft',
  IconoAbrirFila: 'ChevronRight',
  IconoTraerDelExamen: 'DocumentImport',
  IconoGuardar: 'Save',
  IconoImprimir: 'Printer',
  IconoAgregar: 'Add',
  IconoQuitar: 'TrashCan',
  IconoBuscar: 'Search',
  IconoSoloLectura: 'Locked',
  IconoSinAcceso: 'UserAccessLocked',
  IconoAltaUsuario: 'UserFollow',
  IconoDarDeBaja: 'UserMinus',
  // Clínicos y roles
  IconoRecetaOptica: 'ReadingGlasses',
  IconoRecetaMedicamentos: 'Medication',
  IconoOrdenExamen: 'DocumentTasks',
  IconoRolOftalmologo: 'Stethoscope',
  IconoRolTecnologo: 'Meter',
  IconoRolAdministrador: 'Settings',
}

function dibujo(nombreCarbon, size) {
  const svg = renderToStaticMarkup(React.createElement(carbon[nombreCarbon], { size }))
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1]
  const interior = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
  return { viewBox, interior }
}

const lineas = []
for (const [nuestro, suyo] of Object.entries(ICONOS)) {
  if (!carbon[suyo]) throw new Error(`Carbon no tiene ${suyo}`)
  // Carbon trae dibujos propios para 16 y 20 px en algunos íconos: se guardan ambos para que se vean nítidos.
  const d16 = dibujo(suyo, 16)
  const d20 = dibujo(suyo, 20)
  const mismos = d16.viewBox === d20.viewBox && d16.interior === d20.interior
  const datos = mismos ? `[${JSON.stringify(d16.viewBox)}, ${JSON.stringify(d16.interior)}]` : `[${JSON.stringify(d16.viewBox)}, ${JSON.stringify(d16.interior)}], [${JSON.stringify(d20.viewBox)}, ${JSON.stringify(d20.interior)}]`
  lineas.push(`/** Carbon: ${suyo} */\nexport const ${nuestro} = crear('${nuestro}', ${datos})`)
}

const salida = `// ARCHIVO GENERADO por scripts/generar-iconos.mjs. No editar a mano.
//
// Íconos de IBM Carbon (@carbon/icons-react ${version}), Copyright IBM Corp., licencia Apache-2.0
// (docs/licencias/carbon-icons-LICENSE). Se copian los dibujos en vez de instalar el paquete, que
// envía métricas de uso a IBM al instalarse en servidores de CI.
//
// Uso: 16 px en general; 20 px en avisos, controles del marco y "Sin acceso". Las pantallas importan
// solo desde aquí, nunca desde Carbon directo.
import type { JSX, SVGProps } from 'react'

export interface PropsIcono extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: 16 | 20 | 24 | 32
}

export type Icono = (props: PropsIcono) => JSX.Element

type Dibujo = [viewBox: string, interior: string]

function crear(nombre: string, d16: Dibujo, d20: Dibujo = d16): Icono {
  function Componente({ size = 16, ...resto }: PropsIcono) {
    const [viewBox, interior] = size <= 16 ? d16 : d20
    const etiquetado = Boolean(resto['aria-label'] || resto['aria-labelledby'])
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="currentColor"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden={etiquetado ? undefined : true}
        role={etiquetado ? 'img' : undefined}
        {...resto}
        // Dibujo vectorial fijo copiado de Carbon: no hay contenido de usuario.
        dangerouslySetInnerHTML={{ __html: interior }}
      />
    )
  }
  Componente.displayName = nombre
  return Componente
}

/** Marca del módulo: cuatro E de Snellen en las cuatro orientaciones (cartilla de E direccional). Dibujo propio. */
export function LogoRce({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true" focusable="false" className={className}>
      <path d="M1 1h10v2H3v2h8v2H3v2h8v2H1zM13 1h10v10H13V9h8V7h-8V5h8V3h-8zM1 23h10V13H9v8H7v-8H5v8H3v-8H1zM13 13h10v10h-2v-8h-2v8h-2v-8h-2v8h-2z" />
    </svg>
  )
}

${lineas.join('\n\n')}
`
writeFileSync(new URL('../src/components/iconos.tsx', import.meta.url), salida)
console.log(`iconos.tsx: ${Object.keys(ICONOS).length} íconos de Carbon ${version}`)
