import { NOMBRE_DESENLACE } from '../../lib/catalogos'
import { establecimiento, sic as buscarSic } from '../../lib/datos'
import type { Consulta, Diagnostico, OrdenExamen, RecetaMedicamento, RecetaOptica } from '../../lib/tipos'

// Cuerpos de los documentos imprimibles. La hoja (membrete, paciente, firma) es HojaDocumento.

const th = 'border border-line px-2 py-1.5 text-left font-semibold'
const td = 'border border-line px-2 py-1.5'

function textoDx(d: Diagnostico) {
  return `${d.codigo} ${d.descripcion}${d.lateralidad ? ` (${d.lateralidad})` : ''}`
}

export function CuerpoRecetaOptica({ receta }: { receta: RecetaOptica }) {
  const filas: { etiqueta: string; clave: keyof RecetaOptica['OD'] }[] = [
    { etiqueta: 'Esfera (D)', clave: 'esfera' },
    { etiqueta: 'Cilindro (D)', clave: 'cilindro' },
    { etiqueta: 'Eje (°)', clave: 'eje' },
    { etiqueta: 'Adición (D)', clave: 'adicion' },
  ]
  return (
    <>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className={th}>Lejos / cerca</th>
            <th className={`${th} text-center`}>OD · ojo derecho</th>
            <th className={`${th} text-center`}>OI · ojo izquierdo</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.clave}>
              <th scope="row" className={th}>
                {f.etiqueta}
              </th>
              <td className={`${td} text-center`}>{receta.OD[f.clave] || '—'}</td>
              <td className={`${td} text-center`}>{receta.OI[f.clave] || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm">
        <strong>Distancia pupilar:</strong> {receta.distanciaPupilar ? `${receta.distanciaPupilar} mm` : '—'}
      </p>
      {receta.indicaciones && (
        <p className="mt-1 text-sm">
          <strong>Indicaciones:</strong> {receta.indicaciones}
        </p>
      )}
    </>
  )
}

export function CuerpoRecetaMedicamentos({ recetas }: { recetas: RecetaMedicamento[] }) {
  return (
    <ol className="flex list-decimal flex-col gap-3 pl-5">
      {recetas.map((r) => (
        <li key={r.id}>
          <p className="font-semibold">{r.farmaco || 'Fármaco sin indicar'}</p>
          <p className="text-sm">
            {r.dosis || '—'} en {r.ojo === 'OD' ? 'ojo derecho (OD)' : r.ojo === 'OI' ? 'ojo izquierdo (OI)' : r.ojo === 'AO' ? 'ambos ojos (AO)' : 'ojo sin indicar'} · {r.frecuencia || '—'} · {r.duracion || '—'}
          </p>
        </li>
      ))}
    </ol>
  )
}

export function CuerpoOrden({ orden, diagnosticos }: { orden: OrdenExamen; diagnosticos: Diagnostico[] }) {
  const principal = diagnosticos.find((d) => d.principal)
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      <dt className="font-semibold">Examen</dt>
      <dd>{orden.examen}</dd>
      <dt className="font-semibold">Ojo</dt>
      <dd>{orden.ojo ?? '—'}</dd>
      <dt className="font-semibold">Indicación</dt>
      <dd>{orden.indicacion || '—'}</dd>
      <dt className="font-semibold">Diagnóstico</dt>
      <dd>{principal ? textoDx(principal) : 'Pendiente'}</dd>
      <dt className="font-semibold">Resultado</dt>
      <dd>Registrar en el módulo dónde queda el resultado (sistema del equipo o informe en papel).</dd>
    </dl>
  )
}

export function CuerpoContrarreferencia({ consulta }: { consulta: Consulta }) {
  const s = buscarSic(consulta.sicId)
  const cr = consulta.contrarreferencia
  const destino = cr ? establecimiento(cr.destinoId) : establecimiento(s.establecimientoId)
  return (
    <dl className="flex flex-col gap-3 text-sm">
      <div>
        <dt className="font-semibold">Establecimiento de destino</dt>
        <dd>
          {destino.nombre} ({destino.tipo}) · responde a SIC {s.folio} de {s.profesional.nombre}, {s.profesional.profesion.toLowerCase()}
        </dd>
      </div>
      <div>
        <dt className="font-semibold">Diagnóstico</dt>
        <dd>
          {consulta.diagnosticos.length ? (
            <ul className="list-disc pl-5">
              {consulta.diagnosticos.map((d) => (
                <li key={d.id}>
                  {textoDx(d)} {d.principal && '· principal'}
                </li>
              ))}
            </ul>
          ) : (
            'Sin diagnóstico registrado'
          )}
        </dd>
      </div>
      <div>
        <dt className="font-semibold">Desenlace</dt>
        <dd>
          {consulta.desenlace ? NOMBRE_DESENLACE[consulta.desenlace] : '—'}
          {consulta.desenlace === 'control' && consulta.plazoControl && ` en ${consulta.plazoControl}`}
          {consulta.desenlace === 'indicacion_quirurgica' && consulta.ojoOperar && ` (${consulta.ojoOperar}). La lista de espera quirúrgica se gestiona en el SOME.`}
        </dd>
      </div>
      <div>
        <dt className="font-semibold">Conducta</dt>
        <dd>{cr?.conducta || '—'}</dd>
      </div>
      <div>
        <dt className="font-semibold">Control sugerido</dt>
        <dd>{cr?.controlSugerido || '—'}</dd>
      </div>
    </dl>
  )
}

export function CuerpoResumen({ texto }: { texto: string }) {
  return <p className="text-base leading-relaxed whitespace-pre-line">{texto || 'Sin texto.'}</p>
}

/** Primer borrador del resumen para el paciente, en lenguaje simple. El médico lo edita. */
export function resumenSugerido(c: Consulta): string {
  const partes: string[] = []
  const principal = c.diagnosticos.find((d) => d.principal)
  const lado = (l: string | null) => (l === 'OD' ? 'el ojo derecho' : l === 'OI' ? 'el ojo izquierdo' : 'ambos ojos')
  if (principal) partes.push(`Hoy se le diagnosticó: ${principal.descripcion.toLowerCase()} en ${lado(principal.lateralidad)}.`)
  if (c.recetaOptica?.emitida) partes.push('Se le entregó una receta de lentes. Llévela a la óptica.')
  for (const r of c.recetasMedicamento.filter((x) => x.farmaco)) partes.push(`Use ${r.farmaco.split(' ')[0].toLowerCase()}: ${r.dosis || 'según receta'} en ${lado(r.ojo)}, ${r.frecuencia.toLowerCase()}, durante ${r.duracion.toLowerCase()}.`)
  for (const o of c.ordenesExamen) partes.push(`Debe hacerse el examen: ${o.examen.toLowerCase()}.`)
  if (c.desenlace === 'control') partes.push(`Debe volver a control en ${c.plazoControl || 'el plazo indicado'}. El SOME del hospital le dará la hora.`)
  if (c.desenlace === 'alta') partes.push('Puede seguir sus controles en su CESFAM. Vuelva a consultar si nota que la visión baja.')
  if (c.desenlace === 'examen_pendiente') partes.push('Cuando tenga el resultado del examen, se decide el tratamiento en una nueva consulta.')
  if (c.desenlace === 'indicacion_quirurgica') partes.push(`Se indicó operar ${lado(c.ojoOperar)}. El SOME del hospital lo llamará para la cirugía.`)
  partes.push('Si tiene dolor fuerte, ojo rojo o pérdida brusca de visión, consulte en urgencia.')
  return partes.join('\n')
}
