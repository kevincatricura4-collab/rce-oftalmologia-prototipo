// ARCHIVO GENERADO por scripts/generar-iconos.mjs. No editar a mano.
//
// Íconos de IBM Carbon (@carbon/icons-react 11.89.0), Copyright IBM Corp., licencia Apache-2.0
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

/** Carbon: EventSchedule */
export const IconoAgenda = crear('IconoAgenda', ["0 0 32 32", "<path d=\"M21,30a8,8,0,1,1,8-8A8,8,0,0,1,21,30Zm0-14a6,6,0,1,0,6,6A6,6,0,0,0,21,16Z\"></path><path d=\"M22.59 25 20 22.41 20 18 22 18 22 21.59 24 23.59 22.59 25z\"></path><path d=\"M28,6a2,2,0,0,0-2-2H22V2H20V4H12V2H10V4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2h4V26H6V6h4V8h2V6h8V8h2V6h4v6h2Z\"></path>"])

/** Carbon: RecentlyViewed */
export const IconoHistorial = crear('IconoHistorial', ["0 0 32 32", "<path d=\"M20.59 22 15 16.41 15 7 17 7 17 15.58 22 20.59 20.59 22z\"></path><path d=\"M16,2A13.94,13.94,0,0,0,6,6.23V2H4v8h8V8H7.08A12,12,0,1,1,4,16H2A14,14,0,1,0,16,2Z\"></path>"])

/** Carbon: Analytics */
export const IconoReportes = crear('IconoReportes', ["0 0 32 32", "<path d=\"M4,2H2V28a2,2,0,0,0,2,2H30V28H4Z\"></path><path d=\"M30,9H23v2h3.59L19,18.59l-4.29-4.3a1,1,0,0,0-1.42,0L6,21.59,7.41,23,14,16.41l4.29,4.3a1,1,0,0,0,1.42,0L28,12.41V16h2Z\"></path>"])

/** Carbon: UserMultiple */
export const IconoUsuarios = crear('IconoUsuarios', ["0 0 32 32", "<path d=\"M30,30H28V25a5.0057,5.0057,0,0,0-5-5V18a7.0078,7.0078,0,0,1,7,7Z\"></path><path d=\"M22,30H20V25a5.0059,5.0059,0,0,0-5-5H9a5.0059,5.0059,0,0,0-5,5v5H2V25a7.0082,7.0082,0,0,1,7-7h6a7.0082,7.0082,0,0,1,7,7Z\"></path><path d=\"M20,2V4a5,5,0,0,1,0,10v2A7,7,0,0,0,20,2Z\"></path><path d=\"M12,4A5,5,0,1,1,7,9a5,5,0,0,1,5-5m0-2a7,7,0,1,0,7,7A7,7,0,0,0,12,2Z\"></path>"])

/** Carbon: Template */
export const IconoPlantillas = crear('IconoPlantillas', ["0 0 32 32", "<path d=\"M26,6v4H6V6H26m0-2H6A2,2,0,0,0,4,6v4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2Z\"></path><path d=\"M10,16V26H6V16h4m0-2H6a2,2,0,0,0-2,2V26a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V16a2,2,0,0,0-2-2Z\"></path><path d=\"M26,16V26H16V16H26m0-2H16a2,2,0,0,0-2,2V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V16a2,2,0,0,0-2-2Z\"></path>"])

/** Carbon: Catalog */
export const IconoCatalogos = crear('IconoCatalogos', ["0 0 32 32", "<path d=\"M26,2H8A2,2,0,0,0,6,4V8H4v2H6v5H4v2H6v5H4v2H6v4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V4A2,2,0,0,0,26,2Zm0,26H8V24h2V22H8V17h2V15H8V10h2V8H8V4H26Z\"></path><path d=\"M14 8H22V10H14z\"></path><path d=\"M14 15H22V17H14z\"></path><path d=\"M14 22H22V24H14z\"></path>"])

/** Carbon: DocumentView */
export const IconoRegistroAccesos = crear('IconoRegistroAccesos', ["0 0 32 32", "<circle cx=\"22\" cy=\"24\" r=\"2\"></circle><path fill=\"none\" d=\"M22,28a4,4,0,1,1,4-4A4.0039,4.0039,0,0,1,22,28Zm0-6a2,2,0,1,0,2,2A2.0027,2.0027,0,0,0,22,22Z\"></path><path d=\"M29.7769,23.4785A8.64,8.64,0,0,0,22,18a8.64,8.64,0,0,0-7.7769,5.4785L14,24l.2231.5215A8.64,8.64,0,0,0,22,30a8.64,8.64,0,0,0,7.7769-5.4785L30,24ZM22,28a4,4,0,1,1,4-4A4.0045,4.0045,0,0,1,22,28Z\"></path><path d=\"M12,28H8V4h8v6a2.0058,2.0058,0,0,0,2,2h6v4h2V10a.9092.9092,0,0,0-.3-.7l-7-7A.9087.9087,0,0,0,18,2H8A2.0058,2.0058,0,0,0,6,4V28a2.0058,2.0058,0,0,0,2,2h4ZM18,4.4,23.6,10H18Z\"></path>"])

