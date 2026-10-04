import { NOMBRE_TIPO, campoVisible } from './plantillas'
import type { CampoPlantilla, Cita, Consulta, EstadoAtencion, Hallazgos, Ojo, Plantilla, PreAtencion, Sic } from './tipos'

// Reglas de la consulta que no dependen de la interfaz.

export function estadoCita(cita: Cita, consultas: Record<string, Consulta>): EstadoAtencion {
  const consulta = cita.consultaId ? consultas[cita.consultaId] : null
  if (consulta?.estado === 'cerrada') return 'cerrado'
  if (consulta) return 'en_atencion'
  if (cita.preAtencion) return 'con_pre_atencion'
  return 'en_espera'
}

/** Valores de la pre-atención en el formato de hallazgos, para precargar el examen. */
export function hallazgosDePreAtencion(pa: PreAtencion): Hallazgos {
  return {
    av_sc: { ...pa.avSc },
    av_cc: { ...pa.avCc },
    av_estenopeico: { ...pa.avEstenopeico },
    pio: { ...pa.pio },
    pio_metodo: { AO: pa.metodoPio },
    pio_hora: { AO: pa.horaPio },
  }
}

/** El valor sigue siendo el que llegó de la pre-atención (no lo cambió el oftalmólogo). */
export function vieneDePreAtencion(campoId: string, lado: 'OD' | 'OI' | 'AO', valor: string | undefined, pa: PreAtencion | null): boolean {
  if (!pa || !valor) return false
  return hallazgosDePreAtencion(pa)[campoId]?.[lado] === valor
}

export interface Faltante {
  texto: string
  paso: 'anamnesis' | 'examen' | 'diagnostico' | 'indicaciones' | 'cierre'
}

/** Campos obligatorios del tipo de atención sin completar, ojo por ojo (indicador 1). */
export function camposPendientes(plantilla: Plantilla, hallazgos: Hallazgos): Faltante[] {
  const pendientes: Faltante[] = []
  for (const campo of plantilla.campos) {
    if (!campo.obligatorio || !campoVisible(campo, hallazgos)) continue
    const valor = hallazgos[campo.id]
    if (campo.lateralidad === 'AO') {
      if (!valor?.AO) pendientes.push({ texto: `${campo.grupo}: ${campo.etiqueta}`, paso: 'examen' })
    } else {
      const faltan = (['OD', 'OI'] as Ojo[]).filter((o) => !valor?.[o])
      if (faltan.length) pendientes.push({ texto: `${campo.grupo}: ${campo.etiqueta} (${faltan.join(' y ')})`, paso: 'examen' })
    }
  }
  return pendientes
}

/** Lo que impide cerrar la consulta. Se revisa solo en el paso de cierre (RNF-06). */
export function bloqueosCierre(c: Consulta): Faltante[] {
  const f: Faltante[] = []
  if (!c.anamnesis.motivo.trim()) f.push({ texto: 'Motivo de consulta', paso: 'anamnesis' })
  if (!c.diagnosticos.length) f.push({ texto: 'Al menos un diagnóstico CIE-10', paso: 'diagnostico' })
  else if (!c.diagnosticos.some((d) => d.principal)) f.push({ texto: 'Marcar un diagnóstico como principal', paso: 'diagnostico' })
  for (const d of c.diagnosticos) {
    if (!d.lateralidad) f.push({ texto: `Lateralidad de ${d.codigo} ${d.descripcion}`, paso: 'diagnostico' })
  }
  if (!c.desenlace) f.push({ texto: 'Desenlace de la consulta', paso: 'cierre' })
  if (c.desenlace === 'control' && !c.plazoControl.trim()) f.push({ texto: 'Plazo del control', paso: 'cierre' })
  if (c.desenlace === 'examen_pendiente' && !c.examenPendiente.trim()) f.push({ texto: 'Examen del que depende la decisión', paso: 'cierre' })
  if (c.desenlace === 'indicacion_quirurgica' && !c.ojoOperar) f.push({ texto: 'Ojo a operar', paso: 'cierre' })
  if (c.indicacionTratamiento === null) f.push({ texto: '¿Hubo indicación de tratamiento óptico o farmacológico?', paso: 'cierre' })
  return f
}

