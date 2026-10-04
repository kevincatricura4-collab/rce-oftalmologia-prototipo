import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cx } from './ui'

// Gráficos sin librería externa (intranet). Cada gráfico lleva una sola serie: OD y OI, o un
// indicador y otro, van en gráficos separados (múltiplos pequeños), así la identidad nunca
// depende del color y no hay doble eje. Todo valor también está en la tabla de cada gráfico.

function useAncho<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [ancho, setAncho] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setAncho(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, ancho] as const
}

export interface Punto {
  etiqueta: string
  valor: number | null
}

interface PropsLinea {
  titulo: ReactNode
  puntos: Punto[]
  min: number
  max: number
  /** Línea de referencia (meta, límite normal). */
  referencia?: { valor: number; texto: string }
  formato?: (v: number) => string
  /** Clase de color del trazo (token): text-od, text-oi, text-primary. */
  color?: string
  alto?: number
  unidad?: string
}

export function GraficoLinea({ titulo, puntos, min, max, referencia, formato = (v) => String(v), color = 'text-primary', alto = 170, unidad = '' }: PropsLinea) {
  const [ref, ancho] = useAncho<HTMLDivElement>()
  const [activo, setActivo] = useState<number | null>(null)
  const izq = 36
  const der = 40
  const arriba = 14
  const abajo = 26
  const w = Math.max(ancho - izq - der, 10)
  const h = alto - arriba - abajo
  const x = (i: number) => izq + (puntos.length === 1 ? w / 2 : (i * w) / (puntos.length - 1))
  const y = (v: number) => arriba + h - ((v - min) / (max - min || 1)) * h
  const validos = puntos.map((p, i) => ({ ...p, i })).filter((p): p is Punto & { valor: number; i: number } => p.valor !== null)
  const d = validos.map((p, k) => `${k ? 'L' : 'M'}${x(p.i)},${y(p.valor)}`).join(' ')
  const ticks = [min, (min + max) / 2, max]
  const ultimo = validos.at(-1)
  const sel = activo !== null ? puntos[activo] : null

  const alMover = (e: PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - r.left + izq
    let mejor = 0
    puntos.forEach((_, i) => {
      if (Math.abs(x(i) - px) < Math.abs(x(mejor) - px)) mejor = i
    })
    setActivo(mejor)
  }

  return (
    <figure className="min-w-0">
      <figcaption className="mb-1 text-sm font-semibold">{titulo}</figcaption>
      <div ref={ref} className="relative">
        {ancho > 0 && (
          <svg width={ancho} height={alto} role="img" aria-label={`${typeof titulo === 'string' ? titulo : 'Gráfico'}: ${validos.map((p) => `${p.etiqueta} ${formato(p.valor)}`).join(', ')}`}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={izq} x2={izq + w} y1={y(t)} y2={y(t)} className="stroke-line" strokeWidth={1} />
                <text x={izq - 6} y={y(t)} dy="0.32em" textAnchor="end" className="fill-fg-muted text-[12px]">
                  {formato(t)}
                </text>
              </g>
            ))}
            {referencia && (
              <g>
                <line x1={izq} x2={izq + w} y1={y(referencia.valor)} y2={y(referencia.valor)} className="stroke-fg-muted" strokeWidth={1.5} />
                <text x={izq + w + 4} y={y(referencia.valor)} dy="0.32em" className="fill-fg-muted text-[12px]">
                  {referencia.texto}
                </text>
              </g>
            )}
            {puntos.map((p, i) => (
              <text key={p.etiqueta + i} x={x(i)} y={alto - 6} textAnchor="middle" className="fill-fg-muted text-[12px]">
                {p.etiqueta}
              </text>
            ))}
            {sel && activo !== null && <line x1={x(activo)} x2={x(activo)} y1={arriba} y2={arriba + h} className="stroke-line-strong" strokeWidth={1} />}
            <g className={color}>
              <path d={d} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {validos.map((p) => (
                <circle key={p.i} cx={x(p.i)} cy={y(p.valor)} r={activo === p.i ? 6 : 4.5} fill="currentColor" className="stroke-surface" strokeWidth={2} />
              ))}
            </g>
            {ultimo && !referencia && (
              <text x={x(ultimo.i) + 9} y={y(ultimo.valor)} dy="0.32em" className="fill-fg text-[12px] font-semibold">
                {formato(ultimo.valor)}
              </text>
            )}
            <rect x={izq - 12} y={arriba} width={w + 24} height={h} fill="transparent" onPointerMove={alMover} onPointerLeave={() => setActivo(null)} />
          </svg>
        )}
        {sel && activo !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-line bg-surface px-2 py-1 text-sm shadow-lg"
            style={{ left: Math.min(Math.max(x(activo), 50), ancho - 50), top: 0 }}
          >
            <span className="block font-semibold">{sel.valor === null ? 'Sin dato' : `${formato(sel.valor)} ${unidad}`}</span>
            <span className="block text-[0.8125rem] text-fg-muted">{sel.etiqueta}</span>
          </div>
        )}
      </div>
    </figure>
  )
}

/** Barras horizontales de una serie, con el valor en la punta. */
export function BarrasHorizontales({ items, formato = (v) => String(v), etiquetaAncha = false }: { items: { etiqueta: ReactNode; valor: number; detalle?: string }[]; formato?: (v: number) => string; etiquetaAncha?: boolean }) {
  const max = Math.max(...items.map((i) => i.valor), 1)
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((it, k) => (
        <li key={k} className={cx('grid items-center gap-3', etiquetaAncha ? 'grid-cols-[minmax(0,13rem)_1fr] lg:grid-cols-[minmax(0,19rem)_1fr]' : 'grid-cols-[minmax(0,11rem)_1fr]')} title={it.detalle}>
          <span className="truncate text-sm">{it.etiqueta}</span>
          <span className="flex min-w-0 items-center gap-2">
            {/* El largo es proporcional al valor dentro del espacio que deja la cifra (3,5rem), sin tope que iguale barras distintas. */}
            <span className="h-5 shrink-0 rounded-r bg-primary" style={{ width: `calc((100% - 3.5rem) * ${it.valor / max})`, minWidth: it.valor ? 4 : 0 }} aria-hidden="true" />
            <span className="tnum text-sm font-semibold">{formato(it.valor)}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Vista de tabla plegable: todo valor de un gráfico es alcanzable sin pasar el puntero. */
export function TablaDatos({ titulo, columnas, filas }: { titulo: string; columnas: string[]; filas: (string | number)[][] }) {
  return (
    <details className="mt-3 text-sm">
      <summary className="inline-flex min-h-8 items-center font-medium text-primary">Ver como tabla</summary>
      <div className="relative mt-2 overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="sr-only">{titulo}</caption>
          <thead>
            <tr className="border-b border-line">
              {columnas.map((c, i) => (
                <th key={c} scope="col" className={cx('py-1.5 pr-3 font-semibold', i ? 'text-right' : 'text-left')}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={i} className="border-b border-line/60">
                {f.map((v, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="py-1.5 pr-3 text-left font-normal">
                      {v}
                    </th>
                  ) : (
                    <td key={j} className="py-1.5 pr-3 text-right">
                      {v}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