/** Carbon: Logout */
export const IconoCambiarPerfil = crear('IconoCambiarPerfil', ["0 0 32 32", "<path d=\"M6,30H18a2.0023,2.0023,0,0,0,2-2V25H18v3H6V4H18V7h2V4a2.0023,2.0023,0,0,0-2-2H6A2.0023,2.0023,0,0,0,4,4V28A2.0023,2.0023,0,0,0,6,30Z\"></path><path d=\"M20.586 20.586 24.172 17 10 17 10 15 24.172 15 20.586 11.414 22 10 28 16 22 22 20.586 20.586z\"></path>"])

/** Carbon: Reset */
export const IconoRestablecer = crear('IconoRestablecer', ["0 0 32 32", "<path d=\"M18,28A12,12,0,1,0,6,16v6.2L2.4,18.6,1,20l6,6,6-6-1.4-1.4L8,22.2V16H8A10,10,0,1,1,18,26Z\"></path>"])

/** Carbon: Menu */
export const IconoMenu = crear('IconoMenu', ["0 0 16 16", "<path d=\"M2 12H14V13H2z\"></path><path d=\"M2 9H14V10H2z\"></path><path d=\"M2 6H14V7H2z\"></path><path d=\"M2 3H14V4H2z\"></path>"], ["0 0 20 20", "<path d=\"M2 14.8H18V16H2z\"></path><path d=\"M2 11.2H18V12.399999999999999H2z\"></path><path d=\"M2 7.6H18V8.799999999999999H2z\"></path><path d=\"M2 4H18V5.2H2z\"></path>"])

/** Carbon: Close */
export const IconoCerrar = crear('IconoCerrar', ["0 0 32 32", "<path d=\"M17.4141 16 24 9.4141 22.5859 8 16 14.5859 9.4143 8 8 9.4141 14.5859 16 8 22.5859 9.4143 24 16 17.4141 22.5859 24 24 22.5859 17.4141 16z\"></path>"])

/** Carbon: Asleep */
export const IconoModoOscuro = crear('IconoModoOscuro', ["0 0 16 16", "<path d=\"M7.2,2.3c-1,4.4,1.7,8.7,6.1,9.8c0.1,0,0.1,0,0.2,0c-1.1,1.2-2.7,1.8-4.3,1.8c-0.1,0-0.2,0-0.2,0C5.6,13.8,3,11,3.2,7.7 C3.2,5.3,4.8,3.1,7.2,2.3 M8,1L8,1C4.1,1.6,1.5,5.3,2.1,9.1c0.6,3.3,3.4,5.8,6.8,5.9c0.1,0,0.2,0,0.3,0c2.3,0,4.4-1.1,5.8-3 c0.2-0.2,0.1-0.6-0.1-0.7c-0.1-0.1-0.2-0.1-0.3-0.1c-3.9-0.3-6.7-3.8-6.4-7.6C8.3,3,8.4,2.4,8.6,1.8c0.1-0.3,0-0.6-0.3-0.7 C8.1,1,8.1,1,8,1z\"></path>"], ["0 0 32 32", "<path d=\"M13.5025,5.4136A15.0755,15.0755,0,0,0,25.096,23.6082a11.1134,11.1134,0,0,1-7.9749,3.3893c-.1385,0-.2782.0051-.4178,0A11.0944,11.0944,0,0,1,13.5025,5.4136M14.98,3a1.0024,1.0024,0,0,0-.1746.0156A13.0959,13.0959,0,0,0,16.63,28.9973c.1641.006.3282,0,.4909,0a13.0724,13.0724,0,0,0,10.702-5.5556,1.0094,1.0094,0,0,0-.7833-1.5644A13.08,13.08,0,0,1,15.8892,4.38,1.0149,1.0149,0,0,0,14.98,3Z\"></path>"])