/** Avisos que no bloquean el cierre, pero cuentan para los indicadores 2 y 3. */
export function avisosCierre(c: Consulta): Faltante[] {
  const f: Faltante[] = []
  const recetaEmitida = Boolean(c.recetaOptica?.emitida) || c.recetasMedicamento.some((r) => r.emitida)
  if (c.indicacionTratamiento && !recetaEmitida) f.push({ texto: 'Hay indicación de tratamiento pero ninguna receta emitida desde el módulo', paso: 'indicaciones' })
  if (c.desenlace === 'alta' && !c.contrarreferencia?.emitida) f.push({ texto: 'Alta sin contrarreferencia emitida al establecimiento de origen', paso: 'cierre' })
  return f
}

/** Primer campo de la NT 118 que vino vacío, para el aviso del encabezado. */
export function camposVaciosSic(sic: Sic): string[] {
  const vacios: string[] = []
  if (!sic.sospecha) vacios.push('sospecha diagnóstica')
  if (!sic.fundamento) vacios.push('fundamento')
  if (!sic.avPrevia) vacios.push('agudeza visual')
  if (!sic.pioPrevia) vacios.push('PIO')
  if (sic.diabetes === null) vacios.push('antecedente de diabetes')
  if (!sic.farmacos) vacios.push('fármacos en uso')
  if (sic.ges === null) vacios.push('marca GES')
  if (!sic.prioridad) vacios.push('prioridad')
  return vacios
}

export function avisoSic(sic: Sic): string | null {
  const vacios = camposVaciosSic(sic)
  if (!vacios.length) return null
  if (vacios.length === 1) return `SIC sin ${vacios[0]} (NT 118)`
  return `SIC incompleta: ${vacios.length} campos vacíos (NT 118)`
}

export interface ControlPrevio {
  fecha: string
  consultaId: string
  pio: Record<Ojo, string>
  cd: Record<Ojo, string>
  campoVisual: Record<Ojo, string>
  av: Record<Ojo, string>
}

/** Controles cerrados del paciente, del más antiguo al más reciente. */
export function controlesPrevios(pacienteId: string, consultas: Consulta[], excluirId?: string): ControlPrevio[] {
  const v = (h: Hallazgos, id: string, o: Ojo) => h[id]?.[o] ?? ''
  return consultas
    .filter((c) => c.pacienteId === pacienteId && c.estado === 'cerrada' && c.id !== excluirId)
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
    .map((c) => ({
      fecha: c.inicio,
      consultaId: c.id,
      pio: { OD: v(c.hallazgos, 'pio', 'OD'), OI: v(c.hallazgos, 'pio', 'OI') },
      cd: { OD: v(c.hallazgos, 'gl_cd', 'OD'), OI: v(c.hallazgos, 'gl_cd', 'OI') },
      campoVisual: { OD: v(c.hallazgos, 'gl_campo_visual', 'OD'), OI: v(c.hallazgos, 'gl_campo_visual', 'OI') },
      av: { OD: v(c.hallazgos, 'av_cc', 'OD') || v(c.hallazgos, 'av_sc', 'OD'), OI: v(c.hallazgos, 'av_cc', 'OI') || v(c.hallazgos, 'av_sc', 'OI') },
    }))
}

/** Agrupa los campos de una plantilla en el orden de sus grupos. */
export function camposPorGrupo(plantilla: Plantilla): { grupo: Plantilla['grupos'][number]; campos: CampoPlantilla[] }[] {
  return plantilla.grupos
    .map((grupo) => ({ grupo, campos: plantilla.campos.filter((c) => c.grupo === grupo.nombre) }))
    .filter((g) => g.campos.length > 0)
}

export function nombreTipo(c: Consulta): string {
  return NOMBRE_TIPO[c.tipoAtencion]
}
