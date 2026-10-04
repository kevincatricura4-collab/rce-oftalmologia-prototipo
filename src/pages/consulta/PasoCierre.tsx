import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DialogoDocumento, HojaDocumento } from '../../components/Documento'
import { IconoAvanzar, IconoCompleto, IconoFaltante, IconoImprimir, IconoSoloLectura } from '../../components/iconos'
import { Aviso, AreaTexto, Boton, Campo, Entrada, Insignia, Segmentado, Seleccion, Tarjeta, cx } from '../../components/ui'
import { DESENLACES } from '../../lib/catalogos'
import { avisosCierre, bloqueosCierre, camposPendientes, type Faltante } from '../../lib/consulta'
import { ESTABLECIMIENTOS, sic as buscarSic } from '../../lib/datos'
import { hora, marcaTiempo } from '../../lib/formato'
import { useEstado } from '../../lib/store'
import type { Contrarreferencia, Desenlace, Lateralidad } from '../../lib/tipos'
import type { PropsPaso } from './contexto'
import { CuerpoContrarreferencia, CuerpoResumen, resumenSugerido } from './documentos'

const PLAZOS = ['1 mes', '3 meses', '6 meses', '12 meses']

/** Pantalla 7 — Consulta, paso 5: desenlace, contrarreferencia y resumen (RF-11 a RF-13). */
export function PasoCierre({ consulta, plantilla, soloLectura, actualizar, registrar }: PropsPaso) {
  const { cerrarConsulta } = useEstado()
  const [vista, setVista] = useState<'contrarreferencia' | 'resumen' | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const sic = buscarSic(consulta.sicId)

  const bloqueos = bloqueosCierre(consulta)
  const pendientes = camposPendientes(plantilla, consulta.hallazgos)
  const avisos = avisosCierre(consulta)

  const cr: Contrarreferencia = consulta.contrarreferencia ?? { destinoId: sic.establecimientoId, conducta: '', controlSugerido: '', emitida: null }
  const fijarCr = (parcial: Partial<Contrarreferencia>) => actualizar((c) => ({ ...c, contrarreferencia: { ...cr, ...c.contrarreferencia, ...parcial } }))
  const resumen = consulta.resumenPaciente ?? { texto: '', entregado: null }
  const fijarResumen = (parcial: Partial<typeof resumen>) => actualizar((c) => ({ ...c, resumenPaciente: { ...resumen, ...c.resumenPaciente, ...parcial } }))

  const elegirDesenlace = (d: Desenlace) =>
    actualizar((c) => {
      const ojo = c.hallazgos.cat_ojo_operar?.AO as Lateralidad | undefined
      return { ...c, desenlace: d, ojoOperar: d === 'indicacion_quirurgica' ? (c.ojoOperar ?? ojo ?? null) : c.ojoOperar }
    })

  const cerrar = () => {
    cerrarConsulta(consulta.id, pendientes.length)
    setConfirmando(false)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col gap-5">
        <Tarjeta id="desenlace" titulo="Desenlace de la consulta">
          <fieldset disabled={soloLectura}>
            <legend className="sr-only">Desenlace</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {/* En solo lectura se muestra el desenlace registrado, no las cuatro alternativas. */}
              {DESENLACES.filter((d) => !soloLectura || d.id === consulta.desenlace).map((d) => {
                const activo = consulta.desenlace === d.id
                return (
                  <label
                    key={d.id}
                    className={cx(
                      'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors duration-150 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
                      activo ? 'border-primary bg-primary-soft ring-1 ring-primary' : 'border-line-strong hover:bg-muted',
                    )}
                  >
                    <input type="radio" name="desenlace" className="mt-1 size-4 accent-primary" checked={activo} onChange={() => elegirDesenlace(d.id)} />
                    <span>
                      <span className="block font-semibold">{d.nombre}</span>
                      <span className="block text-sm text-fg-muted">{d.detalle}</span>
                    </span>
                  </label>
                )
              })}
            </div>

            {consulta.desenlace === 'control' && (
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <Segmentado pequeno nombre="plazo" etiqueta="Plazo del control" valor={PLAZOS.includes(consulta.plazoControl) ? consulta.plazoControl : null} onCambio={(v) => actualizar((c) => ({ ...c, plazoControl: v }))} opciones={PLAZOS.map((p) => ({ valor: p, texto: p }))} />
                <Campo etiqueta="Otro plazo" className="w-40">
                  {(p) => <Entrada {...p} value={PLAZOS.includes(consulta.plazoControl) ? '' : consulta.plazoControl} onChange={(e) => actualizar((c) => ({ ...c, plazoControl: e.target.value }))} placeholder="Ej.: 2 semanas" />}
                </Campo>
              </div>
            )}

            {consulta.desenlace === 'examen_pendiente' && (
              <Campo etiqueta="Examen del que depende la decisión" className="mt-4 max-w-md">
                {(p) => (
                  <Seleccion {...p} value={consulta.examenPendiente} onChange={(e) => actualizar((c) => ({ ...c, examenPendiente: e.target.value }))}>
                    <option value="">Elegir…</option>
                    {consulta.ordenesExamen.map((o) => (
                      <option key={o.id}>{o.examen}</option>
                    ))}
                    <option>Examen externo (no ordenado aquí)</option>
                  </Seleccion>
                )}
              </Campo>
            )}

            {consulta.desenlace === 'indicacion_quirurgica' && (
              <div className="mt-4 flex flex-col gap-3">
                <Segmentado<Lateralidad>
                  pequeno
                  nombre="ojo-operar"
                  etiqueta="Ojo a operar"
                  valor={consulta.ojoOperar}
                  onCambio={(v) => actualizar((c) => ({ ...c, ojoOperar: v }))}
                  opciones={[
                    { valor: 'OD', texto: 'OD' },
                    { valor: 'OI', texto: 'OI' },
                    { valor: 'AO', texto: 'AO' },
                  ]}
                />
                <Aviso tono="info" titulo="La indicación quirúrgica cierra esta espera y abre otra">
                  El caso no queda resuelto: el ingreso a la lista de espera quirúrgica se gestiona en el SOME. Este módulo solo deja anotada la decisión.
                </Aviso>
              </div>
            )}
          </fieldset>
        </Tarjeta>

        <Tarjeta id="tratamiento" titulo="Indicación de tratamiento">
          <Segmentado
            nombre="indicacion-tratamiento"
            etiqueta="¿Hubo indicación de tratamiento óptico o farmacológico?"
            disabled={soloLectura}
            valor={consulta.indicacionTratamiento === null ? null : consulta.indicacionTratamiento ? 'si' : 'no'}
            onCambio={(v) => actualizar((c) => ({ ...c, indicacionTratamiento: v === 'si' }))}
            opciones={[
              { valor: 'si', texto: 'Sí' },
              { valor: 'no', texto: 'No' },
            ]}
          />
          <p className="mt-2 text-[0.8125rem] text-fg-muted">Necesario para cerrar. De aquí sale el denominador del indicador de recetas generadas desde el módulo.</p>
        </Tarjeta>

        <Tarjeta id="contrarreferencia" titulo="Contrarreferencia" accion={cr.emitida ? <Insignia tono="ok" icono={IconoCompleto}>Emitida {hora(cr.emitida)}</Insignia> : <Insignia>Sin emitir</Insignia>}>
          {soloLectura && !cr.emitida ? (
            <p className="text-sm text-fg-muted">No se emitió contrarreferencia en esta consulta.</p>
          ) : (
            <>
              <fieldset disabled={soloLectura} className="grid gap-4 md:grid-cols-2">
                <legend className="sr-only">Contrarreferencia al establecimiento de origen</legend>
                <Campo etiqueta="Establecimiento de destino" ayuda={`La SIC vino de ${ESTABLECIMIENTOS.find((e) => e.id === sic.establecimientoId)?.nombre}.`}>
                  {(p) => (
                    <Seleccion {...p} value={cr.destinoId} onChange={(e) => fijarCr({ destinoId: e.target.value })}>
                      {ESTABLECIMIENTOS.filter((e) => e.tipo !== 'Hospital').map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre} ({e.tipo})
                        </option>
                      ))}
                    </Seleccion>
                  )}
                </Campo>
                <div>
                  <p className="text-[0.8125rem] font-medium text-fg-muted">Diagnóstico (desde el paso 3)</p>
                  {consulta.diagnosticos.length ? (
                    <ul className="mt-1 text-sm">
                      {consulta.diagnosticos.map((d) => (
                        <li key={d.id}>
                          <span className="tnum font-semibold">{d.codigo}</span> {d.descripcion} {d.lateralidad && `(${d.lateralidad})`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-warn">
                      <IconoFaltante size={16} className="shrink-0" aria-hidden="true" /> Sin diagnóstico registrado
                    </p>
                  )}
                </div>
                <Campo etiqueta="Conducta" className="md:col-span-2">
                  {(p) => <AreaTexto {...p} rows={2} value={cr.conducta} onChange={(e) => fijarCr({ conducta: e.target.value })} placeholder="Ej.: inicia latanoprost en AO; se pide control de PIO en la UAPO" />}
                </Campo>
                <Campo etiqueta="Control sugerido" className="md:col-span-2">
                  {(p) => <Entrada {...p} value={cr.controlSugerido} onChange={(e) => fijarCr({ controlSugerido: e.target.value })} placeholder="Ej.: control de PIO en UAPO en 3 meses" />}
                </Campo>
              </fieldset>
              <div className="mt-4 flex justify-end gap-2">
                {cr.emitida || soloLectura ? (
                  <Boton pequeno icono={IconoImprimir} disabled={!cr.emitida} onClick={() => setVista('contrarreferencia')}>
                    Ver e imprimir
                  </Boton>
                ) : (
                  <Boton
                    pequeno
                    icono={IconoImprimir}
                    onClick={() => {
                      fijarCr({ emitida: marcaTiempo() })
                      registrar('Contrarreferencia')
                      setVista('contrarreferencia')
                    }}
                  >
                    Emitir e imprimir
                  </Boton>
                )}
              </div>
            </>
          )}
        </Tarjeta>

        <Tarjeta id="resumen" titulo="Resumen para el paciente" accion={resumen.entregado ? <Insignia tono="ok" icono={IconoCompleto}>Entregado {hora(resumen.entregado)}</Insignia> : undefined}>
          {soloLectura && !resumen.texto.trim() ? (
            <p className="text-sm text-fg-muted">No se entregó resumen al paciente.</p>
          ) : (
            <fieldset disabled={soloLectura}>
              <legend className="sr-only">Resumen para el paciente</legend>
              <Campo etiqueta="Texto en lenguaje simple" ayuda="Se genera desde la consulta y se puede editar antes de imprimir.">
                {(p) => <AreaTexto {...p} rows={6} value={resumen.texto} placeholder="Pulse «Generar desde la consulta» para partir de un borrador" onChange={(e) => fijarResumen({ texto: e.target.value })} />}
              </Campo>
            </fieldset>
          )}
          <div className={cx('mt-4 flex flex-wrap justify-end gap-2', soloLectura && !resumen.texto.trim() && 'hidden')}>
            {!soloLectura && (
              <Boton pequeno variante="fantasma" onClick={() => fijarResumen({ texto: resumenSugerido(consulta) })}>
                Generar desde la consulta
              </Boton>
            )}
            <Boton
              pequeno
              icono={IconoImprimir}
              disabled={!resumen.texto.trim()}
              onClick={() => {
                if (!soloLectura && !resumen.entregado) {
                  fijarResumen({ entregado: marcaTiempo() })
                  registrar('Resumen al paciente')
                }
                setVista('resumen')
              }}
            >
              {resumen.entregado || soloLectura ? 'Ver e imprimir' : 'Imprimir y entregar'}
            </Boton>
          </div>
        </Tarjeta>
      </div>

      {/* Lista de lo que falta: el único lugar donde se exige algo (RNF-06). */}
      <aside aria-labelledby="antes-cerrar" className="flex flex-col gap-4 xl:sticky xl:top-20">
        <section className="rounded-lg border border-line bg-surface p-4 sm:p-5">
          <h2 id="antes-cerrar" className="text-base font-semibold">
            {soloLectura ? 'Estado del cierre' : 'Antes de cerrar'}
          </h2>

          {soloLectura ? (
            <p className="mt-2 inline-flex items-center gap-2 text-sm">
              <IconoSoloLectura size={16} className="shrink-0" aria-hidden="true" /> Consulta cerrada a las {hora(consulta.cierre!)}.
            </p>
          ) : (
            <>
              <ListaFaltantes titulo="Necesario para cerrar" vacio="Todo lo necesario está registrado." items={bloqueos} consultaId={consulta.id} />
              <ListaFaltantes titulo={`Campos obligatorios de ${plantilla.nombre.toLowerCase()}`} vacio="Completos." items={pendientes} consultaId={consulta.id} maximo={6} />
              {avisos.length > 0 && <ListaFaltantes titulo="Recomendado (indicadores)" vacio="" items={avisos} consultaId={consulta.id} />}

              {confirmando ? (
                <div className="mt-5 rounded-md border border-warn-line bg-warn-soft p-3" role="alertdialog" aria-labelledby="confirmar-titulo">
                  <p id="confirmar-titulo" className="font-semibold text-warn">
                    ¿Cerrar con {pendientes.length} campos obligatorios pendientes?
                  </p>
                  <p className="mt-1 text-sm">La consulta queda en solo lectura y se cuenta como incompleta en el indicador de campos obligatorios.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Boton pequeno variante="primario" onClick={cerrar}>
                      Cerrar igual
                    </Boton>
                    <Boton pequeno onClick={() => setConfirmando(false)}>
                      Volver
                    </Boton>
                  </div>
                </div>
              ) : (
                <Boton variante="primario" icono={IconoSoloLectura} className="mt-5 w-full" disabled={bloqueos.length > 0} onClick={() => (pendientes.length ? setConfirmando(true) : cerrar())}>
                  Cerrar consulta
                </Boton>
              )}
              <p className="mt-2 text-[0.8125rem] text-fg-muted">
                {bloqueos.length > 0 ? 'El botón se habilita al completar lo necesario para cerrar. ' : ''}
                Al cerrar queda registrado el autor, la fecha y la hora, y la consulta pasa a solo lectura.
              </p>
            </>
          )}
        </section>
      </aside>

      <DialogoDocumento abierto={vista !== null} onCerrar={() => setVista(null)} titulo="Vista previa del documento">
        {vista === 'contrarreferencia' && (
          <HojaDocumento imprimible titulo="Contrarreferencia" pacienteId={consulta.pacienteId} autorId={consulta.autorId} fecha={consulta.contrarreferencia?.emitida ?? null}>
            <CuerpoContrarreferencia consulta={consulta} />
          </HojaDocumento>
        )}
        {vista === 'resumen' && (
          <HojaDocumento imprimible titulo="Resumen de su atención" pacienteId={consulta.pacienteId} autorId={consulta.autorId} fecha={consulta.resumenPaciente?.entregado ?? null}>
            <CuerpoResumen texto={resumen.texto} />
          </HojaDocumento>
        )}
      </DialogoDocumento>
    </div>
  )
}

const NOMBRE_PASO: Record<Faltante['paso'], string> = {
  anamnesis: 'anamnesis',
  examen: 'examen',
  diagnostico: 'diagnóstico',
  indicaciones: 'indicaciones',
  cierre: 'cierre',
}

function ListaFaltantes({ titulo, vacio, items, consultaId, maximo }: { titulo: string; vacio: string; items: Faltante[]; consultaId: string; maximo?: number }) {
  const visibles = maximo ? items.slice(0, maximo) : items
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold">{titulo}</h3>
      {items.length === 0 ? (
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ok">
          <IconoCompleto size={16} className="shrink-0" aria-hidden="true" /> {vacio}
        </p>
      ) : (
        <ul className="mt-1 flex flex-col gap-1">
          {visibles.map((f) => (
            <li key={f.texto} className="flex items-start gap-1.5 text-sm">
              <IconoFaltante size={16} className="mt-0.5 shrink-0 text-warn" aria-hidden="true" />
              <span className="min-w-0">
                {f.texto}
                {f.paso !== 'cierre' && (
                  <Link to={`/consulta/${consultaId}/${f.paso}`} className="ml-1 inline-flex items-center gap-0.5 font-medium whitespace-nowrap text-primary hover:underline">
                    ir a {NOMBRE_PASO[f.paso]}
                    <IconoAvanzar size={16} aria-hidden="true" />
                  </Link>
                )}
              </span>
            </li>
          ))}
          {maximo && items.length > maximo && <li className="pl-6 text-sm text-fg-muted">y {items.length - maximo} más</li>}
        </ul>
      )}
    </div>
  )
}