/** Carbon: Light */
export const IconoModoClaro = crear('IconoModoClaro', ["0 0 16 16", "<path d=\"M7.5 1H8.5V3.5H7.5z\"></path><path d=\"M10.8 3.4H13.3V4.4H10.8z\" transform=\"rotate(-45 12.041 3.923)\"></path><path d=\"M12.5 7.5H15V8.5H12.5z\"></path><path d=\"M11.6 10.8H12.6V13.3H11.6z\" transform=\"rotate(-45 12.075 12.04)\"></path><path d=\"M7.5 12.5H8.5V15H7.5z\"></path><path d=\"M2.7 11.6H5.2V12.6H2.7z\" transform=\"rotate(-45 3.96 12.078)\"></path><path d=\"M1 7.5H3.5V8.5H1z\"></path><path d=\"M3.4 2.7H4.4V5.2H3.4z\" transform=\"rotate(-45 3.925 3.961)\"></path><path d=\"M8,6c1.1,0,2,0.9,2,2s-0.9,2-2,2S6,9.1,6,8S6.9,6,8,6 M8,5C6.3,5,5,6.3,5,8s1.3,3,3,3s3-1.3,3-3S9.7,5,8,5z\"></path>"], ["0 0 32 32", "<path d=\"M15 2H17V7H15z\"></path><path d=\"M21.668 6.854H26.625999999999998V8.854H21.668z\" transform=\"rotate(-45 24.147 7.853)\"></path><path d=\"M25 15H30V17H25z\"></path><path d=\"M23.147 21.668H25.147V26.625999999999998H23.147z\" transform=\"rotate(-45 24.147 24.146)\"></path><path d=\"M15 25H17V30H15z\"></path><path d=\"M5.375 23.147H10.333V25.147H5.375z\" transform=\"rotate(-45 7.853 24.146)\"></path><path d=\"M2 15H7V17H2z\"></path><path d=\"M6.854 5.375H8.854V10.333H6.854z\" transform=\"rotate(-45 7.854 7.853)\"></path><path d=\"M16,12a4,4,0,1,1-4,4,4.0045,4.0045,0,0,1,4-4m0-2a6,6,0,1,0,6,6,6,6,0,0,0-6-6Z\"></path>"])

/** Carbon: DataBase */
export const IconoDatosPrueba = crear('IconoDatosPrueba', ["0 0 32 32", "<path d=\"M24,3H8A2,2,0,0,0,6,5V27a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V5A2,2,0,0,0,24,3Zm0,2v6H8V5ZM8,19V13H24v6Zm0,8V21H24v6Z\"></path><circle cx=\"11\" cy=\"8\" r=\"1\"></circle><circle cx=\"11\" cy=\"16\" r=\"1\"></circle><circle cx=\"11\" cy=\"24\" r=\"1\"></circle>"])

/** Carbon: CircleDash */
export const IconoSinIniciar = crear('IconoSinIniciar', ["0 0 32 32", "<path d=\"M7.7,4.7a14.7,14.7,0,0,0-3,3.1L6.3,9A13.26,13.26,0,0,1,8.9,6.3Z\"></path><path d=\"M4.6,12.3l-1.9-.6A12.51,12.51,0,0,0,2,16H4A11.48,11.48,0,0,1,4.6,12.3Z\"></path><path d=\"M2.7,20.4a14.4,14.4,0,0,0,2,3.9l1.6-1.2a12.89,12.89,0,0,1-1.7-3.3Z\"></path><path d=\"M7.8,27.3a14.4,14.4,0,0,0,3.9,2l.6-1.9A12.89,12.89,0,0,1,9,25.7Z\"></path><path d=\"M11.7,2.7l.6,1.9A11.48,11.48,0,0,1,16,4V2A12.51,12.51,0,0,0,11.7,2.7Z\"></path><path d=\"M24.2,27.3a15.18,15.18,0,0,0,3.1-3.1L25.7,23A11.53,11.53,0,0,1,23,25.7Z\"></path><path d=\"M27.4,19.7l1.9.6A15.47,15.47,0,0,0,30,16H28A11.48,11.48,0,0,1,27.4,19.7Z\"></path><path d=\"M29.2,11.6a14.4,14.4,0,0,0-2-3.9L25.6,8.9a12.89,12.89,0,0,1,1.7,3.3Z\"></path><path d=\"M24.1,4.6a14.4,14.4,0,0,0-3.9-2l-.6,1.9a12.89,12.89,0,0,1,3.3,1.7Z\"></path><path d=\"M20.3,29.3l-.6-1.9A11.48,11.48,0,0,1,16,28v2A21.42,21.42,0,0,0,20.3,29.3Z\"></path>"])

/** Carbon: InProgress */
export const IconoConPreAtencion = crear('IconoConPreAtencion', ["0 0 32 32", "<path d=\"M16,2A14,14,0,1,0,30,16,14.0158,14.0158,0,0,0,16,2Zm0,26A12,12,0,0,1,16,4V16l8.4812,8.4814A11.9625,11.9625,0,0,1,16,28Z\"></path>"])

