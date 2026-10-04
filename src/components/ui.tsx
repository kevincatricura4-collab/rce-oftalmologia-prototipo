import { IconoCompleto, IconoError, IconoFaltante, IconoInformacion, type Icono as TipoIcono } from './iconos'
import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import type { Lateralidad } from '../lib/tipos'

// Componentes base del sistema de diseño (design-system/MASTER.md, sección Componentes).

export function cx(...clases: (string | false | null | undefined)[]): string {
  return clases.filter(Boolean).join(' ')
}

// ---------- Botón ----------

type Variante = 'primario' | 'secundario' | 'fantasma' | 'peligro'

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-primary text-on-primary hover:bg-primary-hover border border-transparent',
  secundario: 'border border-line-strong bg-surface text-fg hover:bg-muted',
  fantasma: 'border border-transparent text-primary hover:bg-primary-soft',
  peligro: 'border border-danger bg-surface text-danger hover:bg-danger-soft',
}

// Deshabilitado: gris legible en vez de transparencia, para que se lea qué acción falta habilitar.
const DESHABILITADO = 'disabled:border-line disabled:bg-muted disabled:text-fg-muted disabled:hover:bg-muted'

interface PropsBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  icono?: TipoIcono
  pequeno?: boolean
}

export function Boton({ variante = 'secundario', icono: Icono, pequeno, className, children, type = 'button', ...resto }: PropsBoton) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150',
        pequeno ? 'h-8 px-2.5 text-sm' : 'h-10 px-4 text-[0.9375rem]',
        VARIANTES[variante],
        DESHABILITADO,
        className,
      )}
      {...resto}
    >
      {Icono && <Icono size={16} aria-hidden="true" />}
      {children}
    </button>
  )
}

// ---------- Campos ----------

// El placeholder usa fg-muted completo (contraste 4,5:1) y desaparece en solo lectura, para que un
// ejemplo nunca se lea como dato registrado. :read-only se limita a input y textarea: en un select
// siempre es verdadero y lo haría ver deshabilitado.
export const claseEntrada =
  'h-10 w-full min-w-0 rounded-md border border-line-strong bg-surface px-3 text-[0.9375rem] text-fg transition-colors duration-150 placeholder:text-fg-muted disabled:border-line disabled:bg-muted disabled:text-fg disabled:placeholder:text-transparent [&:is(input,textarea):read-only]:bg-muted [&:is(input,textarea):read-only]:placeholder:text-transparent'

export function Entrada({ className, ...resto }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(claseEntrada, className)} {...resto} />
}

export function Seleccion({ className, children, ...resto }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(claseEntrada, 'pr-8', className)} {...resto}>
      {children}
    </select>
  )
}

export function AreaTexto({ className, ...resto }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(claseEntrada, 'h-auto min-h-20 py-2 leading-relaxed', className)} {...resto} />
}

interface PropsCampo {
  etiqueta: ReactNode
  ayuda?: ReactNode
  error?: string
  className?: string
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
}

