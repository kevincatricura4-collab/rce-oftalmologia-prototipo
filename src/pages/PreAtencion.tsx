import { FloppyDisk } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { EncabezadoPaciente } from '../components/EncabezadoPaciente'
import { useTituloPagina } from '../components/Layout'
import { TarjetaSic } from '../components/TarjetaSic'
import { AreaTexto, Aviso, Boton, Campo, Entrada, Segmentado, claseEntrada, cx } from '../components/ui'
import { estadoCita } from '../lib/consulta'
import { paciente as buscarPaciente, sic as buscarSic } from '../lib/datos'
import { aNumero, comaDecimal, hora, marcaTiempo, normalizarHora } from '../lib/formato'
import { useEstado, usuarioPorId } from '../lib/store'
import type { Ojo, PreAtencion as TPreAtencion } from '../lib/tipos'
import type { EstadoNavegacionAgenda } from './Agenda'

type ClaveOjos = 'avSc' | 'avCc' | 'avEstenopeico' | 'pio'

const FILAS: { clave: ClaveOjos; etiqueta: string; decimal: boolean; desdeSic?: 'av' | 'pio' }[] = [
  { clave: 'avSc', etiqueta: 'AV sin corrección', decimal: true, desdeSic: 'av' },
  { clave: 'avCc', etiqueta: 'AV con corrección', decimal: true },
  { clave: 'avEstenopeico', etiqueta: 'AV estenopeico', decimal: true },
  { clave: 'pio', etiqueta: 'PIO (mmHg)', decimal: false, desdeSic: 'pio' },
]

const vacia = (autorId: string): TPreAtencion => ({
  avSc: { OD: '', OI: '' },
  avCc: { OD: '', OI: '' },
  avEstenopeico: { OD: '', OI: '' },
  pio: { OD: '', OI: '' },
  metodoPio: '',
  horaPio: hora(marcaTiempo()),
  observaciones: '',
  autorId,
  fecha: '',
})

