import { camposPorGrupo, vieneDePreAtencion } from '../lib/consulta'
import { aNumero, comaDecimal, normalizarFecha, normalizarHora } from '../lib/formato'
import { SIN_HALLAZGOS, campoVisible } from '../lib/plantillas'
import type { CampoPlantilla, Hallazgos, Lateralidad, Ojo, Plantilla, PreAtencion } from '../lib/tipos'
import { IconoAvanzar, IconoFueraDeRango } from './iconos'
import { Segmentado, claseEntrada, cx } from './ui'

// Formulario de examen dirigido por plantilla (RF-05, RF-06, RNF-07). No hay un formulario
// escrito a mano por tipo de atención: filas, controles y atajos salen de la definición.
// Columnas fijas Campo · OD · OI; nunca se invierte el orden. En pantallas angostas la etiqueta
// sube sobre la fila y OD / OI siguen lado a lado, para que OI nunca quede fuera de la vista.

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
  // En glaucoma la referencia es la PIO objetivo de cada ojo, no solo el límite poblacional de 21 mmHg.
  const usaPioObjetivo = plantilla.campos.some((c) => c.id === 'gl_pio_objetivo')

  return (
    <div className="rounded-lg border border-line relative bg-surface sm:overflow-x-auto">
      <table className="w-full border-collapse text-left max-sm:block sm:min-w-[34rem]">
        <caption className="sr-only">Examen por ojo, {plantilla.nombre}. Columnas: campo, ojo derecho (OD), ojo izquierdo (OI).</caption>
        <colgroup>
          <col />
          <col className="w-[30%]" />
          <col className="w-[30%]" />
        </colgroup>
        <thead className="bg-muted max-sm:block">
          <tr className="border-b border-line max-sm:grid max-sm:grid-cols-2">
            <th scope="col" className="px-3 py-2.5 text-sm font-semibold max-sm:hidden sm:px-4">
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
          // Copiar OD → OI solo donde la plantilla lo permite (hallazgos descriptivos), nunca en AV o PIO.
          const copiables = grupo.copiarOdOi ? porOjo.filter((c) => hallazgos[c.id]?.OD) : []

          return (
            <tbody key={grupo.nombre} className="border-b border-line last:border-b-0 max-sm:block">
              <tr className="bg-canvas/60 max-sm:grid max-sm:grid-cols-2">
                <th scope="colgroup" className="px-3 pt-3 pb-1.5 max-sm:col-span-2 sm:px-4">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-display text-[0.9375rem] font-semibold">{grupo.nombre}</span>
                    {!soloLectura && copiables.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onVarios(copiables.map((c) => ({ campoId: c.id, lado: 'OI', valor: hallazgos[c.id]!.OD! })))}
                        className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[0.8125rem] font-medium text-primary transition-colors duration-150 hover:bg-primary-soft"
                      >
                        Copiar OD
                        <IconoAvanzar size={16} aria-hidden="true" />
                        OI<span className="sr-only">, {grupo.nombre}</span>
                      </button>
                    )}
                  </span>
                </th>
                {grupo.sinHallazgos && deTexto.length > 0 && !soloLectura ? (
                  // Casilla y no botón: un botón con el texto "Sin hallazgos" se confundía con un campo ya
                  // llenado con ese valor. En solo lectura no se muestra: los campos ya dicen lo registrado.
                  OJOS.map((ojo) => {
                    const activo = sinHallazgosEn(ojo)
                    return (
                      <td key={ojo} className="px-2 pt-3 pb-1.5">
                        <label className="inline-flex min-h-8 cursor-pointer items-center gap-2 text-sm font-medium">
                          <input
                            type="checkbox"
                            className="size-4 shrink-0 accent-primary"
                            checked={activo}
                            onChange={(e) => onVarios(deTexto.map((c) => ({ campoId: c.id, lado: ojo, valor: e.target.checked ? SIN_HALLAZGOS : '' })))}
                          />
                          Sin hallazgos <span className="sr-only">{ojo === 'OD' ? 'ojo derecho' : 'ojo izquierdo'}, {grupo.nombre}</span>
                        </label>
                      </td>
                    )
                  })
                ) : (
                  <td colSpan={2} className="max-sm:hidden" />
                )}
              </tr>
              {visibles.map((campo) => (
                <FilaCampo key={campo.id} campo={campo} hallazgos={hallazgos} preAtencion={preAtencion} soloLectura={soloLectura} usaPioObjetivo={usaPioObjetivo} onCambio={onCambio} />
              ))}
            </tbody>
          )
        })}
      </table>
    </div>
  )
}