/** Carbon: Incomplete */
export const IconoEnAtencion = crear('IconoEnAtencion', ["0 0 32 32", "<path d=\"M23.7642,6.8593l1.2851-1.5315A13.976,13.976,0,0,0,20.8672,2.887l-.6836,1.8776A11.9729,11.9729,0,0,1,23.7642,6.8593Z\"></path><path d=\"M27.81,14l1.9677-.4128A13.8888,13.8888,0,0,0,28.14,9.0457L26.4087,10A12.52,12.52,0,0,1,27.81,14Z\"></path><path d=\"M20.1836,27.2354l.6836,1.8776a13.976,13.976,0,0,0,4.1821-2.4408l-1.2851-1.5315A11.9729,11.9729,0,0,1,20.1836,27.2354Z\"></path><path d=\"M26.4087,22,28.14,23a14.14,14.14,0,0,0,1.6382-4.5872L27.81,18.0659A12.1519,12.1519,0,0,1,26.4087,22Z\"></path><path d=\"M16,30V2a14,14,0,0,0,0,28Z\"></path>"])

/** Carbon: CheckmarkFilled */
export const IconoCompleto = crear('IconoCompleto', ["0 0 16 16", "<path d=\"M8,1C4.1,1,1,4.1,1,8c0,3.9,3.1,7,7,7s7-3.1,7-7C15,4.1,11.9,1,8,1z M7,11L4.3,8.3l0.9-0.8L7,9.3l4-3.9l0.9,0.8L7,11z\"></path><path d=\"M7,11L4.3,8.3l0.9-0.8L7,9.3l4-3.9l0.9,0.8L7,11z\" data-icon-path=\"inner-path\" opacity=\"0\"></path>"], ["0 0 20 20", "<path d=\"M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z\"></path><path fill=\"none\" d=\"M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z\" data-icon-path=\"inner-path\" opacity=\"0\"></path>"])

/** Carbon: WarningAltFilled */
export const IconoFaltante = crear('IconoFaltante', ["0 0 32 32", "<path fill=\"none\" d=\"M16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Zm-1.125-5h2.25V12h-2.25Z\" data-icon-path=\"inner-path\"></path><path d=\"M16.002,6.1714h-.004L4.6487,27.9966,4.6506,28H27.3494l.0019-.0034ZM14.875,12h2.25v9h-2.25ZM16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Z\"></path><path d=\"M29,30H3a1,1,0,0,1-.8872-1.4614l13-25a1,1,0,0,1,1.7744,0l13,25A1,1,0,0,1,29,30ZM4.6507,28H27.3493l.002-.0033L16.002,6.1714h-.004L4.6487,27.9967Z\"></path>"])

/** Carbon: WarningHexFilled */
export const IconoFueraDeRango = crear('IconoFueraDeRango', ["0 0 32 32", "<path fill=\"none\" d=\"M14.875,8h2.25V19h-2.25ZM16,25a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,25Z\" data-icon-path=\"inner-path\"></path><path d=\"M30.8508,15.4487,23.8867,3.5322A1.0687,1.0687,0,0,0,22.9643,3H9.0357a1.0687,1.0687,0,0,0-.9224.5322L1.1492,15.4487a1.0933,1.0933,0,0,0,0,1.1026L8.1133,28.4678A1.0687,1.0687,0,0,0,9.0357,29H22.9643a1.0687,1.0687,0,0,0,.9224-.5322l6.9641-11.9165A1.0933,1.0933,0,0,0,30.8508,15.4487ZM14.875,8h2.25V19h-2.25ZM16,25a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,25Z\"></path>"])

/** Carbon: ErrorFilled */
export const IconoError = crear('IconoError', ["0 0 16 16", "<path d=\"M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1z M10.7,11.5L4.5,5.3l0.8-0.8l6.2,6.2L10.7,11.5z\"></path><path fill=\"none\" d=\"M10.7,11.5L4.5,5.3l0.8-0.8l6.2,6.2L10.7,11.5z\" data-icon-path=\"inner-path\" opacity=\"0\"></path>"], ["0 0 20 20", "<path d=\"M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z\"></path><path d=\"M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z\" data-icon-path=\"inner-path\" opacity=\"0\"></path>"])

/** Carbon: InformationFilled */
export const IconoInformacion = crear('IconoInformacion', ["0 0 32 32", "<path fill=\"none\" d=\"M16,8a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,13.875H17.125v-8H13v2.25h1.875v5.75H12v2.25h8Z\" data-icon-path=\"inner-path\"></path><path d=\"M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,6a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,16.125H12v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z\"></path>"])