/** Pantalla 2 — Pre-atención: agudeza visual y PIO por ojo (RF-03). */
export function PreAtencion() {
  const { citaId = '' } = useParams()
  const { datos, usuario, guardarPreAtencion } = useEstado()
  const navegar = useNavigate()
  const cita = datos.citas.find((c) => c.id === citaId)
  const [pa, setPa] = useState<TPreAtencion>(() => cita?.preAtencion ?? vacia(usuario?.id ?? ''))
  const [error, setError] = useState('')
  useTituloPagina(cita ? `Pre-atención · Ficha ${buscarPaciente(cita.pacienteId).ficha}` : 'Pre-atención')

  if (!cita || !usuario) return <Navigate to="/agenda" replace />
  const sic = buscarSic(cita.sicId)
  const estado = estadoCita(cita, datos.consultas)
  // Una vez abierta la consulta, la pre-atención queda como registro: el oftalmólogo corrige en el examen.
  const soloLectura = estado === 'en_atencion' || estado === 'cerrado'
  const autor = cita.preAtencion ? usuarioPorId(datos, cita.preAtencion.autorId) : null

  const fijar = (clave: ClaveOjos, ojo: Ojo, valor: string) => setPa((x) => ({ ...x, [clave]: { ...x[clave], [ojo]: valor } }))

  const guardar = (e: FormEvent) => {
    e.preventDefault()
    const hayDato = FILAS.some((f) => pa[f.clave].OD || pa[f.clave].OI)
    if (!hayDato) {
      setError('Registre al menos una agudeza visual o una PIO para pasar al paciente a "Con pre-atención".')
      return
    }
    guardarPreAtencion(cita.id, { ...pa, horaPio: normalizarHora(pa.horaPio), autorId: usuario.id, fecha: marcaTiempo() })
    const estado: EstadoNavegacionAgenda = {
      aviso: `Pre-atención de ${buscarPaciente(cita.pacienteId).nombre} guardada. Pasa a "Con pre-atención" y el oftalmólogo verá la AV y la PIO precargadas en el examen.`,
    }
    navegar('/agenda', { state: estado })
  }

  return (
    <div className="mx-auto max-w-[80rem]">
      <EncabezadoPaciente pacienteId={cita.pacienteId} sicId={cita.sicId} />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <form onSubmit={guardar} noValidate className="min-w-0 rounded-lg border border-line bg-surface">
          <header className="border-b border-line px-4 py-3 sm:px-5">
            <h2 className="text-lg font-semibold">Pre-atención · cita {cita.hora}</h2>
            <p className="text-sm text-fg-muted">
              {autor && cita.preAtencion ? `Registrada por ${autor.nombre} a las ${hora(cita.preAtencion.fecha)}` : 'Agudeza visual y presión intraocular antes de entrar al box.'}
            </p>
          </header>

          <fieldset disabled={soloLectura} className="p-4 sm:p-5">
            <legend className="sr-only">Mediciones por ojo</legend>
            {soloLectura && (
              <Aviso tono="info" titulo="La consulta ya está abierta" className="mb-4">
                La pre-atención queda como registro. Si hay que corregir un valor, lo hace el oftalmólogo en el examen.
              </Aviso>
            )}
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[30rem] border-collapse">
                <caption className="sr-only">Agudeza visual y PIO. Columnas: ojo derecho (OD) y ojo izquierdo (OI).</caption>
                <thead>
                  <tr className="border-b border-line bg-muted text-sm">
                    <th scope="col" className="px-3 py-2 text-left font-semibold">Campo</th>
                    <th scope="col" className="px-2 py-2 text-center font-bold text-od">OD <span className="font-normal text-fg-muted">· derecho</span></th>
                    <th scope="col" className="px-2 py-2 text-center font-bold text-oi">OI <span className="font-normal text-fg-muted">· izquierdo</span></th>
                  </tr>
                </thead>
                <tbody>
                  {FILAS.map((f) => {
                    const ref = f.desdeSic === 'av' ? sic.avPrevia : f.desdeSic === 'pio' ? sic.pioPrevia : null
                    return (
                      <tr key={f.clave} className="border-b border-line/70">
                        <th scope="row" className="px-3 py-2 text-left font-normal">
                          {f.etiqueta}
                          {ref && <span className="block text-[0.8125rem] text-fg-muted">desde SIC: OD {ref.OD} · OI {ref.OI}</span>}
                        </th>
                        {(['OD', 'OI'] as Ojo[]).map((o) => {
                          const pioAlta = f.clave === 'pio' && (aNumero(pa.pio[o]) ?? 0) > 21
                          return (
                            <td key={o} className="px-2 py-2 align-top">
                              <input
                                aria-label={`${f.etiqueta}, ${o === 'OD' ? 'ojo derecho (OD)' : 'ojo izquierdo (OI)'}`}
                                inputMode={f.decimal ? 'decimal' : 'numeric'}
                                value={pa[f.clave][o]}
                                onChange={(e) => fijar(f.clave, o, e.target.value)}
                                onBlur={(e) => f.decimal && fijar(f.clave, o, comaDecimal(e.target.value))}
                                className={cx(claseEntrada, 'text-center font-medium', pioAlta && 'border-danger ring-1 ring-danger')}
                              />
                              {pioAlta && <p className="mt-0.5 text-center text-[0.8125rem] font-medium text-danger">Sobre 21 mmHg</p>}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_9rem]">
              <Segmentado
                nombre="metodo"
                etiqueta="Método de la tonometría"
                valor={pa.metodoPio || null}
                onCambio={(v) => setPa((x) => ({ ...x, metodoPio: v }))}
                opciones={[
                  { valor: 'Aplanación', texto: 'Aplanación' },
                  { valor: 'Neumotonómetro', texto: 'Neumotonómetro' },
                  { valor: 'Rebote', texto: 'Rebote' },
                ]}
              />
              <Campo etiqueta="Hora de la toma (24 h)">
                {(p) => <Entrada {...p} inputMode="numeric" maxLength={5} value={pa.horaPio} onChange={(e) => setPa((x) => ({ ...x, horaPio: e.target.value }))} onBlur={(e) => setPa((x) => ({ ...x, horaPio: normalizarHora(e.target.value) }))} />}
              </Campo>
            </div>
            <Campo etiqueta="Observaciones" className="mt-4">
              {(p) => <AreaTexto {...p} rows={2} value={pa.observaciones} onChange={(e) => setPa((x) => ({ ...x, observaciones: e.target.value }))} placeholder="Ej.: no trae lentes, paciente no colabora con tonometría" />}
            </Campo>
            {error && (
              <p role="alert" className="mt-4 text-sm font-medium text-danger">
                {error}
              </p>
            )}
          </fieldset>

          <footer className="flex flex-wrap justify-end gap-2 border-t border-line px-4 py-3 sm:px-5">
            <Link to="/agenda" className="inline-flex h-10 items-center rounded-md border border-line-strong px-4 font-medium transition-colors duration-150 hover:bg-muted">
              Volver a la agenda
            </Link>
            {!soloLectura && (
              <Boton type="submit" variante="primario" icono={FloppyDisk}>
                Guardar pre-atención
              </Boton>
            )}
          </footer>
        </form>

        <TarjetaSic sic={sic} compacta />
      </div>
    </div>
  )
}
