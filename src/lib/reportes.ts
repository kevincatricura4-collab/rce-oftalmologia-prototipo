import type { Desenlace, TipoAtencionId } from './tipos'

// Simulación para la pantalla de reportes: seis meses de operación del módulo generados con
// una semilla fija. No son cifras reales y la pantalla lo dice (regla de dominio 10).
// Solo datos agregados: ningún registro identifica a un paciente.

export interface RegistroSimulado {
  mes: number // 0 = primer mes de operación
  tipo: TipoAtencionId
  dx: string
  desenlace: Desenlace
  completa: boolean
  indicacionTratamiento: boolean
  recetaDesdeModulo: boolean
  contrarreferencia: boolean
}

export const MESES_OPERACION = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']

export const INDICADORES = [
  { id: 'completas', nombre: 'Consultas cerradas con los campos obligatorios de su tipo completos', corto: 'Campos obligatorios completos', meta: 70, plazo: 'al sexto mes', mesMeta: 5, lineaBase: null },
  { id: 'recetas', nombre: 'Consultas con indicación de tratamiento cuya receta se generó desde el módulo', corto: 'Recetas desde el módulo', meta: 90, plazo: 'al cuarto mes', mesMeta: 3, lineaBase: 0 },
  { id: 'contrarreferencia', nombre: 'Consultas con desenlace de alta que emitieron contrarreferencia', corto: 'Altas con contrarreferencia', meta: 80, plazo: 'al sexto mes', mesMeta: 5, lineaBase: null },
] as const

export type IndicadorId = (typeof INDICADORES)[number]['id']

function generador(semilla: number) {
  let s = semilla
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function elegir<T>(azar: () => number, opciones: [T, number][]): T {
  const total = opciones.reduce((a, [, p]) => a + p, 0)
  let r = azar() * total
  for (const [v, p] of opciones) {
    r -= p
    if (r <= 0) return v
  }
  return opciones[0][0]
}

const DX: Record<TipoAtencionId, [string, number][]> = {
  general: [['H52.1', 5], ['H52.4', 4], ['H52.0', 2], ['H36.0', 3], ['H11.0', 2], ['H04.1', 2], ['H35.3', 1]],
  catarata: [['H25.1', 6], ['H25.0', 3], ['H25.9', 2], ['H26.4', 1]],
  glaucoma: [['H40.1', 6], ['H40.0', 4], ['H40.2', 1]],
}

const DESENLACE: Record<TipoAtencionId, [Desenlace, number][]> = {
  general: [['alta', 6], ['control', 3], ['examen_pendiente', 1]],
  catarata: [['indicacion_quirurgica', 5], ['control', 2], ['examen_pendiente', 2], ['alta', 1]],
  glaucoma: [['control', 8], ['examen_pendiente', 2], ['alta', 0.3]],
}

export function simular(): RegistroSimulado[] {
  const azar = generador(20260405)
  const registros: RegistroSimulado[] = []
  MESES_OPERACION.forEach((_, mes) => {
    const n = 300 + Math.round(azar() * 60)
    for (let i = 0; i < n; i++) {
      const tipo = elegir<TipoAtencionId>(azar, [['general', 45], ['catarata', 30], ['glaucoma', 25]])
      const desenlace = elegir(azar, DESENLACE[tipo])
      const indicacionTratamiento = tipo === 'glaucoma' ? azar() < 0.85 : tipo === 'general' ? azar() < 0.6 : azar() < 0.15
      registros.push({
        mes,
        tipo,
        dx: elegir(azar, DX[tipo]),
        desenlace,
        // La adopción mejora mes a mes: así se ve la evolución hacia la meta.
        completa: azar() < 0.46 + 0.052 * mes,
        indicacionTratamiento,
        recetaDesdeModulo: indicacionTratamiento && azar() < Math.min(0.58 + 0.12 * mes, 0.95),
        contrarreferencia: desenlace === 'alta' && azar() < 0.52 + 0.062 * mes,
      })
    }
  })
  return registros
}

export function valorIndicador(id: IndicadorId, regs: RegistroSimulado[]): { num: number; den: number; pct: number } {
  let num = 0
  let den = 0
  for (const r of regs) {
    if (id === 'completas') {
      den++
      if (r.completa) num++
    } else if (id === 'recetas') {
      if (!r.indicacionTratamiento) continue
      den++
      if (r.recetaDesdeModulo) num++
    } else {
      if (r.desenlace !== 'alta') continue
      den++
      if (r.contrarreferencia) num++
    }
  }
  return { num, den, pct: den ? Math.round((num / den) * 1000) / 10 : 0 }
}
