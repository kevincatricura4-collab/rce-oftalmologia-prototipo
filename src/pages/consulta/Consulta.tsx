import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, NavLink, useNavigate, useParams } from 'react-router-dom'
import { EncabezadoPaciente } from '../../components/EncabezadoPaciente'
import { IconoAvanzar, IconoCompleto, IconoGuardar, IconoSoloLectura, IconoVolver } from '../../components/iconos'
import { useTituloPagina } from '../../components/Layout'
import { Aviso, Boton, Segmentado, cx } from '../../components/ui'
import { NOMBRE_DESENLACE } from '../../lib/catalogos'
import { bloqueosCierre, camposPendientes, estadoCita } from '../../lib/consulta'
import { paciente as buscarPaciente } from '../../lib/datos'
import { fechaHora, hora } from '../../lib/formato'
import { NOMBRE_TIPO, TIPOS_ATENCION } from '../../lib/plantillas'
import { useEstado, usuarioPorId } from '../../lib/store'
import type { Consulta as TConsulta, Plantilla, TipoAtencionId } from '../../lib/tipos'
import { PASOS, type Paso, type PropsPaso } from './contexto'
import { PasoAnamnesis } from './PasoAnamnesis'
import { PasoCierre } from './PasoCierre'
import { PasoDiagnostico } from './PasoDiagnostico'
import { PasoExamen } from './PasoExamen'
import { PasoIndicaciones } from './PasoIndicaciones'

const COMPONENTES: Record<Paso, (p: PropsPaso) => ReactNode> = {
  anamnesis: PasoAnamnesis,
  examen: PasoExamen,
  diagnostico: PasoDiagnostico,
  indicaciones: PasoIndicaciones,
  cierre: PasoCierre,
}

/** Documentos emitidos en la consulta: el paso de indicaciones es opcional, se muestra el conteo. */
function documentosEmitidos(c: TConsulta): number {
  return (c.recetaOptica?.emitida ? 1 : 0) + (c.recetasMedicamento.some((r) => r.emitida) ? 1 : 0) + c.ordenesExamen.filter((o) => o.emitida).length
}

function pasoCompleto(paso: Paso, c: TConsulta, plantilla: Plantilla): boolean {
  switch (paso) {
    case 'anamnesis':
      return Boolean(c.anamnesis.motivo.trim())
    case 'examen':
      return camposPendientes(plantilla, c.hallazgos).length === 0
    case 'diagnostico':
      return c.diagnosticos.length > 0 && !bloqueosCierre(c).some((f) => f.paso === 'diagnostico')
    case 'indicaciones':
      return documentosEmitidos(c) > 0
    case 'cierre':
      return c.estado === 'cerrada'
  }
}

