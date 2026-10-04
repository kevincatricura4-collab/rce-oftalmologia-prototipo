import { ArrowSquareOut } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { FormularioExamen } from '../../components/FormularioExamen'
import { Tarjeta } from '../../components/ui'
import { camposPendientes, controlesPrevios } from '../../lib/consulta'
import { hora, mesAnio, nombreMes } from '../../lib/formato'
import { useEstado, usuarioPorId } from '../../lib/store'
import type { Consulta, Lateralidad, Ojo } from '../../lib/tipos'
import type { PropsPaso } from './contexto'

/** Pantalla 4 — Consulta, paso 2: examen por ojo según el tipo de atención (RF-05, RF-06). */
export function PasoExamen({ consulta, cita, plantilla, soloLectura, actualizar }: PropsPaso) {
  const { datos } = useEstado()
  const pa = cita?.preAtencion ?? null
  const pendientes = camposPendientes(plantilla, consulta.hallazgos)

  const fijar = (cambios: { campoId: string; lado: Lateralidad; valor: string }[]) =>
    actualizar((c) => {
      const hallazgos = { ...c.hallazgos }
      for (const { campoId, lado, valor } of cambios) hallazgos[campoId] = { ...hallazgos[campoId], [lado]: valor }
      return { ...c, hallazgos }
    })

  const glaucoma = consulta.tipoAtencion === 'glaucoma'

  return (
    <div className={glaucoma ? 'grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]' : 'grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]'}>
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">
            Examen por ojo · {plantilla.nombre} <span className="text-sm font-normal text-fg-muted">({plantilla.ficha})</span>
          </h2>
          {!soloLectura && (
            <p className="text-[0.8125rem] text-fg-muted">
              {pendientes.length ? `${pendientes.length} campos del tipo de atención se revisan al cerrar` : 'Campos del tipo de atención completos'}
            </p>
          )}
        </div>
        <FormularioExamen
          plantilla={plantilla}
          hallazgos={consulta.hallazgos}
          preAtencion={pa}
          soloLectura={soloLectura}
          onCambio={(campoId, lado, valor) => fijar([{ campoId, lado, valor }])}
          onVarios={fijar}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-20">
        {glaucoma && <PanelControlesPrevios consulta={consulta} />}
        {pa ? (
          <Tarjeta titulo="Pre-atención" pie={`Registrada por ${usuarioPorId(datos, pa.autorId)?.nombre} a las ${hora(pa.fecha)}`}>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-fg-muted">PIO</dt>
              <dd className="tnum">
                OD {pa.pio.OD || '—'} · OI {pa.pio.OI || '—'} mmHg
              </dd>
              <dt className="text-fg-muted">Método</dt>
              <dd>
                {pa.metodoPio || '—'}, {pa.horaPio}
              </dd>
              <dt className="text-fg-muted">Observ.</dt>
              <dd>{pa.observaciones || 'Sin observaciones'}</dd>
            </dl>
          </Tarjeta>
        ) : (
          <Tarjeta titulo="Pre-atención">
            <p className="text-sm text-fg-muted">El paciente entró sin pre-atención. AV y PIO se registran aquí.</p>
          </Tarjeta>
        )}
      </div>
    </div>
  )
}

/** Panel lateral de glaucoma: la comparación en el tiempo, por ojo, es la función principal. */
function PanelControlesPrevios({ consulta }: { consulta: Consulta }) {
  const { datos } = useEstado()
  const previos = controlesPrevios(consulta.pacienteId, Object.values(datos.consultas), consulta.id).filter((c) => c.fecha < consulta.inicio)
  const hoy = consulta.hallazgos

  const notaExcavacion = (ojo: Ojo) => {
    const actual = hoy.gl_cd?.[ojo]
    const primero = previos.find((p) => p.cd[ojo])
    if (!actual || !primero) return null
    const mes = nombreMes(primero.fecha)
    if (primero.cd[ojo] === actual) return `Excavación ${ojo}: sin cambio desde ${mes} (${actual})`
    return `Excavación ${ojo}: ${primero.cd[ojo]} en ${mes}, ${actual} hoy`
  }
  const notas = (['OD', 'OI'] as Ojo[]).map(notaExcavacion).filter(Boolean)

  return (
    <section aria-labelledby="pio-previos" className="rounded-lg border border-line bg-muted p-4 sm:p-5">
      <h2 id="pio-previos" className="text-base font-semibold">
        PIO en controles previos
      </h2>
      {previos.length === 0 ? (
        <p className="mt-2 text-sm text-fg-muted">Primer control: no hay registros previos en el módulo.</p>
      ) : (
        <table className="mt-3 w-full text-[0.9375rem]">
          <caption className="sr-only">Presión intraocular por ojo en controles anteriores y hoy, en mmHg</caption>
          <thead>
            <tr className="border-b border-line-strong/50 text-sm text-fg-muted">
              <th scope="col" className="pb-1.5 text-left font-medium">
                Fecha
              </th>
              <th scope="col" className="pb-1.5 text-right font-medium">
                <span className="text-od">OD</span>
              </th>
              <th scope="col" className="pb-1.5 text-right font-medium">
                <span className="text-oi">OI</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {previos.map((p) => (
              <tr key={p.consultaId}>
                <th scope="row" className="py-1.5 text-left font-normal">
                  {mesAnio(p.fecha)}
                </th>
                <td className="py-1.5 text-right">{p.pio.OD || '—'}</td>
                <td className="py-1.5 text-right">{p.pio.OI || '—'}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <th scope="row" className="py-1.5 text-left">
                Hoy
              </th>
              <td className="py-1.5 text-right">{hoy.pio?.OD || '—'}</td>
              <td className="py-1.5 text-right">{hoy.pio?.OI || '—'}</td>
            </tr>
          </tbody>
        </table>
      )}
      {notas.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 text-sm text-fg-muted">
          {notas.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <Link to={`/historial/${consulta.pacienteId}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        Ver evolución completa
        <ArrowSquareOut size={14} aria-hidden="true" />
      </Link>
    </section>
  )
}
