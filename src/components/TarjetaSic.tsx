import { WarningCircle } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { establecimiento } from '../lib/datos'
import { diasEntre, fecha } from '../lib/formato'
import type { Sic } from '../lib/tipos'
import { Insignia, Tarjeta } from './ui'

/** Campo de la SIC que vino vacío: ícono y texto, no solo color (RF-01). */
function Vacio() {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-warn-soft px-1.5 py-0.5 text-[0.8125rem] font-semibold text-warn">
      <WarningCircle size={14} aria-hidden="true" />
      Vacío en la SIC
    </span>
  )
}

function Dato({ etiqueta, children, vacio, ancho }: { etiqueta: string; children?: ReactNode; vacio?: boolean; ancho?: boolean }) {
  return (
    <div className={ancho ? 'min-w-0 sm:col-span-2' : 'min-w-0'}>
      <dt className="text-[0.8125rem] font-medium text-fg-muted">{etiqueta}</dt>
      <dd className="mt-0.5">{vacio ? <Vacio /> : children}</dd>
    </div>
  )
}

/** SIC de origen en solo lectura (pantalla 3; también en pre-atención). */
export function TarjetaSic({ sic, compacta = false }: { sic: Sic; compacta?: boolean }) {
  const est = establecimiento(sic.establecimientoId)
  const dias = diasEntre(sic.fechaEmision)

  return (
    <Tarjeta
      id="sic"
      titulo={<>SIC de origen <span className="font-normal text-fg-muted">· {sic.folio}</span></>}
      accion={<Insignia>Solo lectura · desde SIC</Insignia>}
    >
      <dl className={compacta ? 'grid gap-3 sm:grid-cols-2' : 'grid gap-x-6 gap-y-3 sm:grid-cols-2'}>
        <Dato etiqueta="Fecha de emisión">
          <span className="tnum">{fecha(sic.fechaEmision)}</span>{' '}
          <span className="text-fg-muted">· {dias} días de espera</span>
        </Dato>
        <Dato etiqueta="Establecimiento de origen">
          {est.nombre} <span className="text-fg-muted">({est.tipo})</span>
        </Dato>
        <Dato etiqueta="Profesional que deriva">
          {sic.profesional.nombre}
          <span className="block text-sm text-fg-muted">{sic.profesional.profesion}</span>
        </Dato>
        <Dato etiqueta="Sospecha diagnóstica" vacio={!sic.sospecha}>
          {sic.sospecha}
        </Dato>
        {!compacta && (
          <Dato etiqueta="Fundamento de la derivación" vacio={!sic.fundamento} ancho>
            {sic.fundamento}
          </Dato>
        )}
        <Dato etiqueta="Agudeza visual previa" vacio={!sic.avPrevia}>
          {sic.avPrevia && (
            <span className="tnum">
              OD {sic.avPrevia.OD} · OI {sic.avPrevia.OI}
            </span>
          )}
        </Dato>
        <Dato etiqueta="PIO previa (mmHg)" vacio={!sic.pioPrevia}>
          {sic.pioPrevia && (
            <span className="tnum">
              OD {sic.pioPrevia.OD} · OI {sic.pioPrevia.OI}
            </span>
          )}
        </Dato>
        {!compacta && (
          <>
            <Dato etiqueta="Antecedente de diabetes" vacio={sic.diabetes === null}>
              {sic.diabetes ? 'Sí' : 'No'}
            </Dato>
            <Dato etiqueta="Fármacos en uso" vacio={!sic.farmacos}>
              {sic.farmacos}
            </Dato>
            <Dato etiqueta="Patología GES" vacio={sic.ges === null}>
              {sic.ges ? 'Sí, caso GES' : 'No'}
            </Dato>
            <Dato etiqueta="Prioridad" vacio={!sic.prioridad}>
              {sic.prioridad}
            </Dato>
          </>
        )}
      </dl>
    </Tarjeta>
  )
}
