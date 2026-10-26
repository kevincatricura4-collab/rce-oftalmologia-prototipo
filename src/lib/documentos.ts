import { aNumero } from './formato'
import type { Consulta, OrdenExamen, RecetaMedicamento, RecetaOptica } from './tipos'

/** Se valida al emitir, nunca al guardar un borrador. */
export function erroresMedicamentos(recetas: RecetaMedicamento[]): string[] {
  if (!recetas.length) return ['Agregue al menos un fármaco.']
  return recetas.flatMap((r, i) => {
    const faltan = [!r.farmaco.trim() && 'fármaco', !r.dosis.trim() && 'dosis', !r.frecuencia.trim() && 'frecuencia', !r.duracion.trim() && 'duración', !r.ojo && 'ojo'].filter(Boolean)
    return faltan.length ? [`Fármaco ${i + 1}: complete ${faltan.join(', ')}.`] : []
  })
}

export function erroresOptica(r: RecetaOptica | null): string[] {
  if (!r) return ['Complete la receta óptica.']
  const ojos = (['OD', 'OI'] as const).filter((o) => Object.values(r[o]).some((v) => v.trim()))
  if (!ojos.length) return ['Registre los valores de al menos un ojo.']
  return ojos.flatMap((o) => {
    const v = r[o]
    const errores: string[] = []
    if (!v.esfera.trim()) errores.push(`${o}: indique la esfera (puede ser 0).`)
    for (const [clave, valor] of Object.entries(v)) {
      if (valor.trim() && aNumero(valor) === null) errores.push(`${o}: ${clave} debe ser un número.`)
    }
    if (v.cilindro.trim() && aNumero(v.cilindro) !== 0 && !v.eje.trim()) errores.push(`${o}: indique el eje del cilindro.`)
    const eje = aNumero(v.eje)
    if (eje !== null && (eje < 0 || eje > 180 || !Number.isInteger(eje))) errores.push(`${o}: el eje debe ser un entero entre 0 y 180°.`)
    return errores
  })
}

export function erroresOrden(o: OrdenExamen): string[] {
  return [!o.examen.trim() && 'Seleccione el examen.', !o.ojo && 'Indique el ojo del examen.', !o.indicacion.trim() && 'Escriba la indicación del examen.'].filter((x): x is string => Boolean(x))
}

export function erroresContrarreferencia(c: Consulta): string[] {
  const cr = c.contrarreferencia
  return [!cr?.destinoId && 'Seleccione el establecimiento de destino.', !c.diagnosticos.some((d) => d.principal && d.lateralidad) && 'Registre un diagnóstico principal con lateralidad.', !c.desenlace && 'Seleccione el desenlace.', !cr?.conducta.trim() && 'Complete la conducta.', !cr?.controlSugerido.trim() && 'Complete el control sugerido (o indique que no corresponde).'].filter((x): x is string => Boolean(x))
}

export function sugerenciaContrarreferencia(c: Consulta) {
  const acciones = c.recetasMedicamento.filter((r) => r.emitida).map((r) => `${r.farmaco}: ${r.dosis}, ${r.frecuencia}, ${r.duracion} (${r.ojo})`)
  if (c.recetaOptica?.emitida) acciones.push('Se emitió receta óptica.')
  for (const o of c.ordenesExamen.filter((o) => o.emitida)) acciones.push(`Se solicita ${o.examen} (${o.ojo}).`)
  if (c.desenlace === 'indicacion_quirurgica') acciones.push(`Indicación quirúrgica (${c.ojoOperar ?? 'ojo por definir'}); gestión por SOME.`)
  const controlSugerido = c.desenlace === 'control' ? `Control en ${c.plazoControl}.` : c.desenlace === 'examen_pendiente' ? `Reevaluar con resultado de ${c.examenPendiente}.` : ''
  return { conducta: acciones.join('\n'), controlSugerido }
}