/** Carbon: Checkmark */
export const IconoMarcado = crear('IconoMarcado', ["0 0 32 32", "<path d=\"M13 24 4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24z\"></path>"], ["0 0 20 20", "<path d=\"M8 13.2 3.6 8.8 2.7 9.7 7.1 14.1 8 15 16.5 6.5 15.6 5.6z\"></path><path d=\"M15.6 5.6 8 13.2 3.6 8.8 2.7 9.7 7.1 14.1 8 15 16.5 6.5 15.6 5.6z\"></path>"])

/** Carbon: ArrowRight */
export const IconoAvanzar = crear('IconoAvanzar', ["0 0 16 16", "<path d=\"M9.3 3.7 13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z\"></path>"], ["0 0 20 20", "<path d=\"M11.8 2.8 10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z\"></path>"])

/** Carbon: ArrowLeft */
export const IconoVolver = crear('IconoVolver', ["0 0 16 16", "<path d=\"M6.7 12.3 2.9 8.5 15 8.5 15 7.5 2.9 7.5 6.7 3.7 6 3 1 8 6 13z\"></path>"], ["0 0 32 32", "<path d=\"M14 26 15.41 24.59 7.83 17 28 17 28 15 7.83 15 15.41 7.41 14 6 4 16 14 26z\"></path>"])

/** Carbon: ChevronRight */
export const IconoAbrirFila = crear('IconoAbrirFila', ["0 0 16 16", "<path d=\"M11 8 6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z\"></path>"], ["0 0 32 32", "<path d=\"M22 16 12 26 10.6 24.6 19.2 16 10.6 7.4 12 6z\"></path>"])

/** Carbon: DocumentImport */
export const IconoTraerDelExamen = crear('IconoTraerDelExamen', ["0 0 32 32", "<path d=\"M28 19 14.83 19 17.41 16.41 16 15 11 20 16 25 17.41 23.59 14.83 21 28 21 28 19z\"></path><path d=\"M24,14V10a1,1,0,0,0-.29-.71l-7-7A1,1,0,0,0,16,2H6A2,2,0,0,0,4,4V28a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2V26H22v2H6V4h8v6a2,2,0,0,0,2,2h6v2Zm-8-4V4.41L21.59,10Z\"></path>"])

/** Carbon: Save */
export const IconoGuardar = crear('IconoGuardar', ["0 0 16 16", "<path d=\"M13.9,4.6l-2.5-2.5C11.3,2.1,11.1,2,11,2H3C2.4,2,2,2.4,2,3v10c0,0.6,0.4,1,1,1h10c0.6,0,1-0.4,1-1V5 C14,4.9,13.9,4.7,13.9,4.6z M6,3h4v2H6V3z M10,13H6V9h4V13z M11,13V9c0-0.6-0.4-1-1-1H6C5.4,8,5,8.4,5,9v4H3V3h2v2c0,0.6,0.4,1,1,1 h4c0.6,0,1-0.4,1-1V3.2l2,2V13H11z\"></path>"], ["0 0 20 20", "<path d=\"M17.8,5.5l-3.3-3.3C14.3,2.1,14.2,2,14,2H3.3C2.6,2,2,2.6,2,3.3v13.3C2,17.4,2.6,18,3.3,18h13.3c0.7,0,1.4-0.5,1.4-1.2V6.1 C18,5.7,17.9,5.7,17.8,5.5z M7.3,3.3h5.3v3.3H7.3V3.3z M12.7,16.7H7.3v-5.3h5.3L12.7,16.7L12.7,16.7z M14,16.7v-5.3 c0-0.7-0.6-1.3-1.3-1.3H7.3C6.6,10,6,10.6,6,11.3v5.3H3.3V3.3H6v3.3C6,7.4,6.6,8,7.3,8h5.3C13.4,8,14,7.4,14,6.7v-3l2.7,2.7v10.4 L14,16.7L14,16.7z\"></path>"])

/** Carbon: Printer */
export const IconoImprimir = crear('IconoImprimir', ["0 0 32 32", "<path d=\"M28,9H25V3H7V9H4a2,2,0,0,0-2,2V21a2,2,0,0,0,2,2H7v6H25V23h3a2,2,0,0,0,2-2V11A2,2,0,0,0,28,9ZM9,5H23V9H9ZM23,27H9V17H23Zm5-6H25V15H7v6H4V11H28Z\"></path>"])

/** Carbon: Add */
export const IconoAgregar = crear('IconoAgregar', ["0 0 32 32", "<path d=\"M17 15 17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z\"></path>"])

