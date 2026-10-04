import { ArrowRight, Check, WarningOctagon } from '@phosphor-icons/react'
import { camposPorGrupo, vieneDePreAtencion } from '../lib/consulta'
import { aNumero, comaDecimal } from '../lib/formato'
import { SIN_HALLAZGOS, campoVisible } from '../lib/plantillas'
import type { CampoPlantilla, Hallazgos, Lateralidad, Ojo, Plantilla, PreAtencion } from '../lib/tipos'
import { Segmentado, claseEntrada, cx } from './ui'

// Formulario de examen dirigido por plantilla (RF-05, RF-06, RNF-07). No hay un formulario
// escrito a mano por tipo de atención: filas, controles y atajos salen de la definición.
// Columnas fijas Campo · OD · OI; nunca se invierte el orden.

interface Props {
  plantilla: Plantilla
  hallazgos: Hallazgos
  preAtencion: PreAtencion | null
  soloLectura: boolean
  onCambio: (campoId: string, lado: Lateralidad, valor: string) => void
  onVarios: (cambios: { campoId: string; lado: Lateralidad; valor: string }[]) => void
}

const OJOS: Ojo[] = ['OD', 'OI']

/** Rango de referencia de la PIO: sobre 21 mmHg se marca como fuera de rango. */
const PIO_MAXIMA_NORMAL = 21

