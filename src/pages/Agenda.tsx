import { ArrowRight, ClockCounterClockwise, WarningCircle } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ESTADOS, EstadoCita, ORDEN_ESTADOS } from '../components/EstadoCita'
import { TituloPantalla } from '../components/Layout'
import { cx } from '../components/ui'
import { avisoSic, estadoCita } from '../lib/consulta'
import { establecimiento, paciente as buscarPaciente, sic as buscarSic } from '../lib/datos'
import { FECHA_JORNADA, documento, edad, fechaLarga } from '../lib/formato'
import { NOMBRE_TIPO } from '../lib/plantillas'
import { useEstado } from '../lib/store'
import type { Cita, EstadoAtencion } from '../lib/tipos'

const claseAccion = 'inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors duration-150'
const accionPrincipal = cx(claseAccion, 'bg-primary text-on-primary hover:bg-primary-hover')
const accionSecundaria = cx(claseAccion, 'border border-line-strong bg-surface hover:bg-muted')

/** Pantalla 1 — Agenda del día del box. La citación es del SOME: aquí es de lectura. */
export function Agenda() {
  const { datos, usuario, abrirConsulta } = useEstado()
  const navegar = useNavigate()
  const [filtro, setFiltro] = useState<EstadoAtencion | null>(null)
  if (!usuario) return null

  const filas = datos.citas.map((cita) => ({ cita, estado: estadoCita(cita, datos.consultas) }))
  const conteo = Object.fromEntries(ORDEN_ESTADOS.map((e) => [e, filas.filter((f) => f.estado === e).length])) as Record<EstadoAtencion, number>
  const visibles = filtro ? filas.filter((f) => f.estado === filtro) : filas
  const esMedico = usuario.rol === 'oftalmologo'

  const abrir = (cita: Cita) => {
    const id = abrirConsulta(cita.id)
    navegar(`/consulta/${id}/anamnesis`)
  }

  const acciones = (cita: Cita, estado: EstadoAtencion) => {
    const preAtencion = (
      <Link to={`/pre-atencion/${cita.id}`} className={esMedico ? accionSecundaria : accionPrincipal}>
        Registrar pre-atención
      </Link>
    )
    if (!esMedico) {
      if (estado === 'en_espera') return preAtencion
      return (
        <Link to={`/pre-atencion/${cita.id}`} className={accionSecundaria}>
          {estado === 'con_pre_atencion' ? 'Editar pre-atención' : 'Ver pre-atención'}
        </Link>
      )
    }
    switch (estado) {
      case 'en_espera':
        return (
          <>
            {preAtencion}
            <button type="button" onClick={() => abrir(cita)} className={accionSecundaria}>
              Abrir sin pre-atención
            </button>
          </>
        )
      case 'con_pre_atencion':
        return (
          <button type="button" onClick={() => abrir(cita)} className={accionPrincipal}>
            Abrir consulta <ArrowRight size={16} aria-hidden="true" />
          </button>
        )
      case 'en_atencion':
        return (
          <Link to={`/consulta/${cita.consultaId}/examen`} className={accionPrincipal}>
            Continuar consulta <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )
      case 'cerrado':
        return (
          <Link to={`/consulta/${cita.consultaId}/cierre`} className={accionSecundaria}>
            Ver consulta
          </Link>
        )
    }
  }

  return (
    <div className="mx-auto max-w-[80rem]">
      <TituloPantalla
        titulo={`Agenda del día · ${usuario.rol === 'oftalmologo' ? usuario.ubicacion : 'Box 2'}`}
        detalle={
          <>
            {fechaLarga(FECHA_JORNADA).replace(/^./, (l) => l.toUpperCase())} · jornada de la mañana · {filas.length} pacientes citados. La citación viene del SOME: esta agenda es de lectura.
          </>
        }
      />

      <div role="group" aria-label="Filtrar por estado" className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ORDEN_ESTADOS.map((e) => {
          const { nombre, icono: Icono } = ESTADOS[e]
          const activo = filtro === e
          return (
            <button
              key={e}
              type="button"
              aria-pressed={activo}
              onClick={() => setFiltro(activo ? null : e)}
              className={cx(
                'flex items-center gap-3 rounded-lg border bg-surface p-3 text-left transition-colors duration-150 sm:p-4',
                activo ? 'border-primary ring-1 ring-primary' : 'border-line hover:bg-muted',
              )}
            >
              <span className={cx('grid size-10 shrink-0 place-items-center rounded-md', ESTADOS[e].clase)} aria-hidden="true">
                <Icono size={22} />
              </span>
              <span>
                <span className="tnum block font-display text-2xl leading-none font-bold">{conteo[e]}</span>
                <span className="mt-1 block text-sm text-fg-muted">{nombre}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <caption className="sr-only">Pacientes citados en la jornada{filtro ? `, filtrados por estado ${ESTADOS[filtro].nombre}` : ''}</caption>
          <thead className="bg-muted text-sm">
            <tr>
              <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">Hora</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Paciente</th>
              <th scope="col" className="hidden px-3 py-2.5 font-semibold xl:table-cell">Derivación</th>
              <th scope="col" className="hidden px-3 py-2.5 font-semibold lg:table-cell">Tipo sugerido</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Estado</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map(({ cita, estado }) => {
              const p = buscarPaciente(cita.pacienteId)
              const s = buscarSic(cita.sicId)
              const est = establecimiento(s.establecimientoId)
              const aviso = avisoSic(s)
              const derivacion = (
                <>
                  <span className="block">{est.nombre}</span>
                  <span className="block text-fg-muted">
                    {s.sospecha ? `Sospecha: ${s.sospecha.toLowerCase()}` : 'Sin sospecha diagnóstica'}
                    {est.tipo === 'UAPO' && ' · deriva tecnólogo médico'}
                  </span>
                  {aviso && (
                    <span className="mt-0.5 inline-flex items-center gap-1 font-medium text-warn">
                      <WarningCircle size={14} aria-hidden="true" />
                      {aviso}
                    </span>
                  )}
                </>
              )
              return (
                <tr key={cita.id} className="border-t border-line align-top">
                  <td className="tnum px-3 py-3 font-semibold sm:px-4">{cita.hora}</td>
                  <td className="px-3 py-3">
                    <span className="block font-semibold">{p.nombre}</span>
                    <span className="block text-sm text-fg-muted">
                      {edad(p.fechaNacimiento)} años · Ficha {p.ficha} · <span className={p.tipoDocumento === 'RUN' ? undefined : 'font-semibold text-fg'}>{documento(p)}</span>
                    </span>
                    <span className="mt-1 block text-sm xl:hidden">{derivacion}</span>
                    <span className="mt-1 block text-sm lg:hidden">Tipo sugerido: {NOMBRE_TIPO[cita.tipoSugerido]}</span>
                  </td>
                  <td className="hidden px-3 py-3 text-sm xl:table-cell">{derivacion}</td>
                  <td className="hidden px-3 py-3 text-sm lg:table-cell">{NOMBRE_TIPO[cita.tipoSugerido]}</td>
                  <td className="px-3 py-3">
                    <EstadoCita estado={estado} />
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <div className="flex flex-col items-end gap-2">
                      {acciones(cita, estado)}
                      <Link to={`/historial/${p.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                        <ClockCounterClockwise size={14} aria-hidden="true" />
                        Historial<span className="sr-only"> de {p.nombre}</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-fg-muted">
                  No hay pacientes en este estado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
