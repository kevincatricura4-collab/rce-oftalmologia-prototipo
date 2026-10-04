import { MagnifyingGlass, Plus, Trash } from '@phosphor-icons/react'
import { useId, useMemo, useState } from 'react'
import { Aviso, Boton, Insignia, Segmentado, Tarjeta, claseEntrada, cx } from '../../components/ui'
import { CIE10 } from '../../lib/catalogos'
import { sic as buscarSic } from '../../lib/datos'
import { nuevoId } from '../../lib/formato'
import type { Diagnostico, Lateralidad } from '../../lib/tipos'
import type { PropsPaso } from './contexto'

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

// Sugerencias según la sospecha de la SIC: atajo, no reemplaza la búsqueda.
const SUGERENCIAS: Record<string, string[]> = {
  glaucoma: ['H40.0', 'H40.1'],
  catarata: ['H25.0', 'H25.1', 'H25.9'],
  'vicio de refraccion': ['H52.1', 'H52.0', 'H52.2', 'H52.4'],
  'retinopatia diabetica': ['H36.0', 'H35.0'],
  pterigion: ['H11.0'],
}

/** Pantalla 5 — Consulta, paso 3: diagnóstico codificado CIE-10 con lateralidad (RF-07). */
export function PasoDiagnostico({ consulta, soloLectura, actualizar, registrar }: PropsPaso) {
  const [busqueda, setBusqueda] = useState('')
  const idBusqueda = useId()
  const sic = buscarSic(consulta.sicId)
  const dx = consulta.diagnosticos

  const resultados = useMemo(() => {
    const q = normalizar(busqueda.trim())
    if (q.length < 2) return []
    return CIE10.filter((c) => normalizar(`${c.codigo} ${c.descripcion} ${c.terminos ?? ''}`).includes(q)).slice(0, 8)
  }, [busqueda])

  const sugeridos = (SUGERENCIAS[normalizar(sic.sospecha ?? '')] ?? []).map((cod) => CIE10.find((c) => c.codigo === cod)!).filter(Boolean)

  const cambiar = (lista: Diagnostico[]) => actualizar((c) => ({ ...c, diagnosticos: lista }))

  const agregar = (codigo: string, descripcion: string) => {
    cambiar([...dx, { id: nuevoId('d'), codigo, descripcion, lateralidad: null, principal: dx.length === 0 }])
    registrar('Diagnóstico')
    setBusqueda('')
  }

  const editar = (id: string, parcial: Partial<Diagnostico>) => cambiar(dx.map((d) => (d.id === id ? { ...d, ...parcial } : d)))

  const quitar = (id: string) => {
    const resto = dx.filter((d) => d.id !== id)
    if (resto.length && !resto.some((d) => d.principal)) resto[0] = { ...resto[0], principal: true }
    cambiar(resto)
  }

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      {!soloLectura && (
        <Tarjeta id="buscar-dx" titulo="Buscar diagnóstico CIE-10">
          <label htmlFor={idBusqueda} className="text-[0.8125rem] font-medium text-fg-muted">
            Texto o código
          </label>
          <div className="relative mt-1">
            <MagnifyingGlass size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted" aria-hidden="true" />
            <input
              id={idBusqueda}
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej.: glaucoma, catarata nuclear, H52"
              className={cx(claseEntrada, 'pl-10')}
              autoComplete="off"
              aria-describedby={`${idBusqueda}-n`}
            />
          </div>
          <p id={`${idBusqueda}-n`} className="sr-only" aria-live="polite">
            {busqueda.trim().length >= 2 ? `${resultados.length} resultados` : ''}
          </p>

          {resultados.length > 0 && (
            <ul className="mt-3 divide-y divide-line rounded-md border border-line" aria-label="Resultados de la búsqueda">
              {resultados.map((r) => (
                <li key={r.codigo}>
                  <button type="button" onClick={() => agregar(r.codigo, r.descripcion)} className="flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left transition-colors duration-150 hover:bg-primary-soft">
                    <span className="tnum w-14 shrink-0 font-semibold text-primary">{r.codigo}</span>
                    <span className="min-w-0 flex-1">{r.descripcion}</span>
                    <Plus size={16} className="shrink-0 text-fg-muted" aria-hidden="true" />
                    <span className="sr-only">Agregar</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {busqueda.trim().length >= 2 && resultados.length === 0 && <p className="mt-3 text-sm text-fg-muted">Sin resultados en el catálogo de prueba.</p>}

          {sugeridos.length > 0 && (
            <div className="mt-5">
              <p className="text-[0.8125rem] font-medium text-fg-muted">Según la sospecha de la SIC ({sic.sospecha?.toLowerCase()})</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sugeridos.map((s) => (
                  <Boton key={s.codigo} pequeno icono={Plus} onClick={() => agregar(s.codigo, s.descripcion)} disabled={dx.some((d) => d.codigo === s.codigo)}>
                    <span className="tnum font-semibold">{s.codigo}</span> {s.descripcion}
                  </Boton>
                ))}
              </div>
            </div>
          )}
        </Tarjeta>
      )}

      <Tarjeta id="dx" titulo={`Diagnósticos de la consulta (${dx.length})`} className={soloLectura ? 'xl:col-span-2' : undefined}>
        {dx.length === 0 ? (
          <Aviso tono="info" titulo="Sin diagnósticos todavía">
            Busque por texto o código. Cada diagnóstico lleva lateralidad y se marca como principal o secundario.
          </Aviso>
        ) : (
          <ul className="flex flex-col gap-3">
            {dx.map((d) => (
              <li key={d.id} className="rounded-md border border-line p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0">
                    <span className="tnum mr-2 font-bold text-primary">{d.codigo}</span>
                    {d.descripcion}
                    {d.principal ? <Insignia tono="info" className="ml-2">Principal</Insignia> : <Insignia className="ml-2">Secundario</Insignia>}
                  </p>
                  {!soloLectura && (
                    <button type="button" onClick={() => quitar(d.id)} aria-label={`Quitar ${d.codigo} ${d.descripcion}`} className="grid size-9 shrink-0 place-items-center rounded-md text-danger hover:bg-danger-soft">
                      <Trash size={18} aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-end gap-x-6 gap-y-2">
                  <Segmentado<Lateralidad>
                    pequeno
                    nombre={`lat-${d.id}`}
                    etiqueta="Lateralidad"
                    disabled={soloLectura}
                    valor={d.lateralidad}
                    onCambio={(v) => editar(d.id, { lateralidad: v })}
                    opciones={[
                      { valor: 'OD', texto: 'OD' },
                      { valor: 'OI', texto: 'OI' },
                      { valor: 'AO', texto: 'AO' },
                    ]}
                  />
                  {!d.principal && !soloLectura && (
                    <Boton pequeno variante="fantasma" onClick={() => cambiar(dx.map((x) => ({ ...x, principal: x.id === d.id })))}>
                      Marcar como principal
                    </Boton>
                  )}
                  {!d.lateralidad && <Insignia tono="faltante">Falta lateralidad</Insignia>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </div>
  )
}