/** Carbon: TrashCan */
export const IconoQuitar = crear('IconoQuitar', ["0 0 32 32", "<path d=\"M12 12H14V24H12z\"></path><path d=\"M18 12H20V24H18z\"></path><path d=\"M4,6V8H6V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8h2V6ZM8,28V8H24V28Z\"></path><path d=\"M12 2H20V4H12z\"></path>"])

/** Carbon: Search */
export const IconoBuscar = crear('IconoBuscar', ["0 0 16 16", "<path d=\"M15,14.3L10.7,10c1.9-2.3,1.6-5.8-0.7-7.7S4.2,0.7,2.3,3S0.7,8.8,3,10.7c2,1.7,5,1.7,7,0l4.3,4.3L15,14.3z M2,6.5 C2,4,4,2,6.5,2S11,4,11,6.5S9,11,6.5,11S2,9,2,6.5z\"></path>"], ["0 0 32 32", "<path d=\"M29,27.5859l-7.5521-7.5521a11.0177,11.0177,0,1,0-1.4141,1.4141L27.5859,29ZM4,13a9,9,0,1,1,9,9A9.01,9.01,0,0,1,4,13Z\"></path>"])

/** Carbon: Locked */
export const IconoSoloLectura = crear('IconoSoloLectura', ["0 0 32 32", "<path d=\"M24,14H22V8A6,6,0,0,0,10,8v6H8a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V16A2,2,0,0,0,24,14ZM12,8a4,4,0,0,1,8,0v6H12ZM24,28H8V16H24Z\"></path>"])

/** Carbon: UserAccessLocked */
export const IconoSinAcceso = crear('IconoSinAcceso', ["0 0 32 32", "<path stroke-width=\"0\" d=\"m28,8v-3c0-2.2056-1.7944-4-4-4s-4,1.7944-4,4v3c-1.1028,0-2,.8975-2,2v6c0,1.1025.8972,2,2,2h8c1.1028,0,2-.8975,2-2v-6c0-1.1025-.8972-2-2-2Zm-6-3c0-1.1025.8972-2,2-2s2,.8975,2,2v3h-4v-3Zm-2,11v-6h8v6h-8Z\"></path><path stroke-width=\"0\" d=\"m16,30h-2v-5c-.0018-1.6561-1.3439-2.9982-3-3h-4c-1.6561.0018-2.9982,1.3439-3,3v5h-2v-5c.0033-2.7601,2.2399-4.9967,5-5h4c2.7601.0033,4.9967,2.2399,5,5v5Z\"></path><path stroke-width=\"0\" d=\"m9,10c1.6569,0,3,1.3431,3,3s-1.3431,3-3,3-3-1.3431-3-3,1.3431-3,3-3m0-2c-2.7614,0-5,2.2386-5,5s2.2386,5,5,5,5-2.2386,5-5-2.2386-5-5-5Z\"></path>"])

/** Carbon: UserFollow */
export const IconoAltaUsuario = crear('IconoAltaUsuario', ["0 0 32 32", "<path d=\"M32 14 28 14 28 10 26 10 26 14 22 14 22 16 26 16 26 20 28 20 28 16 32 16 32 14z\"></path><path d=\"M12,4A5,5,0,1,1,7,9a5,5,0,0,1,5-5m0-2a7,7,0,1,0,7,7A7,7,0,0,0,12,2Z\"></path><path d=\"M22,30H20V25a5,5,0,0,0-5-5H9a5,5,0,0,0-5,5v5H2V25a7,7,0,0,1,7-7h6a7,7,0,0,1,7,7Z\"></path>"])

/** Carbon: UserMinus */
export const IconoDarDeBaja = crear('IconoDarDeBaja', ["0 0 32 32", "<path d=\"M22,30h-2v-5c0-2.7568-2.2432-5-5-5h-6c-2.7568,0-5,2.2432-5,5v5h-2v-5c0-3.8594,3.1401-7,7-7h6c3.8594,0,7,3.1406,7,7v5ZM32,16h-10v-2h10v2ZM12,16c-3.8599,0-7-3.1401-7-7s3.1401-7,7-7,7,3.1401,7,7-3.1401,7-7,7ZM12,4c-2.7568,0-5,2.2432-5,5s2.2432,5,5,5,5-2.2432,5-5-2.2432-5-5-5Z\"></path>"])

