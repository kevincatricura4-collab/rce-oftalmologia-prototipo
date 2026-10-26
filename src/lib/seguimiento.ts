import type { Consulta, ResultadoExamen } from './tipos'

/** Un único cambio de decisión mantiene examen y cierre de catarata consistentes. */
export function sincronizarDecision(anterior: Consulta, nueva: Consulta): Consulta {
  if (nueva.tipoAtencion !== 'catarata') return nueva
  const indicacion = nueva.hallazgos.cat_indicacion?.AO
  const ojo = nueva.hallazgos.cat_ojo_operar?.AO
  const cambioExamen = indicacion !== anterior.hallazgos.cat_indicacion?.AO || ojo !== anterior.hallazgos.cat_ojo_operar?.AO || (anterior.tipoAtencion !== 'catarata' && indicacion === 'Sí')
  if (cambioExamen) {
    const ojoValido = ojo === 'OD' || ojo === 'OI' || ojo === 'AO' ? ojo : null
    return { ...nueva, desenlace: indicacion === 'Sí' ? 'indicacion_quirurgica' : nueva.desenlace === 'indicacion_quirurgica' ? null : nueva.desenlace, ojoOperar: indicacion === 'Sí' ? ojoValido : null }
  }
  if (nueva.desenlace !== anterior.desenlace || nueva.ojoOperar !== anterior.ojoOperar) {
    const quirurgica = nueva.desenlace === 'indicacion_quirurgica'
    return { ...nueva, ojoOperar: quirurgica ? nueva.ojoOperar : null, hallazgos: { ...nueva.hallazgos,
      cat_indicacion: { AO: quirurgica ? 'Sí' : 'No' },
      cat_ojo_operar: { AO: quirurgica ? nueva.ojoOperar ?? '' : '' },
    } }
  }
  return nueva
}

/** Anexo de solo adición: no cambia la consulta ni la orden emitida al cerrar. */
export function anexarResultado(c: Consulta, resultado: ResultadoExamen): Consulta {
  const orden = c.ordenesExamen.find((o) => o.id === resultado.ordenId)
  if (c.estado !== 'cerrada' || !orden?.emitida || !resultado.referencia.trim()) return c
  return { ...c, resultadosExamen: [...(c.resultadosExamen ?? []), { ...resultado, referencia: resultado.referencia.trim() }] }
}
