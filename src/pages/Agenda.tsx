import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ESTADOS, EstadoCita, ORDEN_ESTADOS } from '../components/EstadoCita'
import { IconoAvanzar, IconoCerrar, IconoCompleto, IconoFaltante } from '../components/iconos'
import { TituloPantalla, useTituloPagina } from '../components/Layout'
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

/** Mensaje que deja otra pantalla al volver a la agenda (p. ej. "Pre-atención guardada"). */
export interface EstadoNavegacionAgenda {
  aviso?: string
}

/** Pantalla 1 — Agenda del día del box. La citación es del SOME: aquí es de lectura. */
export function Agenda() {
  const { datos, usuario, abrirConsulta } = useEstado()
  const navegar = useNavigate()
  const location = useLocation()
  const [filtro, setFiltro] = useState<EstadoAtencion | null>(null)
  const [aviso, setAviso] = useState<string | null>((location.state as EstadoNavegacionAgenda | null)?.aviso ?? null)
  useTituloPagina('Agenda del día')

  // El aviso se muestra una vez: se limpia del historial para que no reaparezca al recargar.
  useEffect(() => {
    if (location.state) navegar(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navegar])

  if (!usuario) return null

  const filas = datos.citas.map((cita) => ({ cita, estado: estadoCita(cita, datos.consultas) }))
  const conteo = Object.fromEntries(ORDEN_ESTADOS.map((e) => [e, filas.filter((f) => f.estado === e).length])) as Record<EstadoAtencion, number>
  const visibles = filtro ? filas.filter((f) => f.estado === filtro) : filas
  const esMedico = usuario.rol === 'oftalmologo'

  // Lo que sigue según el rol: el oftalmólogo retoma su consulta abierta o llama al siguiente con
  // pre-atención; el tecnólogo, al siguiente en espera.
  const siguiente = esMedico
    ? (filas.find((f) => f.estado === 'en_atencion') ?? filas.find((f) => f.estado === 'con_pre_atencion'))
    : filas.find((f) => f.estado === 'en_espera')

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
            Abrir consulta <IconoAvanzar size={16} aria-hidden="true" />
          </button>
        )
      case 'en_atencion':
        return (
          <Link to={`/consulta/${cita.consultaId}/examen`} className={accionPrincipal}>
            Continuar consulta <IconoAvanzar size={16} aria-hidden="true" />
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

      {aviso && (
        <div role="status" className="mb-5 flex items-start gap-3 rounded-sm border border-line border-l-[3px] border-l-ok bg-surface px-4 py-3">
          <IconoCompleto size={20} className="mt-0.5 shrink-0 text-ok" aria-hidden="true" />
          <p className="flex-1 font-medium">{aviso}</p>
          <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso" className="-my-1 grid size-8 shrink-0 place-items-center rounded-sm transition-colors duration-150 hover:bg-muted">
            <IconoCerrar size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      {siguiente && (
        <section aria-label="Siguiente paciente" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-line border-l-[3px] border-l-primary bg-surface px-4 py-3">
          <p>
            <span className="text-sm font-medium text-fg-muted">{siguiente.estado === 'en_atencion' ? 'Consulta en curso' : 'Siguiente paciente'} · </span>
            <span className="tnum font-semibold">{siguiente.cita.hora}</span> <span className="font-semibold">{buscarPaciente(siguiente.cita.pacienteId).nombre}</span>
            <span className="text-fg-muted"> · {NOMBRE_TIPO[siguiente.cita.tipoSugerido].toLowerCase()} · {ESTADOS[siguiente.estado].nombre.toLowerCase()}</span>
          </p>
          <div className="flex flex-wrap justify-end gap-2">{acciones(siguiente.cita, siguiente.estado)}</div>
        </section>
      )}

      {/* Filtro segmentado con el conteo por estado. El activo se marca con barra inferior, negrita y aria-pressed, no solo con color. */}
      <div role="group" aria-label="Filtrar por estado" className="mb-2 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-5">
        {([null, ...ORDEN_ESTADOS] as (EstadoAtencion | null)[]).map((e) => {
          const activo = filtro === e
          const est = e ? ESTADOS[e] : null
          return (
            <button
              key={e ?? 'todos'}
              type="button"
              aria-pressed={activo}
              onClick={() => setFiltro(e)}
              className={cx(
                'flex min-h-12 items-center gap-2 border-b-[3px] px-3 py-2 text-left text-sm transition-colors duration-150 focus-visible:outline-offset-[-3px]',
                e === null && 'col-span-2 sm:col-span-1',
                activo ? 'border-b-primary bg-primary-soft font-semibold text-fg' : 'border-b-transparent bg-surface font-medium text-fg hover:bg-muted',
              )}
            >
              {est && <est.icono size={16} className={cx('shrink-0', est.colorIcono)} aria-hidden="true" />}
              <span className="min-w-0">{est ? est.nombre : 'Todos'}</span>
              <span className="tnum ml-auto pl-2 text-base font-semibold">{e ? conteo[e] : filas.length}</span>
            </button>
          )
        })}
      </div>
      <p className="mb-3 min-h-6 text-sm text-fg-muted" aria-live="polite">
        {filtro ? `Mostrando ${conteo[filtro]} de ${filas.length}: ${ESTADOS[filtro].nombre.toLowerCase()}.` : ''}
      </p>

      {/* Bajo 768 px cada fila se vuelve tarjeta (hora y paciente arriba, estado y acción abajo): la acción nunca queda fuera de la vista. */}
      <div className="rounded-lg border border-line relative bg-surface md:overflow-x-auto">
        <table className="w-full border-collapse text-left max-md:block md:min-w-[40rem]">
          <caption className="sr-only">Pacientes citados en la jornada{filtro ? `, filtrados por estado ${ESTADOS[filtro].nombre}` : ''}</caption>
          <thead className="bg-muted text-sm max-md:sr-only">
            <tr>
              <th scope="col" className="w-16 px-3 py-2.5 font-semibold sm:px-4">Hora</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Paciente</th>
              <th scope="col" className="hidden px-3 py-2.5 font-semibold xl:table-cell">Derivación</th>
              <th scope="col" className="hidden px-3 py-2.5 font-semibold xl:table-cell">Tipo sugerido</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Estado</th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Acción</th>
            </tr>
          </thead>
          <tbody className="max-md:block">
            {visibles.map(({ cita, estado }) => {
              const p = buscarPaciente(cita.pacienteId)
              const s = buscarSic(cita.sicId)
              const est = establecimiento(s.establecimientoId)
              const aviso = avisoSic(s)
              const derivacion = (
                <>
                  <span className="block">
                    {est.nombre}
                    {est.tipo === 'UAPO' && <span className="text-fg-muted"> · deriva tecnólogo médico</span>}
                  </span>
                  <span className="block text-fg-muted">{s.sospecha ? `Sospecha: ${s.sospecha.toLowerCase()}` : 'Sin sospecha diagnóstica'}</span>
                  {aviso && (
                    <span className="mt-0.5 flex items-start gap-1 font-medium text-warn">
                      <IconoFaltante size={16} className="mt-0.5 shrink-0 text-warn" aria-hidden="true" />
                      {aviso}
                    </span>
                  )}
                </>
              )
              return (
                <tr key={cita.id} className="border-t border-line align-top first:border-t-0 max-md:grid max-md:grid-cols-[3.5rem_1fr] max-md:py-1 md:first:border-t">
                  <td className="tnum px-3 py-3 font-semibold max-md:pb-0 sm:px-4">{cita.hora}</td>
                  <td className="px-3 py-3 max-md:pb-2">
                    <span className="block font-semibold">{p.nombre}</span>
                    <span className="block text-sm text-fg-muted">
                      <span className="whitespace-nowrap">{edad(p.fechaNacimiento)} años</span> · <span className="whitespace-nowrap">Ficha {p.ficha}</span> ·{' '}
                      <span className={cx('whitespace-nowrap', p.tipoDocumento !== 'RUN' && 'font-semibold text-fg')}>{documento(p)}</span>
                    </span>
                    <span className="mt-1.5 block text-sm xl:hidden">
                      <span className="mb-0.5 block font-medium">{NOMBRE_TIPO[cita.tipoSugerido]}</span>
                      {derivacion}
                    </span>
                  </td>
                  <td className="hidden px-3 py-3 text-sm xl:table-cell">{derivacion}</td>
                  <td className="hidden px-3 py-3 text-sm xl:table-cell">{NOMBRE_TIPO[cita.tipoSugerido]}</td>
                  <td className="px-3 py-3 max-md:col-start-2 max-md:py-1">
                    <EstadoCita estado={estado} />
                  </td>
                  <td className="px-3 py-3 max-md:col-start-2 max-md:pt-1 sm:px-4">
                    <div className="flex flex-col items-end gap-2 max-md:flex-row max-md:flex-wrap max-md:items-center">
                      {acciones(cita, estado)}
                      <Link to={`/historial/${p.id}`} className="inline-flex min-h-8 items-center text-sm font-medium text-primary hover:underline">
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