/** Etiqueta visible arriba, ayuda y error debajo (con role="alert"). */
export function Campo({ etiqueta, ayuda, error, className, children }: PropsCampo) {
  const id = useId()
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`
  const describedby = [ayuda && idAyuda, error && idError].filter(Boolean).join(' ') || undefined
  return (
    <div className={cx('flex min-w-0 flex-col gap-1', className)}>
      <label htmlFor={id} className="text-[0.8125rem] font-medium text-fg-muted">
        {etiqueta}
      </label>
      {children({ id, 'aria-describedby': describedby, 'aria-invalid': error ? true : undefined })}
      {ayuda && (
        <p id={idAyuda} className="text-[0.8125rem] text-fg-muted">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} role="alert" className="text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

// ---------- Selector segmentado ----------

interface PropsSegmentado<T extends string> {
  nombre: string
  etiqueta: string
  opciones: { valor: T; texto: ReactNode }[]
  valor: T | null | undefined
  onCambio: (valor: T) => void
  ocultarEtiqueta?: boolean
  disabled?: boolean
  pequeno?: boolean
}

/** Radios nativos con apariencia de botones: el teclado funciona como en cualquier grupo de radio. */
export function Segmentado<T extends string>({ nombre, etiqueta, opciones, valor, onCambio, ocultarEtiqueta, disabled, pequeno }: PropsSegmentado<T>) {
  // Solo lectura (consulta cerrada): se muestra el valor registrado, no las alternativas deshabilitadas.
  if (disabled) {
    const elegida = opciones.find((o) => o.valor === valor)
    return (
      <div className="flex min-w-0 flex-col gap-1">
        <p className={ocultarEtiqueta ? 'sr-only' : 'text-[0.8125rem] font-medium text-fg-muted'}>{etiqueta}</p>
        <p className={cx('flex items-center text-[0.9375rem]', pequeno ? 'min-h-8' : 'min-h-10', elegida ? 'font-semibold' : 'text-fg-muted')}>{elegida ? elegida.texto : '—'}</p>
      </div>
    )
  }
  return (
    <fieldset className="min-w-0">
      <legend className={ocultarEtiqueta ? 'sr-only' : 'mb-1 text-[0.8125rem] font-medium text-fg-muted'}>{etiqueta}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <label
            key={o.valor}
            className={cx(
              'inline-flex items-center justify-center rounded-md border font-medium transition-colors duration-150',
              'has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
              pequeno ? 'h-8 min-w-11 px-2.5 text-sm' : 'h-10 px-4',
              valor === o.valor ? 'border-primary bg-primary-soft text-fg ring-1 ring-primary' : 'border-line-strong bg-surface text-fg hover:bg-muted',
            )}
          >
            <input type="radio" className="sr-only" name={nombre} value={o.valor} checked={valor === o.valor} onChange={() => onCambio(o.valor)} />
            {o.texto}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

// ---------- Aviso ----------

type TonoAviso = 'faltante' | 'info' | 'ok' | 'error'

// La forma del ícono distingue el tono (triángulo, círculo tachado, i, check), no solo el color.
// Fondo de color solo en lo que exige acción (faltante y error); información y confirmación van sobre
// la superficie con la barra izquierda.
const TONOS: Record<TonoAviso, { clase: string; icono: TipoIcono; colorIcono: string }> = {
  faltante: { clase: 'border-warn-line bg-warn-soft text-warn', icono: IconoFaltante, colorIcono: 'text-warn' },
  info: { clase: 'border-line border-l-primary bg-surface text-fg', icono: IconoInformacion, colorIcono: 'text-primary' },
  ok: { clase: 'border-line border-l-ok bg-surface text-fg', icono: IconoCompleto, colorIcono: 'text-ok' },
  error: { clase: 'border-danger bg-danger-soft text-danger', icono: IconoError, colorIcono: 'text-danger' },
}

/** Notificación en línea: barra izquierda, ícono de forma propia, título corto y qué hacer. */
export function Aviso({ tono = 'info', titulo, children, className, accion }: { tono?: TonoAviso; titulo: ReactNode; children?: ReactNode; className?: string; accion?: ReactNode }) {
  const { clase, icono: Icono, colorIcono } = TONOS[tono]
  return (
    <div className={cx('flex items-start gap-3 rounded-sm border border-l-[3px] px-4 py-3', clase, className)} role={tono === 'error' ? 'alert' : undefined}>
      <Icono size={20} className={cx('mt-0.5 shrink-0', colorIcono)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{titulo}</p>
        {children && <div className="mt-0.5 text-sm text-fg">{children}</div>}
      </div>
      {accion}
    </div>
  )
}

// ---------- Tarjeta y sección ----------

export function Tarjeta({ titulo, accion, children, className, id, pie }: { titulo?: ReactNode; accion?: ReactNode; children: ReactNode; className?: string; id?: string; pie?: ReactNode }) {
  return (
    <section aria-labelledby={titulo && id ? `${id}-titulo` : undefined} className={cx('min-w-0 rounded-lg border border-line bg-surface', className)}>
      {titulo && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
          <h2 id={id ? `${id}-titulo` : undefined} className="text-base font-semibold">
            {titulo}
          </h2>
          {accion}
        </header>
      )}
      <div className="p-4 sm:p-5">{children}</div>
      {pie && <footer className="border-t border-line px-4 py-3 text-[0.8125rem] text-fg-muted sm:px-5">{pie}</footer>}
    </section>
  )
}

// ---------- Marcas clínicas ----------

/** La sigla del ojo siempre visible; el color acompaña, no reemplaza. */
export function SiglaOjo({ ojo, className }: { ojo: Lateralidad; className?: string }) {
  const clase = ojo === 'OD' ? 'bg-od-soft text-od' : ojo === 'OI' ? 'bg-oi-soft text-oi' : 'bg-muted text-fg'
  const titulo = ojo === 'OD' ? 'Ojo derecho' : ojo === 'OI' ? 'Ojo izquierdo' : 'Ambos ojos'
  return (
    <abbr title={titulo} className={cx('inline-flex h-6 min-w-8 items-center justify-center rounded px-1.5 text-[0.8125rem] font-bold no-underline', clase, className)}>
      {ojo}
    </abbr>
  )
}

/** Etiqueta con borde. Solo faltante y error llevan fondo, porque piden acción. */
export function Insignia({ children, tono = 'neutro', icono: Icono, className }: { children: ReactNode; tono?: 'neutro' | 'faltante' | 'ok' | 'info' | 'error'; icono?: TipoIcono; className?: string }) {
  const clase = {
    neutro: 'border-line-strong text-fg-muted',
    faltante: 'border-warn-line bg-warn-soft text-warn',
    ok: 'border-ok text-ok',
    info: 'border-primary text-primary',
    error: 'border-danger bg-danger-soft text-danger',
  }[tono]
  return (
    <span className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-sm border px-1.5 py-0.5 text-[0.8125rem] font-medium', clase, className)}>
      {Icono && <Icono size={16} className="shrink-0" aria-hidden="true" />}
      {children}
    </span>
  )
}

export function Autoria({ texto }: { texto: ReactNode }) {
  return <p className="text-[0.8125rem] text-fg-muted">{texto}</p>
}
