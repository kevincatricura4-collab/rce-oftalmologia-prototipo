import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { EncabezadoPaciente } from '../components/EncabezadoPaciente'
import { GraficoLinea, TablaDatos } from '../components/Graficos'
import { IconoAbrirFila, IconoAvanzar, IconoBuscar, IconoEnAtencion } from '../components/iconos'
import { TituloPantalla, useTituloPagina } from '../components/Layout'
import { Aviso, Insignia, Tarjeta, claseEntrada, cx } from '../components/ui'
import { NOMBRE_DESENLACE } from '../lib/catalogos'
import { PACIENTES, SICS } from '../lib/datos'
import { aNumero, documento, edad, fecha, mesAnio } from '../lib/formato'
import { NOMBRE_TIPO } from '../lib/plantillas'
import { useEstado, usuarioPorId } from '../lib/store'
import type { Consulta, Ojo } from '../lib/tipos'

function normalizar(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** Pantalla 8 — lista de pacientes para elegir el historial. */
export function ListaHistorial() {
  const [q, setQ] = useState('')
  useTituloPagina('Historial de pacientes')
  const filtrados = PACIENTES.filter((p) => normalizar(`${p.nombre} ${p.ficha} ${p.documento}`).includes(normalizar(q.trim())))
  return (
    <div className="mx-auto max-w-4xl">
      <TituloPantalla titulo="Historial de pacientes" detalle="Busque por nombre, ficha o documento. Cada lectura de una ficha queda registrada." />
      <label htmlFor="buscar-paciente" className="text-[0.8125rem] font-medium text-fg-muted">
        Buscar paciente
      </label>
      <div className="relative mt-1 mb-4">
        <IconoBuscar size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted" aria-hidden="true" />
        <input id="buscar-paciente" type="search" value={q} onChange={(e) => setQ(e.target.value)} className={cx(claseEntrada, 'pl-10')} placeholder="Ej.: 000123, Saavedra" />
      </div>
      <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
        {filtrados.map((p) => (
          <li key={p.id}>
            <Link to={`/historial/${p.id}`} className="flex min-h-14 items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-muted">
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{p.nombre}</span>
                <span className="block text-sm text-fg-muted">
                  {edad(p.fechaNacimiento)} años · Ficha {p.ficha} · {documento(p)}
                </span>
              </span>
              <IconoAbrirFila size={16} className="shrink-0 text-fg-muted" aria-hidden="true" />
            </Link>
          </li>
        ))}
        {filtrados.length === 0 && <li className="px-4 py-6 text-center text-fg-muted">Sin resultados.</li>}
      </ul>
    </div>
  )
}

/** Pantalla 8 — Historial del paciente (RF-14). El tecnólogo/TENS ve solo AV y PIO. */
export function Historial() {
  const { pacienteId = '' } = useParams()
  const { datos, usuario, auditar } = useEstado()
  const p = PACIENTES.find((x) => x.id === pacienteId)
  useTituloPagina(p ? `Historial · Ficha ${p.ficha}` : 'Historial')

  useEffect(() => {
    if (p) auditar('Lectura de historial', `Ficha ${p.ficha}`)
  }, [p, auditar])

  if (!p || !usuario) return <Navigate to="/historial" replace />
  const soloAvPio = usuario.rol === 'tecnologo'

  const consultas = Object.values(datos.consultas)
    .filter((c) => c.pacienteId === p.id)
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
  const cita = datos.citas.find((c) => c.pacienteId === p.id)
  const sicId = cita?.sicId ?? consultas.at(-1)?.sicId ?? SICS.find((s) => s.pacienteId === p.id)?.id

  // Mediciones en el tiempo: cada consulta, más la pre-atención de hoy si aún no hay consulta.
  const mediciones = consultas.map((c) => ({
    fecha: c.inicio,
    av: { OD: c.hallazgos.av_cc?.OD || c.hallazgos.av_sc?.OD || '', OI: c.hallazgos.av_cc?.OI || c.hallazgos.av_sc?.OI || '' },
    pio: { OD: c.hallazgos.pio?.OD ?? '', OI: c.hallazgos.pio?.OI ?? '' },
    cd: { OD: c.hallazgos.gl_cd?.OD ?? '', OI: c.hallazgos.gl_cd?.OI ?? '' },
    origen: c.estado === 'borrador' ? 'Consulta en curso' : NOMBRE_TIPO[c.tipoAtencion],
  }))
  if (cita?.preAtencion && !cita.consultaId) {
    const pa = cita.preAtencion
    mediciones.push({ fecha: pa.fecha, av: { OD: pa.avCc.OD || pa.avSc.OD, OI: pa.avCc.OI || pa.avSc.OI }, pio: pa.pio, cd: { OD: '', OI: '' }, origen: 'Pre-atención de hoy' })
  }
  const glaucoma = consultas.some((c) => c.tipoAtencion === 'glaucoma') && !soloAvPio

  return (
    <div className="mx-auto max-w-[80rem]">
      <EncabezadoPaciente pacienteId={p.id} sicId={sicId} />

      {soloAvPio && (
        <Aviso tono="info" titulo="Vista de pre-atención" className="mb-5">
          Su perfil ve solo agudeza visual y PIO del historial. Diagnósticos, examen y documentos no se muestran.
        </Aviso>
      )}

      {mediciones.length === 0 ? (
        <Aviso titulo="Sin registros previos en el módulo">Este paciente aún no tiene consultas ni pre-atención registradas.</Aviso>
      ) : (
        <div className="flex flex-col gap-5">
          {glaucoma && <EvolucionGlaucoma mediciones={mediciones} />}

          <Tarjeta id="av-pio" titulo={soloAvPio ? 'Agudeza visual y PIO por ojo' : 'Agudeza visual y PIO en el tiempo'}>
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <thead className="bg-muted text-sm">
                  <tr>
                    <th scope="col" rowSpan={2} className="px-3 py-2 font-semibold">Fecha</th>
                    <th scope="col" rowSpan={2} className="px-3 py-2 font-semibold">Registro</th>
                    <th scope="colgroup" colSpan={2} className="px-3 pt-2 text-center font-semibold">AV (mejor corregida)</th>
                    <th scope="colgroup" colSpan={2} className="px-3 pt-2 text-center font-semibold">PIO (mmHg)</th>
                  </tr>
                  <tr>
                    <th scope="col" className="px-3 pb-2 text-center font-bold text-od">OD</th>
                    <th scope="col" className="px-3 pb-2 text-center font-bold text-oi">OI</th>
                    <th scope="col" className="px-3 pb-2 text-center font-bold text-od">OD</th>
                    <th scope="col" className="px-3 pb-2 text-center font-bold text-oi">OI</th>
                  </tr>
                </thead>
                <tbody>
                  {mediciones.map((m, i) => (
                    <tr key={i} className="border-t border-line">
                      <th scope="row" className="tnum px-3 py-2 font-normal">{fecha(m.fecha)}</th>
                      <td className="px-3 py-2 text-sm text-fg-muted">{soloAvPio ? (m.origen.startsWith('Pre') || m.origen.startsWith('Consulta en') ? m.origen : 'Consulta') : m.origen}</td>
                      {(['OD', 'OI'] as Ojo[]).map((o) => <td key={`av${o}`} className="px-3 py-2 text-center font-medium">{m.av[o] || '—'}</td>)}
                      {(['OD', 'OI'] as Ojo[]).map((o) => <td key={`pio${o}`} className="px-3 py-2 text-center font-medium">{m.pio[o] || '—'}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tarjeta>

          {!soloAvPio && <ListaConsultas consultas={consultas} />}
        </div>
      )}
    </div>
  )
}

function EvolucionGlaucoma({ mediciones }: { mediciones: { fecha: string; pio: Record<Ojo, string>; cd: Record<Ojo, string> }[] }) {
  const conDatos = mediciones.filter((m) => m.pio.OD || m.pio.OI || m.cd.OD || m.cd.OI)
  const serie = (clave: 'pio' | 'cd', o: Ojo) => conDatos.map((m) => ({ etiqueta: mesAnio(m.fecha), valor: aNumero(m[clave][o]) }))
  const cd = (v: number) => v.toFixed(1).replace('.', ',')

  return (
    <Tarjeta id="evolucion" titulo="Glaucoma: PIO y excavación por ojo en el tiempo">
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <GraficoLinea titulo="PIO OD (mmHg)" color="text-od" puntos={serie('pio', 'OD')} min={10} max={30} referencia={{ valor: 21, texto: '21' }} unidad="mmHg" />
        <GraficoLinea titulo="PIO OI (mmHg)" color="text-oi" puntos={serie('pio', 'OI')} min={10} max={30} referencia={{ valor: 21, texto: '21' }} unidad="mmHg" />
        <GraficoLinea titulo="Excavación OD (C/D)" color="text-od" puntos={serie('cd', 'OD')} min={0.3} max={0.9} formato={cd} />
        <GraficoLinea titulo="Excavación OI (C/D)" color="text-oi" puntos={serie('cd', 'OI')} min={0.3} max={0.9} formato={cd} />
      </div>
      <p className="mt-3 text-[0.8125rem] text-fg-muted">La línea en 21 mmHg marca el límite superior de la PIO normal.</p>
      <TablaDatos
        titulo="PIO y excavación por ojo"
        columnas={['Fecha', 'PIO OD', 'PIO OI', 'C/D OD', 'C/D OI']}
        filas={conDatos.map((m) => [fecha(m.fecha), m.pio.OD || '—', m.pio.OI || '—', m.cd.OD || '—', m.cd.OI || '—'])}
      />
    </Tarjeta>
  )
}

function ListaConsultas({ consultas }: { consultas: Consulta[] }) {
  const { datos } = useEstado()
  return (
    <Tarjeta id="consultas" titulo={`Consultas en orden cronológico (${consultas.length})`}>
      {consultas.length === 0 ? (
        <p className="text-sm text-fg-muted">Sin consultas registradas.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {consultas.map((c) => {
            const principal = c.diagnosticos.find((d) => d.principal)
            return (
              <li key={c.id} className="rounded-md border border-line p-3 sm:p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      <span className="tnum">{fecha(c.inicio)}</span> · {NOMBRE_TIPO[c.tipoAtencion]}
                    </p>
                    <p className="text-sm text-fg-muted">{usuarioPorId(datos, c.autorId)?.nombre}</p>
                  </div>
                  {c.estado === 'borrador' ? <Insignia tono="info" icono={IconoEnAtencion}>En atención, borrador</Insignia> : <Insignia>{c.desenlace ? NOMBRE_DESENLACE[c.desenlace] : 'Cerrada'}{c.plazoControl && c.desenlace === 'control' ? ` · ${c.plazoControl}` : ''}</Insignia>}
                </div>
                <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="inline text-fg-muted">Motivo: </dt>
                    <dd className="inline">{c.anamnesis.motivo || '—'}</dd>
                  </div>
                  <div>
                    <dt className="inline text-fg-muted">Diagnóstico: </dt>
                    <dd className="inline">{principal ? `${principal.codigo} ${principal.descripcion} (${principal.lateralidad ?? '—'})` : '—'}</dd>
                  </div>
                </dl>
                <Link to={`/consulta/${c.id}/${c.estado === 'borrador' ? 'examen' : 'cierre'}`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  {c.estado === 'borrador' ? 'Continuar consulta' : 'Ver consulta (solo lectura)'}
                  <IconoAvanzar size={16} aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ol>
      )}
    </Tarjeta>
  )
}