/** Carbon: ReadingGlasses */
export const IconoRecetaOptica = crear('IconoRecetaOptica', ["0 0 32 32", "<path d=\"M29.4141,6.9968l-4.0001-3.9968-1.414,1.4144,4.0001,3.9968v10.5888h-7.0001c-1.4702,0-2.691,1.0646-2.9457,2.4624-.6383-.2906-1.333-.4624-2.0543-.4624s-1.416.1718-2.0543.4623c-.2548-1.3978-1.4755-2.4623-2.9457-2.4623H3.9999v-10.5888l4.0001-3.9968-1.414-1.4144-4.0001,3.9968c-.3779.378-.5859.8801-.5859,1.4144v16.5888c0,2.2061,1.7944,4,4,4h3c2.7568,0,5-2.2432,5-5v-.2139c.5444-.4899,1.2498-.7861,2-.7861s1.4553.2962,2,.7861v.2139c0,2.7568,2.2432,5,5,5h3c2.2061,0,4-1.7939,4-4V8.4112c0-.5343-.208-1.0364-.5859-1.4144ZM12,24c0,1.6543-1.3457,3-3,3h-3c-1.103,0-2-.8975-2-2v-4h7c.5513,0,1,.4482,1,1v2ZM28,25c0,1.1025-.8975,2-2,2h-3c-1.6543,0-3-1.3457-3-3v-2c0-.5518.4482-1,1-1h7v4Z\"></path>"])

/** Carbon: Medication */
export const IconoRecetaMedicamentos = crear('IconoRecetaMedicamentos', ["0 0 32 32", "<path d=\"M24,2H8A2,2,0,0,0,6,4V8a2,2,0,0,0,2,2V28a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2V10a2,2,0,0,0,2-2V4A2,2,0,0,0,24,2ZM10,14h3V24H10ZM22,28H10V26h5V12H10V10H22ZM8,8V4H24V8Z\"></path>"])

/** Carbon: DocumentTasks */
export const IconoOrdenExamen = crear('IconoOrdenExamen', ["0 0 32 32", "<path d=\"M22 27.18 19.41 24.59 18 26 22 30 30 22 28.59 20.59 22 27.18z\"></path><path d=\"M15,28H8V4h8v6a2.0058,2.0058,0,0,0,2,2h6v6h2V10a.9092.9092,0,0,0-.3-.7l-7-7A.9087.9087,0,0,0,18,2H8A2.0058,2.0058,0,0,0,6,4V28a2.0058,2.0058,0,0,0,2,2h7ZM18,4.4,23.6,10H18Z\"></path>"])

/** Carbon: Stethoscope */
export const IconoRolOftalmologo = crear('IconoRolOftalmologo', ["0 0 32 32", "<path d=\"M24,2V4h2v6a4,4,0,0,1-8,0V4h2V2H16v8a6.0051,6.0051,0,0,0,5,5.91V22A6,6,0,0,1,9,22V15.8579a4,4,0,1,0-2,0V22a8,8,0,0,0,16,0V15.91A6.0051,6.0051,0,0,0,28,10V2ZM6,12a2,2,0,1,1,2,2A2.0023,2.0023,0,0,1,6,12Z\"></path>"])

/** Carbon: Meter */
export const IconoRolTecnologo = crear('IconoRolTecnologo', ["0 0 32 32", "<path d=\"M26,16a9.9283,9.9283,0,0,0-1.1392-4.6182l-1.4961,1.4961A7.9483,7.9483,0,0,1,24,16Z\"></path><path d=\"M23.4141,10,22,8.5859l-4.7147,4.7147A2.9659,2.9659,0,0,0,16,13a3,3,0,1,0,3,3,2.9659,2.9659,0,0,0-.3006-1.2853ZM16,17a1,1,0,1,1,1-1A1.0013,1.0013,0,0,1,16,17Z\"></path><path d=\"M16,8a7.9515,7.9515,0,0,1,3.1223.6353l1.4961-1.4961A9.9864,9.9864,0,0,0,6,16H8A8.0092,8.0092,0,0,1,16,8Z\"></path><path d=\"M16,30A14,14,0,1,1,30,16,14.0158,14.0158,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12.0137,12.0137,0,0,0,16,4Z\"></path>"])