/** Pantallas 3 a 7: la consulta como un flujo de cinco pasos con pestañas. */
export function Consulta() {
  const { consultaId = '', paso = 'anamnesis' } = useParams()
  const { datos, actualizarConsulta, registrarBloque, auditar, abrirConsulta } = useEstado()
  const navegar = useNavigate()
  const [guardado, setGuardado] = useState<string | null>(null)

  const consulta = datos.consultas[consultaId]
  const nombrePaso = PASOS.find((p) => p.id === paso)?.nombre ?? 'Consulta'
  useTituloPagina(consulta ? `${nombrePaso} · Ficha ${buscarPaciente(consulta.pacienteId).ficha}` : 'Consulta')

  useEffect(() => {
    if (consulta) auditar('Lectura de ficha clínica', `Consulta ${consulta.id}`)
    // Una lectura por apertura de la consulta, no por cada cambio del registro.
  }, [consulta?.id, auditar])

  if (!consulta) return <Navigate to="/agenda" replace />
  const pasoActual = PASOS.find((p) => p.id === paso)
  if (!pasoActual) return <Navigate to={`/consulta/${consultaId}/anamnesis`} replace />

  const cita = datos.citas.find((c) => c.id === consulta.citaId) ?? null
  const plantilla = datos.plantillas[consulta.tipoAtencion]
  const soloLectura = consulta.estado === 'cerrada'
  const autor = usuarioPorId(datos, consulta.autorId)
  const indice = PASOS.indexOf(pasoActual)
  const siguiente = PASOS[indice + 1]

  const props: PropsPaso = {
    consulta,
    cita,
    plantilla,
    soloLectura,
    actualizar: (cambio) => actualizarConsulta(consulta.id, cambio),
    registrar: (bloque) => registrarBloque(consulta.id, bloque),
  }
  const Componente = COMPONENTES[pasoActual.id]

  const guardarBorrador = () => {
    registrarBloque(consulta.id, `Borrador: ${pasoActual.nombre.toLowerCase()}`)
    setGuardado(new Date().toTimeString().slice(0, 5))
  }

  const ultimoRegistro = consulta.registros.at(-1)

  // Al cerrar, el siguiente paso natural del oftalmólogo es el próximo paciente listo.
  const siguientePaciente = soloLectura
    ? datos.citas.find((c) => c.id !== consulta.citaId && ['en_atencion', 'con_pre_atencion'].includes(estadoCita(c, datos.consultas)))
    : undefined
  const irASiguiente = () => {
    if (!siguientePaciente) return
    const id = siguientePaciente.consultaId ?? abrirConsulta(siguientePaciente.id)
    navegar(`/consulta/${id}/${siguientePaciente.consultaId ? 'examen' : 'anamnesis'}`)
  }

  return (
    <div className="mx-auto max-w-[80rem]">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        {cita ? (
          <Link to="/agenda" className="inline-flex min-h-8 items-center gap-1.5 rounded-md font-medium text-primary hover:underline">
            <IconoVolver size={16} aria-hidden="true" /> Agenda del día
          </Link>
        ) : (
          <Link to={`/historial/${consulta.pacienteId}`} className="inline-flex min-h-8 items-center gap-1.5 rounded-md font-medium text-primary hover:underline">
            <IconoVolver size={16} aria-hidden="true" /> Historial del paciente
          </Link>
        )}
        <span className="text-fg-muted">
          {cita ? `Cita ${cita.hora} · ` : `Consulta del ${fechaHora(consulta.inicio).split(' ')[0]} · `}
          {soloLectura ? 'cerrada' : 'en atención'}
        </span>
      </div>
      <EncabezadoPaciente pacienteId={consulta.pacienteId} sicId={consulta.sicId}>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
          <Segmentado<TipoAtencionId>
            nombre="tipo-atencion"
            etiqueta="Tipo de atención"
            disabled={soloLectura}
            valor={consulta.tipoAtencion}
            onCambio={(tipo) => props.actualizar((c) => ({ ...c, tipoAtencion: tipo }))}
            opciones={TIPOS_ATENCION.map((t) => ({ valor: t, texto: NOMBRE_TIPO[t] }))}
          />
          {!soloLectura && <p className="max-w-sm text-[0.8125rem] text-fg-muted">Cambiar el tipo no borra lo registrado.</p>}
        </div>
      </EncabezadoPaciente>

      {soloLectura && (
        <Aviso
          tono="ok"
          titulo="Consulta cerrada · solo lectura"
          className="mb-5"
          accion={
            siguientePaciente && (
              <Boton variante="primario" pequeno onClick={irASiguiente}>
                Siguiente: {siguientePaciente.hora} {buscarPaciente(siguientePaciente.pacienteId).nombre.split(' ')[0]}
                <IconoAvanzar size={16} aria-hidden="true" />
              </Boton>
            )
          }
        >
          Cerrada el {fechaHora(consulta.cierre!)} por {autor?.nombre}. Desenlace: {consulta.desenlace ? NOMBRE_DESENLACE[consulta.desenlace] : '—'}
          {consulta.cerradaConPendientes > 0 && <> · se cerró con {consulta.cerradaConPendientes} campos obligatorios pendientes</>}.
        </Aviso>
      )}

      <nav aria-label="Pasos de la consulta" className="relative mb-6 overflow-x-auto border-b border-line">
        <ol className="flex max-sm:flex-wrap sm:min-w-max">
          {PASOS.map((p) => {
            const completo = pasoCompleto(p.id, consulta, plantilla)
            const docs = p.id === 'indicaciones' ? documentosEmitidos(consulta) : 0
            const faltan = p.id === 'examen' && !completo ? camposPendientes(plantilla, consulta.hallazgos).length : 0
            const detalle = p.id === 'indicaciones' ? (docs ? `${docs} doc.` : 'opcional') : faltan ? `faltan ${faltan}` : null
            const lector =
              p.id === 'indicaciones'
                ? docs
                  ? `(${docs} ${docs === 1 ? 'documento emitido' : 'documentos emitidos'})`
                  : '(opcional, sin documentos)'
                : completo
                  ? '(completo)'
                  : faltan
                    ? `(pendiente: ${faltan === 1 ? 'falta 1 campo obligatorio' : `faltan ${faltan} campos obligatorios`})`
                    : '(pendiente)'
            return (
              <li key={p.id}>
                <NavLink
                  to={`/consulta/${consulta.id}/${p.id}`}
                  className={({ isActive }) =>
                    cx(
                      '-mb-px flex h-12 items-center gap-2 border-b-[3px] px-3 text-[0.9375rem] font-medium transition-colors duration-150 focus-visible:outline-offset-[-3px] sm:px-4',
                      isActive ? 'border-primary text-fg font-semibold' : 'border-transparent text-fg-muted hover:text-fg hover:bg-muted',
                    )
                  }
                >
                  {/* Solo el paso terminado lleva ícono; el resto dice qué le falta en texto, sin el anillo de "en espera". */}
                  {completo && p.id !== 'indicaciones' && <IconoCompleto size={16} className="shrink-0 text-ok" aria-hidden="true" />}
                  <span>
                    {p.numero} {p.nombre}
                  </span>
                  {detalle && (
                    <span className="tnum text-[0.8125rem] font-normal text-fg-muted" aria-hidden="true">
                      {detalle}
                    </span>
                  )}
                  <span className="sr-only">{lector}</span>
                </NavLink>
              </li>
            )
          })}
        </ol>
      </nav>

      <Componente key={pasoActual.id} {...props} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-[0.8125rem] text-fg-muted">
          {soloLectura ? (
            <span className="inline-flex items-center gap-1.5">
              <IconoSoloLectura size={16} aria-hidden="true" /> Registro inmutable: autor, fecha y hora en cada bloque.
            </span>
          ) : guardado ? (
            <span role="status">Borrador guardado a las {guardado} · {autor?.nombre}</span>
          ) : ultimoRegistro ? (
            <>Cada cambio se guarda solo. Último registro: {ultimoRegistro.bloque.toLowerCase()} a las {hora(ultimoRegistro.fecha)} · {usuarioPorId(datos, ultimoRegistro.autorId)?.nombre}</>
          ) : (
            <>Cada cambio se guarda solo. Consulta abierta a las {hora(consulta.inicio)} · {autor?.nombre}</>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {soloLectura ? (
            <Link to="/agenda" className="inline-flex h-10 items-center rounded-md border border-line-strong px-4 font-medium transition-colors duration-150 hover:bg-muted">
              Volver a la agenda
            </Link>
          ) : (
            <Boton icono={IconoGuardar} onClick={guardarBorrador}>
              Guardar borrador
            </Boton>
          )}
          {siguiente && (
            <Boton variante={soloLectura ? 'secundario' : 'primario'} onClick={() => navegar(`/consulta/${consulta.id}/${siguiente.id}`)}>
              {soloLectura ? `Ver ${siguiente.nombre.toLowerCase()}` : pasoActual.siguiente}
            </Boton>
          )}
        </div>
      </div>
    </div>
  )
}
