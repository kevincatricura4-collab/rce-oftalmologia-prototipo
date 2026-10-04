import type { Paciente } from './tipos'

// La agenda de prueba corresponde a una jornada fija, para que los días de espera y los
// controles previos ("marzo", "junio", "hoy") se lean igual cada vez que se abre el prototipo.
export const FECHA_JORNADA = '2026-10-05'

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

function dosDigitos(n: number) {
  return String(n).padStart(2, '0')
}

/** Marca de tiempo de una acción: fecha de la jornada con la hora actual del reloj. */
export function marcaTiempo(): string {
  const ahora = new Date()
  return `${FECHA_JORNADA}T${dosDigitos(ahora.getHours())}:${dosDigitos(ahora.getMinutes())}`
}

function partes(iso: string) {
  const [fecha, hora = ''] = iso.split('T')
  const [a, m, d] = fecha.split('-').map(Number)
  return { a, m, d, hora: hora.slice(0, 5) }
}

/** Formato chileno: día-mes-año. */
export function fecha(iso: string): string {
  const { a, m, d } = partes(iso)
  return `${dosDigitos(d)}-${dosDigitos(m)}-${a}`
}

export function hora(iso: string): string {
  return partes(iso).hora
}

export function fechaHora(iso: string): string {
  const h = hora(iso)
  return h ? `${fecha(iso)} ${h}` : fecha(iso)
}

export function fechaLarga(iso: string): string {
  const { a, m, d } = partes(iso)
  const dia = new Date(a, m - 1, d).getDay()
  return `${DIAS[dia]} ${d} de ${MESES[m - 1]} de ${a}`
}

export function mesAnio(iso: string): string {
  const { a, m } = partes(iso)
  const mes = MESES[m - 1]
  return `${mes.charAt(0).toUpperCase()}${mes.slice(1, 3)} ${a}`
}

export function nombreMes(iso: string): string {
  return MESES[partes(iso).m - 1]
}

export function diasEntre(desde: string, hasta: string = FECHA_JORNADA): number {
  const a = partes(desde)
  const b = partes(hasta)
  const ms = Date.UTC(b.a, b.m - 1, b.d) - Date.UTC(a.a, a.m - 1, a.d)
  return Math.round(ms / 86_400_000)
}

export function edad(fechaNacimiento: string, referencia: string = FECHA_JORNADA): number {
  const n = partes(fechaNacimiento)
  const r = partes(referencia)
  let anios = r.a - n.a
  if (r.m < n.m || (r.m === n.m && r.d < n.d)) anios -= 1
  return anios
}

/** Dígito verificador del RUN (módulo 11). */
export function dvRun(cuerpo: number): string {
  let suma = 0
  let multiplo = 2
  for (const c of String(cuerpo).split('').reverse()) {
    suma += Number(c) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }
  const resto = 11 - (suma % 11)
  return resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
}

export function formatearRun(cuerpo: number): string {
  return `${cuerpo.toLocaleString('es-CL')}-${dvRun(cuerpo)}`
}

export function documento(p: Paciente): string {
  if (p.tipoDocumento === 'RUN') return `RUN ${p.documento}`
  if (p.tipoDocumento === 'Pasaporte') return `Pasaporte ${p.documento}`
  return `Id. provisorio ${p.documento}`
}

/** Agudeza visual, C/D y dioptrías se escriben con coma decimal. */
export function comaDecimal(valor: string): string {
  return valor.replace('.', ',')
}

export function aNumero(valor: string | undefined): number | null {
  if (!valor) return null
  const n = Number(valor.replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

let contador = 0
export function nuevoId(prefijo: string): string {
  contador += 1
  return `${prefijo}-${Date.now().toString(36)}-${contador}`
}
