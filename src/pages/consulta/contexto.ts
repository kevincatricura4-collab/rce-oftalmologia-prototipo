import type { Cita, Consulta, Plantilla } from '../../lib/tipos'

export type Paso = 'anamnesis' | 'examen' | 'diagnostico' | 'indicaciones' | 'cierre'

export const PASOS: { id: Paso; numero: number; nombre: string; siguiente?: string }[] = [
  { id: 'anamnesis', numero: 1, nombre: 'Anamnesis', siguiente: 'Continuar a examen' },
  { id: 'examen', numero: 2, nombre: 'Examen', siguiente: 'Continuar a diagnóstico' },
  { id: 'diagnostico', numero: 3, nombre: 'Diagnóstico', siguiente: 'Continuar a indicaciones' },
  { id: 'indicaciones', numero: 4, nombre: 'Indicaciones', siguiente: 'Continuar a cierre' },
  { id: 'cierre', numero: 5, nombre: 'Cierre' },
]

/** Lo que recibe cada paso de la consulta. */
export interface PropsPaso {
  consulta: Consulta
  cita: Cita | null
  plantilla: Plantilla
  soloLectura: boolean
  actualizar: (cambio: (c: Consulta) => Consulta) => void
  registrar: (bloque: string) => void
}
