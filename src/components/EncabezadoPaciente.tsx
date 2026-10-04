import type { ReactNode } from 'react'
import { avisoSic } from '../lib/consulta'
import { establecimiento, paciente as buscarPaciente, sic as buscarSic } from '../lib/datos'
import { documento, edad } from '../lib/formato'
import { IconoFaltante, IconoRegistroAccesos } from './iconos'

/**
 * Encabezado de paciente (pantallas 2 a 8): nombre, edad, ficha y documento, la SIC de origen
 * y, si vino incompleta, el aviso ámbar a la derecha.
 */
export function EncabezadoPaciente({ pacienteId, sicId, children }: { pacienteId: string; sicId?: string; children?: ReactNode }) {
  const p = buscarPaciente(pacienteId)
  const s = sicId ? buscarSic(sicId) : null
  const aviso = s ? avisoSic(s) : null

  return (
    <section aria-label="Paciente" className="mb-5 rounded-lg border border-line bg-surface px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold sm:text-[1.375rem]">
            {p.nombre} <span className="font-semibold text-fg-muted">· {edad(p.fechaNacimiento)} años · Ficha {p.ficha}</span>
          </h1>
          <p className="mt-0.5 text-sm text-fg-muted">
            <span className={p.tipoDocumento === 'RUN' ? undefined : 'font-semibold text-fg'}>{documento(p)}</span> · {p.sexo} · {p.prevision}
          </p>
          {s && (
            <p className="mt-1 text-[0.9375rem]">
              Derivado por SIC desde {establecimiento(s.establecimientoId).nombre}
              {s.sospecha ? ` · sospecha de ${s.sospecha.toLowerCase()}` : ' · sin sospecha diagnóstica'}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {aviso && (
            <p className="inline-flex items-center gap-2 rounded-sm border border-warn-line border-l-[3px] bg-warn-soft px-3 py-1.5 text-sm font-semibold text-warn">
              <IconoFaltante size={16} className="shrink-0" aria-hidden="true" />
              {aviso}
            </p>
          )}
          <p className="inline-flex items-center gap-1.5 text-[0.8125rem] text-fg-muted" title="Ley 20.584: cada lectura de una ficha queda registrada">
            <IconoRegistroAccesos size={16} aria-hidden="true" />
            Acceso registrado
          </p>
        </div>
      </div>
      {children}
    </section>
  )
}