function FilaCampo({ campo, hallazgos, preAtencion, soloLectura, usaPioObjetivo, onCambio }: { campo: CampoPlantilla; hallazgos: Hallazgos; preAtencion: PreAtencion | null; soloLectura: boolean; usaPioObjetivo: boolean; onCambio: Props['onCambio'] }) {
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
    <tr className="border-t border-line/70 max-sm:grid max-sm:grid-cols-2">
      <th scope="row" className="px-3 py-1.5 align-middle font-normal max-sm:col-span-2 max-sm:pb-0 sm:px-4">
        <span className="text-[0.9375rem]">{campo.etiqueta}</span>
        {campo.unidad && <span className="text-fg-muted"> ({campo.unidad})</span>}
        {origen && <span className="ml-2 inline-block text-[0.8125rem] text-fg-muted">{origen}</span>}
        {campo.personalizado && <span className="ml-2 inline-block text-[0.8125rem] text-fg-muted">campo agregado por configuración</span>}
      </th>
      {campo.lateralidad === 'AO' ? (
        <td colSpan={2} className="px-2 py-1.5 max-sm:col-span-2">
          <Control campo={campo} lado="AO" valor={valor.AO ?? ''} soloLectura={soloLectura} onCambio={onCambio} />
        </td>
      ) : (
        OJOS.map((ojo) => (
          <td key={ojo} className="px-2 py-1.5 align-top">
            <Control campo={campo} lado={ojo} valor={valor[ojo] ?? ''} pioObjetivo={campo.id === 'pio' && usaPioObjetivo ? hallazgos.gl_pio_objetivo?.[ojo] : undefined} soloLectura={soloLectura} onCambio={onCambio} />
          </td>
        ))
      )}
    </tr>
  )
}

function Control({ campo, lado, valor, pioObjetivo, soloLectura, onCambio }: { campo: CampoPlantilla; lado: Lateralidad; valor: string; pioObjetivo?: string; soloLectura: boolean; onCambio: Props['onCambio'] }) {
  const etiqueta = `${campo.etiqueta}${lado === 'AO' ? '' : `, ${lado === 'OD' ? 'ojo derecho (OD)' : 'ojo izquierdo (OI)'}`}`
  const cambiar = (v: string) => onCambio(campo.id, lado, v)
  const esNumero = campo.tipo === 'numero' || campo.tipo === 'decimal'
  // Solo las cifras van centradas, para compararlas OD contra OI; el texto se lee mejor alineado a la izquierda.
  const centrado = lado !== 'AO' && (esNumero || campo.tipo === 'fecha' || campo.tipo === 'hora')

  switch (campo.tipo) {
    case 'opcion':
      return (
        <select aria-label={etiqueta} value={valor} disabled={soloLectura} onChange={(e) => cambiar(e.target.value)} className={cx(claseEntrada, 'h-9 pr-8')}>
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
      const pio = campo.id === 'pio' ? aNumero(valor) : null
      const objetivo = aNumero(pioObjetivo)
      const alertaPio =
        pio === null ? null : objetivo !== null && pio > objetivo ? `Sobre objetivo (${pioObjetivo} mmHg)` : pio > PIO_MAXIMA_NORMAL ? `Sobre ${PIO_MAXIMA_NORMAL} mmHg` : null
      const pioAlta = alertaPio !== null
      // Fecha y hora como texto en formato chileno (dd-mm-aaaa, 24 h), sin depender del idioma del navegador.
      const normalizar = campo.tipo === 'decimal' ? comaDecimal : campo.tipo === 'fecha' ? normalizarFecha : campo.tipo === 'hora' ? normalizarHora : null
      const ayuda = campo.tipo === 'fecha' ? 'dd-mm-aaaa' : campo.tipo === 'hora' ? 'hh:mm' : campo.placeholder
      return (
        <>
          <input
            aria-label={`${etiqueta}${campo.tipo === 'fecha' ? ', formato día-mes-año' : ''}`}
            type="text"
            inputMode={campo.tipo === 'numero' || campo.tipo === 'hora' ? 'numeric' : campo.tipo === 'decimal' ? 'decimal' : undefined}
            value={valor}
            readOnly={soloLectura}
            placeholder={soloLectura ? undefined : ayuda}
            onChange={(e) => cambiar(e.target.value)}
            onBlur={(e) => {
              if (!normalizar) return
              const limpio = normalizar(e.target.value)
              if (limpio !== e.target.value) cambiar(limpio)
            }}
            aria-describedby={pioAlta ? `${campo.id}-${lado}-rango` : undefined}
            className={cx(claseEntrada, 'h-9', centrado && 'text-center', esNumero && 'font-medium', pioAlta && 'border-danger ring-1 ring-danger')}
          />
          {pioAlta && (
            <p id={`${campo.id}-${lado}-rango`} className="mt-0.5 flex items-center justify-center gap-1 text-[0.8125rem] font-medium text-danger">
              <IconoFueraDeRango size={16} className="shrink-0" aria-hidden="true" />
              {alertaPio}
            </p>
          )}
        </>
      )
    }
  }
}