/** Carbon: Settings */
export const IconoRolAdministrador = crear('IconoRolAdministrador', ["0 0 16 16", "<path d=\"M13.5,8.4c0-0.1,0-0.3,0-0.4c0-0.1,0-0.3,0-0.4l1-0.8c0.4-0.3,0.4-0.9,0.2-1.3l-1.2-2C13.3,3.2,13,3,12.6,3 c-0.1,0-0.2,0-0.3,0.1l-1.2,0.4c-0.2-0.1-0.4-0.3-0.7-0.4l-0.3-1.3C10.1,1.3,9.7,1,9.2,1H6.8c-0.5,0-0.9,0.3-1,0.8L5.6,3.1 C5.3,3.2,5.1,3.3,4.9,3.4L3.7,3C3.6,3,3.5,3,3.4,3C3,3,2.7,3.2,2.5,3.5l-1.2,2C1.1,5.9,1.2,6.4,1.6,6.8l0.9,0.9c0,0.1,0,0.3,0,0.4 c0,0.1,0,0.3,0,0.4L1.6,9.2c-0.4,0.3-0.5,0.9-0.2,1.3l1.2,2C2.7,12.8,3,13,3.4,13c0.1,0,0.2,0,0.3-0.1l1.2-0.4 c0.2,0.1,0.4,0.3,0.7,0.4l0.3,1.3c0.1,0.5,0.5,0.8,1,0.8h2.4c0.5,0,0.9-0.3,1-0.8l0.3-1.3c0.2-0.1,0.4-0.2,0.7-0.4l1.2,0.4 c0.1,0,0.2,0.1,0.3,0.1c0.4,0,0.7-0.2,0.9-0.5l1.1-2c0.2-0.4,0.2-0.9-0.2-1.3L13.5,8.4z M12.6,12l-1.7-0.6c-0.4,0.3-0.9,0.6-1.4,0.8 L9.2,14H6.8l-0.4-1.8c-0.5-0.2-0.9-0.5-1.4-0.8L3.4,12l-1.2-2l1.4-1.2c-0.1-0.5-0.1-1.1,0-1.6L2.2,6l1.2-2l1.7,0.6 C5.5,4.2,6,4,6.5,3.8L6.8,2h2.4l0.4,1.8c0.5,0.2,0.9,0.5,1.4,0.8L12.6,4l1.2,2l-1.4,1.2c0.1,0.5,0.1,1.1,0,1.6l1.4,1.2L12.6,12z\"></path><path d=\"M8,11c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3C11,9.6,9.7,11,8,11C8,11,8,11,8,11z M8,6C6.9,6,6,6.8,6,7.9C6,7.9,6,8,6,8 c0,1.1,0.8,2,1.9,2c0,0,0.1,0,0.1,0c1.1,0,2-0.8,2-1.9c0,0,0-0.1,0-0.1C10,6.9,9.2,6,8,6C8.1,6,8,6,8,6z\"></path>"], ["0 0 32 32", "<path d=\"M27,16.76c0-.25,0-.5,0-.76s0-.51,0-.77l1.92-1.68A2,2,0,0,0,29.3,11L26.94,7a2,2,0,0,0-1.73-1,2,2,0,0,0-.64.1l-2.43.82a11.35,11.35,0,0,0-1.31-.75l-.51-2.52a2,2,0,0,0-2-1.61H13.64a2,2,0,0,0-2,1.61l-.51,2.52a11.48,11.48,0,0,0-1.32.75L7.43,6.06A2,2,0,0,0,6.79,6,2,2,0,0,0,5.06,7L2.7,11a2,2,0,0,0,.41,2.51L5,15.24c0,.25,0,.5,0,.76s0,.51,0,.77L3.11,18.45A2,2,0,0,0,2.7,21L5.06,25a2,2,0,0,0,1.73,1,2,2,0,0,0,.64-.1l2.43-.82a11.35,11.35,0,0,0,1.31.75l.51,2.52a2,2,0,0,0,2,1.61h4.72a2,2,0,0,0,2-1.61l.51-2.52a11.48,11.48,0,0,0,1.32-.75l2.42.82a2,2,0,0,0,.64.1,2,2,0,0,0,1.73-1L29.3,21a2,2,0,0,0-.41-2.51ZM25.21,24l-3.43-1.16a8.86,8.86,0,0,1-2.71,1.57L18.36,28H13.64l-.71-3.55a9.36,9.36,0,0,1-2.7-1.57L6.79,24,4.43,20l2.72-2.4a8.9,8.9,0,0,1,0-3.13L4.43,12,6.79,8l3.43,1.16a8.86,8.86,0,0,1,2.71-1.57L13.64,4h4.72l.71,3.55a9.36,9.36,0,0,1,2.7,1.57L25.21,8,27.57,12l-2.72,2.4a8.9,8.9,0,0,1,0,3.13L27.57,20Z\"></path><path d=\"M16,22a6,6,0,1,1,6-6A5.94,5.94,0,0,1,16,22Zm0-10a3.91,3.91,0,0,0-4,4,3.91,3.91,0,0,0,4,4,3.91,3.91,0,0,0,4-4A3.91,3.91,0,0,0,16,12Z\"></path>"])
