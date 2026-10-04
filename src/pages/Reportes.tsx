import { useMemo, useState } from 'react'
import { BarrasHorizontales, GraficoLinea, TablaDatos } from '../components/Graficos'
import { IconoCompleto, IconoDatosPrueba, IconoFaltante } from '../components/iconos'
import { TituloPantalla, useTituloPagina } from '../components/Layout'
import { Aviso, Seleccion, Tarjeta } from '../components/ui'
import { CIE10, NOMBRE_DESENLACE } from '../lib/catalogos'
import { mesAnio } from '../lib/formato'
import { NOMBRE_TIPO, TIPOS_ATENCION } from '../lib/plantillas'
import { INDICADORES, MESES_OPERACION, simular, valorIndicador } from '../lib/reportes'
import { useEstado } from '../lib/store'
import type { Desenlace } from '../lib/tipos'

const pct = (v: number) => `${v.toLocaleString('es-CL', { maximumFractionDigits: 1 })}%`
const descripcionDx = (cod: string) => CIE10.find((c) => c.codigo === cod)?.descripcion ?? cod

/** Pantalla 9 — Reportes de jefatura (RF-15). Solo datos agregados, sin pacientes identificables. */
export function Reportes() {
  const { datos } = useEstado()
  const registros = useMemo(simular, [])
  const [mes, setMes] = useState<string>('todos')
  useTituloPagina('Reportes')

  const delMes = mes === 'todos' ? registros : registros.filter((r) => r.mes === Number(mes))
  const contar = <K extends string>(clave: (r: (typeof registros)[number]) => K) => {
    const m = new Map<K, number>()
    for (const r of delMes) m.set(clave(r), (m.get(clave(r)) ?? 0) + 1)
    return m
  }
  const porTipo = contar((r) => r.tipo)
  const porDx = [...contar((r) => r.dx)].sort((a, b) => b[1] - a[1]).slice(0, 8)
  const porDesenlace = contar((r) => r.desenlace)

  const hoy = Object.values(datos.consultas).filter((c) => c.estado === 'cerrada' && c.citaId)

  return (
    <div className="mx-auto max-w-[80rem]">
      <TituloPantalla
        titulo="Reportes de actividad e indicadores"
        detalle="Policlínico de Oftalmología, Hospital San Lucas. Solo datos agregados: ningún reporte identifica pacientes."
      />

      <Aviso tono="faltante" titulo="Cifras simuladas con datos de prueba" className="mb-5">
        Los seis meses de operación (abril a septiembre de 2026) se generan con una simulación fija para mostrar cómo se leerán los indicadores. No son resultados reales del proyecto.
      </Aviso>

      <h2 className="mb-3 text-lg font-semibold">Indicadores del proyecto</h2>
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {INDICADORES.map((ind) => {
          const serie = MESES_OPERACION.map((_, i) => valorIndicador(ind.id, registros.filter((r) => r.mes === i)))
          const enMeta = serie[ind.mesMeta]
          const cumple = enMeta.pct >= ind.meta
          return (
            <section key={ind.id} aria-labelledby={`ind-${ind.id}`} className="flex min-w-0 flex-col rounded-lg border border-line bg-surface p-4 sm:p-5">
              <h3 id={`ind-${ind.id}`} className="text-[0.9375rem] font-semibold">
                {ind.corto}
              </h3>
              <p className="mt-0.5 text-[0.8125rem] text-fg-muted">{ind.nombre}</p>
              <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
                <p className="tnum font-display text-3xl leading-none font-bold">{pct(enMeta.pct)}</p>
                <p className="text-sm text-fg-muted">
                  {mesAnio(`${MESES_OPERACION[ind.mesMeta]}-01`)} · meta ≥ {ind.meta}% {ind.plazo}
                </p>
              </div>
              <p className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold ${cumple ? 'text-ok' : 'text-warn'}`}>
                {cumple ? <IconoCompleto size={16} className="shrink-0 text-ok" aria-hidden="true" /> : <IconoFaltante size={16} className="shrink-0 text-warn" aria-hidden="true" />}
                {cumple ? 'Cumple la meta' : 'Bajo la meta'} · {enMeta.num} de {enMeta.den}
                {ind.lineaBase !== null && <span className="font-normal text-fg-muted"> · línea base {ind.lineaBase}%</span>}
              </p>
              <div className="mt-4">
                <GraficoLinea
                  titulo={<span className="sr-only">{ind.corto} por mes</span>}
                  puntos={serie.map((v, i) => ({ etiqueta: mesAnio(`${MESES_OPERACION[i]}-01`).slice(0, 3), valor: v.pct }))}
                  min={0}
                  max={100}
                  referencia={{ valor: ind.meta, texto: `meta` }}
                  formato={(v) => `${Math.round(v)}%`}
                  unidad=""
                  alto={150}
                />
              </div>
              <TablaDatos
                titulo={`${ind.corto} por mes`}
                columnas={['Mes', 'Numerador', 'Denominador', '%']}
                filas={serie.map((v, i) => [mesAnio(`${MESES_OPERACION[i]}-01`), v.num, v.den, pct(v.pct)])}
              />
            </section>
          )
        })}
      </div>

      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-lg font-semibold">Actividad del policlínico</h2>
        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium text-fg-muted">Período</span>
          <Seleccion value={mes} onChange={(e) => setMes(e.target.value)} className="w-52">
            <option value="todos">Abril a septiembre 2026</option>
            {MESES_OPERACION.map((m, i) => (
              <option key={m} value={String(i)}>
                {mesAnio(`${m}-01`)}
              </option>
            ))}
          </Seleccion>
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Tarjeta id="r-tipo" titulo={`Por tipo de atención · ${delMes.length} consultas`}>
          <BarrasHorizontales items={TIPOS_ATENCION.map((t) => ({ etiqueta: NOMBRE_TIPO[t], valor: porTipo.get(t) ?? 0 }))} />
        </Tarjeta>
        <Tarjeta id="r-desenlace" titulo="Por desenlace">
          <BarrasHorizontales items={(Object.keys(NOMBRE_DESENLACE) as Desenlace[]).map((d) => ({ etiqueta: NOMBRE_DESENLACE[d], valor: porDesenlace.get(d) ?? 0 }))} />
        </Tarjeta>
        <Tarjeta id="r-dx" titulo="Diagnósticos principales más frecuentes" className="lg:col-span-2 xl:col-span-1">
          <BarrasHorizontales
            etiquetaAncha
            items={porDx.map(([cod, n]) => ({
              etiqueta: (
                <>
                  <span className="tnum font-semibold">{cod}</span> {descripcionDx(cod)}
                </>
              ),
              detalle: `${cod} ${descripcionDx(cod)}`,
              valor: n,
            }))}
          />
        </Tarjeta>
      </div>

      <Tarjeta id="r-hoy" titulo="Jornada de hoy en el módulo" className="mt-6">
        <p className="inline-flex items-center gap-2 text-sm">
          <IconoDatosPrueba size={16} className="shrink-0 text-warn" aria-hidden="true" />
          {hoy.length} consultas cerradas hoy en este recorrido de prueba ·{' '}
          {hoy.filter((c) => c.cerradaConPendientes === 0).length} con todos los campos obligatorios · {hoy.filter((c) => c.desenlace === 'alta' && c.contrarreferencia?.emitida).length} de{' '}
          {hoy.filter((c) => c.desenlace === 'alta').length} altas con contrarreferencia.
        </p>
      </Tarjeta>
    </div>
  )
}
