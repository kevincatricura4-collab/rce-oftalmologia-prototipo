import { useState, type ReactNode } from 'react'
import { DialogoDocumento, HojaDocumento } from '../../components/Documento'
import { IconoAgregar, IconoCompleto, IconoImprimir, IconoOrdenExamen, IconoQuitar, IconoRecetaMedicamentos, IconoRecetaOptica, IconoTraerDelExamen } from '../../components/iconos'
import { Boton, Campo, Entrada, Insignia, Segmentado, Seleccion, Tarjeta, claseEntrada, cx } from '../../components/ui'
import { DURACIONES, FRECUENCIAS } from '../../lib/catalogos'
import { hora, marcaTiempo, nuevoId } from '../../lib/formato'
import { useEstado } from '../../lib/store'
import type { EstadoOrden, Lateralidad, Ojo, OrdenExamen, RecetaMedicamento, RecetaOptica, ValoresRefraccion } from '../../lib/tipos'
import type { PropsPaso } from './contexto'
import { CuerpoOrden, CuerpoRecetaMedicamentos, CuerpoRecetaOptica } from './documentos'

type Vista = { tipo: 'optica' } | { tipo: 'medicamentos' } | { tipo: 'orden'; id: string } | null

const OPCIONES_OJO = [
  { valor: 'OD' as Lateralidad, texto: 'OD' },
  { valor: 'OI' as Lateralidad, texto: 'OI' },
  { valor: 'AO' as Lateralidad, texto: 'AO' },
]

const recetaVacia = (): RecetaOptica => {
  const v: ValoresRefraccion = { esfera: '', cilindro: '', eje: '', adicion: '' }
  return { OD: { ...v }, OI: { ...v }, distanciaPupilar: '', indicaciones: '', emitida: null }
}

function Emitido({ fecha }: { fecha: string | null }) {
  return fecha ? (
    <Insignia tono="ok" icono={IconoCompleto}>
      Emitida {hora(fecha)}
    </Insignia>
  ) : (
    <Insignia>Sin emitir</Insignia>
  )
}

