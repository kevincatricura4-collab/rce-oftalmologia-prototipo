import { useState } from 'react'
import { AreaTexto, Boton, Campo } from '../../components/ui'
import { fechaHora } from '../../lib/formato'
import { useEstado, usuarioPorId } from '../../lib/store'
import type { Consulta, OrdenExamen } from '../../lib/tipos'

export function ResultadosPosteriores({ consulta, orden }: { consulta: Consulta; orden: OrdenExamen }) {
  const { datos, registrarResultado } = useEstado()
  const [referencia, setReferencia] = useState('')
  const [guardado, setGuardado] = useState(false)
  const resultados = (consulta.resultadosExamen ?? []).filter((r) => r.ordenId === orden.id)
  return (
    <section className="mt-4 border-t border-line pt-3" aria-label={`Resultados posteriores de ${orden.examen}`}>
      <h3 className="font-semibold">Resultados posteriores al cierre</h3>
      {resultados.length > 0 && <p className="mt-1 text-sm text-ok">Resultado recibido · {resultados.length} {resultados.length === 1 ? 'incorporación' : 'incorporaciones'} al seguimiento.</p>}
      <p className="mt-1 text-sm text-fg-muted">Agregue la ubicación del informe o una aclaración. Cada incorporación conserva su autor y fecha.</p>
      <ul className="mt-3 flex flex-col gap-3">
        {resultados.map((r) => <li key={r.id} className="text-sm"><p className="whitespace-pre-line">{r.referencia}</p><p className="text-fg-muted">{usuarioPorId(datos, r.autorId)?.nombre} · {fechaHora(r.fecha)}</p></li>)}
      </ul>
      <Campo etiqueta="Ubicación del resultado o aclaración" className="mt-3">
        {(p) => <AreaTexto {...p} rows={2} value={referencia} onChange={(e) => { setReferencia(e.target.value); setGuardado(false) }} placeholder="Ej.: informe OCT en sistema del equipo, sala 3" />}
      </Campo>
      <Boton pequeno className="mt-2" disabled={!referencia.trim()} onClick={() => {
        registrarResultado(consulta.id, orden.id, referencia)
        setReferencia('')
        setGuardado(true)
      }}>Agregar resultado</Boton>
      {guardado && <p role="status" className="mt-2 text-sm text-ok">Resultado agregado al seguimiento.</p>}
    </section>
  )
}