export function FormularioExamen({ plantilla, hallazgos, preAtencion, soloLectura, onCambio, onVarios }: Props) {
  const grupos = camposPorGrupo(plantilla)

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <caption className="sr-only">Examen por ojo, {plantilla.nombre}. Columnas: campo, ojo derecho (OD), ojo izquierdo (OI).</caption>
        <colgroup>
          <col />
          <col className="w-[30%]" />
          <col className="w-[30%]" />
        </colgroup>
        <thead className="bg-muted">
          <tr className="border-b border-line">
            <th scope="col" className="px-3 py-2.5 text-sm font-semibold sm:px-4">
              Campo
            </th>
            <th scope="col" className="px-2 py-2.5 text-center text-sm font-bold text-od">
              OD <span className="font-normal text-fg-muted">· ojo derecho</span>
            </th>
            <th scope="col" className="px-2 py-2.5 text-center text-sm font-bold text-oi">
              OI <span className="font-normal text-fg-muted">· ojo izquierdo</span>
            </th>
          </tr>
        </thead>
        {grupos.map(({ grupo, campos }) => {
          const visibles = campos.filter((c) => campoVisible(c, hallazgos))
          const porOjo = visibles.filter((c) => c.lateralidad === 'por_ojo')
          const deTexto = porOjo.filter((c) => c.tipo === 'texto')
          const sinHallazgosEn = (ojo: Ojo) => deTexto.length > 0 && deTexto.every((c) => hallazgos[c.id]?.[ojo] === SIN_HALLAZGOS)
          const odConDatos = porOjo.some((c) => hallazgos[c.id]?.OD)

          return (
            <tbody key={grupo.nombre} className="border-b border-line last:border-b-0">
              <tr className="bg-canvas/60">
                <th scope="colgroup" className="px-3 pt-3 pb-1.5 sm:px-4">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-display text-[0.9375rem] font-semibold">{grupo.nombre}</span>
                    {!soloLectura && porOjo.length > 1 && odConDatos && (
                      <button
                        type="button"
                        onClick={() =>
                          onVarios(porOjo.filter((c) => hallazgos[c.id]?.OD).map((c) => ({ campoId: c.id, lado: 'OI', valor: hallazgos[c.id]!.OD! })))
                        }
                        className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[0.8125rem] font-medium text-primary transition-colors duration-150 hover:bg-primary-soft"
                      >
                        Copiar OD
                        <ArrowRight size={14} aria-hidden="true" />
                        OI
                      </button>
                    )}
                  </span>
                </th>
                {grupo.sinHallazgos && deTexto.length > 0 ? (
                  OJOS.map((ojo) => {
                    const activo = sinHallazgosEn(ojo)
                    return (
                      <td key={ojo} className="px-2 pt-3 pb-1.5 text-center">
                        <button
                          type="button"
                          disabled={soloLectura}
                          aria-pressed={activo}
                          onClick={() => onVarios(deTexto.map((c) => ({ campoId: c.id, lado: ojo, valor: activo ? '' : SIN_HALLAZGOS })))}
                          className={cx(
                            'inline-flex h-8 w-full max-w-44 items-center justify-center gap-1.5 rounded-md border px-2 text-sm font-medium transition-colors duration-150',
                            activo ? 'border-primary bg-primary-soft text-fg' : 'border-line-strong bg-surface hover:bg-muted',
                          )}
                        >
                          {activo && <Check size={14} weight="bold" aria-hidden="true" />}
                          Sin hallazgos <span className="sr-only">{ojo === 'OD' ? 'ojo derecho' : 'ojo izquierdo'}, {grupo.nombre}</span>
                        </button>
                      </td>
                    )
                  })
                ) : (
                  <td colSpan={2} />
                )}
              </tr>
              {visibles.map((campo) => (
                <FilaCampo key={campo.id} campo={campo} hallazgos={hallazgos} preAtencion={preAtencion} soloLectura={soloLectura} onCambio={onCambio} />
              ))}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}

function FilaCampo({ campo, hallazgos, preAtencion, soloLectura, onCambio }: { campo: CampoPlantilla; hallazgos: Hallazgos; preAtencion: PreAtencion | null; soloLectura: boolean; onCambio: Props['onCambio'] }) {
  const valor = hallazgos[campo.id] ?? {}
  const lados: Lateralidad[] = campo.lateralidad === 'AO' ? ['AO'] : OJOS

  let origen: string | null = null
  if (campo.desdePreAtencion && preAtencion) {
    const conValor = lados.filter((l) => valor[l])
    const desdePa = conValor.filter((l) => vieneDePreAtencion(campo.id, l, valor[l], preAtencion))
    if (conValor.length && desdePa.length === conValor.length) origen = 'desde pre-atención'
    else if (desdePa.length < conValor.length) origen = 'corregido sobre pre-atención'
  }

  return (
    <tr className="border-t border-line/70">
      <th scope="row" className="px-3 py-1.5 align-middle font-normal sm:px-4">
        <span className="text-[0.9375rem]">{campo.etiqueta}</span>
        {campo.unidad && <span className="text-fg-muted"> ({campo.unidad})</span>}
        {origen && <span className="ml-2 inline-block text-[0.8125rem] text-fg-muted">{origen}</span>}
        {campo.personalizado && <span className="ml-2 inline-block text-[0.8125rem] text-fg-muted">campo agregado por configuración</span>}
      </th>
      {campo.lateralidad === 'AO' ? (
        <td colSpan={2} className="px-2 py-1.5">
          <Control campo={campo} lado="AO" valor={valor.AO ?? ''} soloLectura={soloLectura} onCambio={onCambio} />
        </td>
      ) : (
        OJOS.map((ojo) => (
          <td key={ojo} className="px-2 py-1.5 align-top">
            <Control campo={campo} lado={ojo} valor={valor[ojo] ?? ''} soloLectura={soloLectura} onCambio={onCambio} />
          </td>
        ))
      )}
    </tr>
  )
}

function Control({ campo, lado, valor, soloLectura, onCambio }: { campo: CampoPlantilla; lado: Lateralidad; valor: string; soloLectura: boolean; onCambio: Props['onCambio'] }) {
  const etiqueta = `${campo.etiqueta}${lado === 'AO' ? '' : `, ${lado === 'OD' ? 'ojo derecho (OD)' : 'ojo izquierdo (OI)'}`}`
  const cambiar = (v: string) => onCambio(campo.id, lado, v)
  const centrado = lado !== 'AO'

  switch (campo.tipo) {
    case 'opcion':
      return (
        <select aria-label={etiqueta} value={valor} disabled={soloLectura} onChange={(e) => cambiar(e.target.value)} className={cx(claseEntrada, 'h-9 pr-8', centrado && 'text-center')}>
          <option value="">—</option>
          {campo.opciones?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )

    case 'opciones': {
      const elegidas = valor ? valor.split('; ') : []
      return (
        <fieldset disabled={soloLectura} className="flex flex-wrap gap-x-4 gap-y-1 py-1">
          <legend className="sr-only">{etiqueta}</legend>
          {campo.opciones?.map((o) => (
            <label key={o} className="inline-flex min-h-8 items-center gap-2 text-[0.9375rem]">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={elegidas.includes(o)}
                onChange={(e) => {
                  // "Ninguna" excluye a las demás opciones.
                  let nuevas = e.target.checked ? [...elegidas, o] : elegidas.filter((x) => x !== o)
                  if (e.target.checked && o === 'Ninguna') nuevas = ['Ninguna']
                  else if (e.target.checked) nuevas = nuevas.filter((x) => x !== 'Ninguna')
                  cambiar(campo.opciones!.filter((x) => nuevas.includes(x)).join('; '))
                }}
              />
              {o}
            </label>
          ))}
        </fieldset>
      )
    }

    case 'si_no':
      return <Segmentado pequeno nombre={campo.id} etiqueta={etiqueta} ocultarEtiqueta disabled={soloLectura} valor={valor} onCambio={cambiar} opciones={[{ valor: 'Sí', texto: 'Sí' }, { valor: 'No', texto: 'No' }]} />

    case 'ojo':
      return <Segmentado pequeno nombre={campo.id} etiqueta={etiqueta} ocultarEtiqueta disabled={soloLectura} valor={valor} onCambio={cambiar} opciones={[{ valor: 'OD', texto: 'OD' }, { valor: 'OI', texto: 'OI' }, { valor: 'AO', texto: 'AO (ambos)' }]} />

    default: {
      const pioAlta = campo.id === 'pio' && (aNumero(valor) ?? 0) > PIO_MAXIMA_NORMAL
      const esNumero = campo.tipo === 'numero' || campo.tipo === 'decimal'
      return (
        <>
          <input
            aria-label={etiqueta}
            type={campo.tipo === 'fecha' ? 'date' : 'text'}
            inputMode={campo.tipo === 'numero' ? 'numeric' : campo.tipo === 'decimal' ? 'decimal' : undefined}
            value={valor}
            readOnly={soloLectura}
            placeholder={soloLectura ? undefined : campo.placeholder}
            onChange={(e) => cambiar(e.target.value)}
            onBlur={(e) => campo.tipo === 'decimal' && e.target.value.includes('.') && cambiar(comaDecimal(e.target.value))}
            aria-describedby={pioAlta ? `${campo.id}-${lado}-rango` : undefined}
            className={cx(claseEntrada, 'h-9', centrado && 'text-center', esNumero && 'font-medium', pioAlta && 'border-danger ring-1 ring-danger')}
          />
          {pioAlta && (
            <p id={`${campo.id}-${lado}-rango`} className="mt-0.5 flex items-center justify-center gap-1 text-[0.8125rem] font-medium text-danger">
              <WarningOctagon size={14} aria-hidden="true" />
              Sobre {PIO_MAXIMA_NORMAL} mmHg
            </p>
          )}
        </>
      )
    }
  }
}