/** Pantalla 6 — Consulta, paso 4: receta óptica, receta de medicamentos y orden de examen (RF-08 a RF-10). */
export function PasoIndicaciones({ consulta, soloLectura, actualizar, registrar }: PropsPaso) {
  const { datos } = useEstado()
  const [vista, setVista] = useState<Vista>(null)
  const ro = consulta.recetaOptica
  const meds = consulta.recetasMedicamento
  const ordenes = consulta.ordenesExamen

  // ---- Receta óptica ----
  const fijarOptica = (cambio: (r: RecetaOptica) => RecetaOptica) => actualizar((c) => ({ ...c, recetaOptica: cambio(c.recetaOptica ?? recetaVacia()) }))
  const desdeRefraccion = () =>
    fijarOptica((r) => {
      const h = consulta.hallazgos
      const valores = (o: Ojo): ValoresRefraccion => ({
        esfera: h.ref_esfera?.[o] ?? '',
        cilindro: h.ref_cilindro?.[o] ?? '',
        eje: h.ref_eje?.[o] ?? '',
        adicion: h.ref_adicion?.[o] ?? '',
      })
      return { ...r, OD: valores('OD'), OI: valores('OI') }
    })
  const hayRefraccion = ['ref_esfera', 'ref_cilindro'].some((id) => consulta.hallazgos[id]?.OD || consulta.hallazgos[id]?.OI)

  // ---- Medicamentos ----
  const fijarMeds = (lista: RecetaMedicamento[]) => actualizar((c) => ({ ...c, recetasMedicamento: lista }))
  const editarMed = (id: string, parcial: Partial<RecetaMedicamento>) => fijarMeds(meds.map((m) => (m.id === id ? { ...m, ...parcial } : m)))

  // ---- Órdenes ----
  const fijarOrdenes = (lista: OrdenExamen[]) => actualizar((c) => ({ ...c, ordenesExamen: lista }))
  const editarOrden = (id: string, parcial: Partial<OrdenExamen>) => fijarOrdenes(ordenes.map((o) => (o.id === id ? { ...o, ...parcial } : o)))

  const emitir = (v: NonNullable<Vista>) => {
    const ahora = marcaTiempo()
    if (v.tipo === 'optica') {
      fijarOptica((r) => ({ ...r, emitida: ahora }))
      registrar('Receta óptica')
    } else if (v.tipo === 'medicamentos') {
      fijarMeds(meds.map((m) => ({ ...m, emitida: ahora })))
      registrar('Receta de medicamentos')
    } else {
      editarOrden(v.id, { emitida: ahora })
      registrar('Orden de examen')
    }
    setVista(v)
  }

  const ordenEnVista = vista?.tipo === 'orden' ? ordenes.find((o) => o.id === vista.id) : null

  return (
    <div className="flex flex-col gap-5">
      {/* Receta óptica */}
      <Tarjeta
        id="receta-optica"
        titulo={<span className="inline-flex items-center gap-2"><IconoRecetaOptica size={16} className="text-fg-muted" aria-hidden="true" />Receta óptica</span>}
        accion={ro && <Emitido fecha={ro.emitida} />}
      >
        {!ro ? (
          soloLectura ? (
            <p className="text-sm text-fg-muted">No se emitió receta óptica.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Boton icono={IconoTraerDelExamen} disabled={!hayRefraccion} onClick={desdeRefraccion}>
                Partir desde la refracción del examen
              </Boton>
              <Boton icono={IconoAgregar} variante="fantasma" onClick={() => fijarOptica((r) => r)}>
                Receta en blanco
              </Boton>
              {!hayRefraccion && <p className="w-full text-[0.8125rem] text-fg-muted">El examen no tiene refracción registrada.</p>}
            </div>
          )
        ) : (
          <fieldset disabled={soloLectura}>
            <legend className="sr-only">Valores de la receta óptica por ojo</legend>
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse">
                <thead>
                  <tr className="border-b border-line bg-muted text-sm">
                    <th scope="col" className="px-3 py-2 text-left font-semibold">Campo</th>
                    <th scope="col" className="px-2 py-2 text-center font-bold text-od">OD</th>
                    <th scope="col" className="px-2 py-2 text-center font-bold text-oi">OI</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ['esfera', 'Esfera (D)'],
                      ['cilindro', 'Cilindro (D)'],
                      ['eje', 'Eje (°)'],
                      ['adicion', 'Adición (D)'],
                    ] as [keyof ValoresRefraccion, string][]
                  ).map(([clave, etiqueta]) => (
                    <tr key={clave} className="border-b border-line/70">
                      <th scope="row" className="px-3 py-1.5 text-left font-normal">{etiqueta}</th>
                      {(['OD', 'OI'] as Ojo[]).map((o) => (
                        <td key={o} className="px-2 py-1.5">
                          <input
                            aria-label={`${etiqueta}, ${o}`}
                            inputMode="decimal"
                            value={ro[o][clave]}
                            onChange={(e) => fijarOptica((r) => ({ ...r, [o]: { ...r[o], [clave]: e.target.value } }))}
                            className={cx(claseEntrada, 'h-9 text-center font-medium')}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-[10rem_1fr]">
              <Campo etiqueta="Distancia pupilar (mm)">
                {(p) => <Entrada {...p} inputMode="numeric" value={ro.distanciaPupilar} onChange={(e) => fijarOptica((r) => ({ ...r, distanciaPupilar: e.target.value }))} />}
              </Campo>
              <Campo etiqueta="Indicaciones">
                {(p) => <Entrada {...p} value={ro.indicaciones} placeholder="Ej.: uso permanente, lentes bifocales" onChange={(e) => fijarOptica((r) => ({ ...r, indicaciones: e.target.value }))} />}
              </Campo>
            </div>
          </fieldset>
        )}
        {ro && <AccionesDocumento emitida={ro.emitida} soloLectura={soloLectura} onEmitir={() => emitir({ tipo: 'optica' })} onVer={() => setVista({ tipo: 'optica' })} onQuitar={() => actualizar((c) => ({ ...c, recetaOptica: null }))} />}
      </Tarjeta>

      {/* Medicamentos */}
      <Tarjeta
        id="receta-med"
        titulo={<span className="inline-flex items-center gap-2"><IconoRecetaMedicamentos size={16} className="text-fg-muted" aria-hidden="true" />Receta de medicamentos</span>}
        accion={meds.length > 0 && <Emitido fecha={meds.every((m) => m.emitida) ? meds[0].emitida : null} />}
      >
        {meds.length === 0 && <p className="text-sm text-fg-muted">{soloLectura ? 'No se emitió receta de medicamentos.' : 'Sin fármacos indicados.'}</p>}
        <ul className="flex flex-col gap-3">
          {meds.map((m, i) => (
            <li key={m.id} className="rounded-md border border-line p-3">
              <fieldset disabled={soloLectura} className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <legend className="sr-only">Fármaco {i + 1}</legend>
                <Campo etiqueta="Fármaco (catálogo)">
                  {(p) => (
                    <Seleccion {...p} value={m.farmaco} onChange={(e) => editarMed(m.id, { farmaco: e.target.value })}>
                      <option value="">Elegir…</option>
                      {datos.catalogos.farmacos.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </Seleccion>
                  )}
                </Campo>
                <Campo etiqueta="Dosis">{(p) => <Entrada {...p} value={m.dosis} placeholder="Ej.: 1 gota" onChange={(e) => editarMed(m.id, { dosis: e.target.value })} />}</Campo>
                <Campo etiqueta="Frecuencia">
                  {(p) => (
                    <Seleccion {...p} value={m.frecuencia} onChange={(e) => editarMed(m.id, { frecuencia: e.target.value })}>
                      <option value="">Elegir…</option>
                      {FRECUENCIAS.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </Seleccion>
                  )}
                </Campo>
                <Campo etiqueta="Duración">
                  {(p) => (
                    <Seleccion {...p} value={m.duracion} onChange={(e) => editarMed(m.id, { duracion: e.target.value })}>
                      <option value="">Elegir…</option>
                      {DURACIONES.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </Seleccion>
                  )}
                </Campo>
                <div className="flex flex-wrap items-end justify-between gap-3 md:col-span-2 lg:col-span-4">
                  <Segmentado pequeno nombre={`ojo-${m.id}`} etiqueta="Ojo" valor={m.ojo} disabled={soloLectura} onCambio={(v) => editarMed(m.id, { ojo: v })} opciones={OPCIONES_OJO} />
                  {!soloLectura && (
                    <Boton pequeno variante="peligro" icono={IconoQuitar} onClick={() => fijarMeds(meds.filter((x) => x.id !== m.id))}>
                      Quitar
                    </Boton>
                  )}
                </div>
              </fieldset>
            </li>
          ))}
        </ul>
        {!soloLectura && (
          <Boton className="mt-3" variante="fantasma" icono={IconoAgregar} onClick={() => fijarMeds([...meds, { id: nuevoId('m'), farmaco: '', dosis: '1 gota', frecuencia: '', duracion: '', ojo: null, emitida: null }])}>
            Agregar fármaco
          </Boton>
        )}
        {meds.length > 0 && (
          <AccionesDocumento emitida={meds.every((m) => m.emitida) ? meds[0].emitida : null} soloLectura={soloLectura} onEmitir={() => emitir({ tipo: 'medicamentos' })} onVer={() => setVista({ tipo: 'medicamentos' })} />
        )}
      </Tarjeta>

      {/* Órdenes de examen */}
      <Tarjeta id="ordenes" titulo={<span className="inline-flex items-center gap-2"><IconoOrdenExamen size={16} className="text-fg-muted" aria-hidden="true" />Orden de examen de apoyo</span>}>
        {ordenes.length === 0 && <p className="text-sm text-fg-muted">{soloLectura ? 'No se ordenaron exámenes.' : 'Sin exámenes ordenados.'}</p>}
        <ul className="flex flex-col gap-3">
          {ordenes.map((o) => (
            <li key={o.id} className="rounded-md border border-line p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-semibold">{o.examen || 'Nueva orden'}</p>
                <Emitido fecha={o.emitida} />
              </div>
              <fieldset disabled={soloLectura} className="grid gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_auto_minmax(0,1.5fr)]">
                <legend className="sr-only">Orden de examen {o.examen}</legend>
                <Campo etiqueta="Examen (catálogo)">
                  {(p) => (
                    <Seleccion {...p} value={o.examen} onChange={(e) => editarOrden(o.id, { examen: e.target.value })}>
                      <option value="">Elegir…</option>
                      {datos.catalogos.examenes.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </Seleccion>
                  )}
                </Campo>
                <Segmentado pequeno nombre={`ojo-${o.id}`} etiqueta="Ojo" valor={o.ojo} disabled={soloLectura} onCambio={(v) => editarOrden(o.id, { ojo: v })} opciones={OPCIONES_OJO} />
                <Campo etiqueta="Indicación">{(p) => <Entrada {...p} value={o.indicacion} onChange={(e) => editarOrden(o.id, { indicacion: e.target.value })} />}</Campo>
              </fieldset>
              {o.emitida && (
                <div className="mt-3 grid gap-3 border-t border-line pt-3 md:grid-cols-[auto_1fr]">
                  <Segmentado<EstadoOrden>
                    pequeno
                    nombre={`estado-${o.id}`}
                    etiqueta="Estado"
                    valor={o.estado}
                    disabled={soloLectura}
                    onCambio={(v) => editarOrden(o.id, { estado: v })}
                    opciones={[
                      { valor: 'Emitida', texto: 'Emitida' },
                      { valor: 'Resultado recibido', texto: 'Resultado recibido' },
                    ]}
                  />
                  <Campo etiqueta="Dónde quedó el resultado" ayuda="El módulo no guarda imágenes: solo la referencia.">
                    {(p) => <Entrada {...p} disabled={soloLectura} value={o.referenciaResultado} placeholder="Ej.: equipo OCT sala 3, informe en ficha papel" onChange={(e) => editarOrden(o.id, { referenciaResultado: e.target.value })} />}
                  </Campo>
                </div>
              )}
              <AccionesDocumento emitida={o.emitida} soloLectura={soloLectura} onEmitir={() => emitir({ tipo: 'orden', id: o.id })} onVer={() => setVista({ tipo: 'orden', id: o.id })} onQuitar={o.emitida ? undefined : () => fijarOrdenes(ordenes.filter((x) => x.id !== o.id))} deshabilitar={!o.examen} />
            </li>
          ))}
        </ul>
        {!soloLectura && (
          <Boton className="mt-3" variante="fantasma" icono={IconoAgregar} onClick={() => fijarOrdenes([...ordenes, { id: nuevoId('o'), examen: '', ojo: null, indicacion: '', estado: 'Emitida', referenciaResultado: '', emitida: null }])}>
            Agregar orden de examen
          </Boton>
        )}
      </Tarjeta>

      <DialogoDocumento abierto={vista !== null} onCerrar={() => setVista(null)} titulo="Vista previa del documento">
        {vista?.tipo === 'optica' && ro && (
          <HojaDocumento imprimible titulo="Receta óptica" pacienteId={consulta.pacienteId} autorId={consulta.autorId} fecha={ro.emitida}>
            <CuerpoRecetaOptica receta={ro} />
          </HojaDocumento>
        )}
        {vista?.tipo === 'medicamentos' && (
          <HojaDocumento imprimible titulo="Receta de medicamentos" pacienteId={consulta.pacienteId} autorId={consulta.autorId} fecha={meds[0]?.emitida ?? null}>
            <CuerpoRecetaMedicamentos recetas={meds} />
          </HojaDocumento>
        )}
        {ordenEnVista && (
          <HojaDocumento imprimible titulo="Orden de examen" pacienteId={consulta.pacienteId} autorId={consulta.autorId} fecha={ordenEnVista.emitida}>
            <CuerpoOrden orden={ordenEnVista} diagnosticos={consulta.diagnosticos} />
          </HojaDocumento>
        )}
      </DialogoDocumento>
    </div>
  )
}

function AccionesDocumento({ emitida, soloLectura, onEmitir, onVer, onQuitar, deshabilitar }: { emitida: string | null; soloLectura: boolean; onEmitir: () => void; onVer: () => void; onQuitar?: () => void; deshabilitar?: boolean }): ReactNode {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
      {!soloLectura && onQuitar && !emitida && (
        <Boton pequeno variante="peligro" icono={IconoQuitar} onClick={onQuitar}>
          Descartar
        </Boton>
      )}
      {emitida || soloLectura ? (
        <Boton pequeno icono={IconoImprimir} onClick={onVer} disabled={!emitida}>
          Ver e imprimir
        </Boton>
      ) : (
        <Boton pequeno icono={IconoImprimir} onClick={onEmitir} disabled={deshabilitar}>
          Emitir e imprimir
        </Boton>
      )}
      {emitida && !soloLectura && (
        <Boton pequeno variante="fantasma" onClick={onEmitir}>
          Volver a emitir con cambios
        </Boton>
      )}
    </div>
  )
}
