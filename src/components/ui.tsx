import { Button, Callout, Card, FormGroup, HTMLSelect, InputGroup, Radio, RadioGroup, Tag, TextArea, type ButtonProps, type Intent } from '@blueprintjs/core'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import type { Lateralidad } from '../lib/tipos'
import { IconoCompleto, IconoError, IconoFaltante, IconoInformacion, type Icono as TipoIcono } from './iconos'

/** Adaptadores de Blueprint: conservan los contratos de los formularios clínicos. */
export function cx(...clases: (string | false | null | undefined)[]): string {
  return clases.filter(Boolean).join(' ')
}
type Variante = 'primario' | 'secundario' | 'fantasma' | 'peligro'
interface PropsBoton extends Omit<ButtonProps, 'icon' | 'size' | 'variant'> {
  variante?: Variante
  icono?: TipoIcono
  pequeno?: boolean
}
export function Boton({ variante = 'secundario', icono: Icono, pequeno, className, children, type = 'button', ...resto }: PropsBoton) {
  return <Button {...resto} type={type} size={pequeno ? 'medium' : 'large'}
    intent={variante === 'primario' ? 'primary' : variante === 'peligro' ? 'danger' : 'none'}
    variant={variante === 'fantasma' ? 'minimal' : variante === 'secundario' ? 'outlined' : 'solid'}
    icon={Icono ? <Icono size={16} aria-hidden="true" /> : undefined}
    className={cx('rce-button', className)}>{children}</Button>
}
export const claseEntrada = 'bp6-input rce-input w-full min-w-0'
export function Entrada({ className, size, value, defaultValue, iconoIzquierdo, ...resto }: InputHTMLAttributes<HTMLInputElement> & { iconoIzquierdo?: ReactNode }) {
  return <InputGroup {...resto} fill size="large" inputSize={size} value={value == null ? undefined : String(value)}
    defaultValue={defaultValue == null ? undefined : String(defaultValue)} leftElement={iconoIzquierdo ? <span className="rce-input-icon">{iconoIzquierdo}</span> : undefined} className="rce-input-group" inputClassName={cx('rce-input', className)} />
}
export function Seleccion({ className, children, multiple: _multiple, value, defaultValue, ...resto }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <HTMLSelect {...resto} fill large value={value == null ? undefined : String(value)} defaultValue={defaultValue == null ? undefined : String(defaultValue)} className={cx('rce-select', className?.replace(/\bbp6-input\b|\brce-input\b/g, ''))}>{children}</HTMLSelect>
}
export function AreaTexto({ className, ...resto }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <TextArea {...resto} fill className={cx('rce-textarea', className)} />
}
interface PropsCampo {
  etiqueta: ReactNode
  ayuda?: ReactNode
  error?: string
  className?: string
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
}
export function Campo({ etiqueta, ayuda, error, className, children }: PropsCampo) {
  const id = useId()
  const descripcion = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return <FormGroup label={etiqueta} labelFor={id} intent={error ? 'danger' : 'none'} className={cx('rce-field', className)}
    helperText={<>{ayuda && <span id={`${id}-ayuda`}>{ayuda}</span>}{error && <span id={`${id}-error`} role="alert" className="block">{error}</span>}</>}>
    {children({ id, 'aria-describedby': descripcion, 'aria-invalid': error ? true : undefined })}
  </FormGroup>
}
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
export function Segmentado<T extends string>({ nombre, etiqueta, opciones, valor, onCambio, ocultarEtiqueta, disabled, pequeno }: PropsSegmentado<T>) {
  const id = useId()
  if (disabled) return <div className="min-w-0"><p className={ocultarEtiqueta ? 'sr-only' : 'mb-1 text-[0.8125rem] font-medium text-fg-muted'}>{etiqueta}</p><Tag minimal>{opciones.find((o) => o.valor === valor)?.texto ?? '—'}</Tag></div>
  return <div className={cx('rce-segmented', pequeno && 'rce-segmented-small')}>
    <p id={id} className={ocultarEtiqueta ? 'sr-only' : 'mb-2 text-[0.8125rem] font-semibold text-fg-muted'}>{etiqueta}</p>
    <RadioGroup name={nombre} aria-labelledby={id} selectedValue={valor ?? ''} onChange={(e) => onCambio(e.currentTarget.value as T)} inline>
      {opciones.map((o) => <Radio key={o.valor} value={o.valor} labelElement={o.texto} />)}
    </RadioGroup>
  </div>
}
type TonoAviso = 'faltante' | 'info' | 'ok' | 'error'
const TONOS: Record<TonoAviso, { intent: Intent; icono: TipoIcono }> = {
  faltante: { intent: 'warning', icono: IconoFaltante }, info: { intent: 'primary', icono: IconoInformacion },
  ok: { intent: 'success', icono: IconoCompleto }, error: { intent: 'danger', icono: IconoError },
}
export function Aviso({ tono = 'info', titulo, children, className, accion }: { tono?: TonoAviso; titulo: ReactNode; children?: ReactNode; className?: string; accion?: ReactNode }) {
  const { intent, icono: Icono } = TONOS[tono]
  return <Callout intent={intent} icon={<Icono size={20} className="bp6-icon" aria-hidden="true" />} title={typeof titulo === 'string' ? titulo : undefined} className={cx('rce-callout', className)} role={tono === 'error' ? 'alert' : undefined}>
    {typeof titulo !== 'string' && <h3 className="mb-2 font-semibold">{titulo}</h3>}{children}{accion && <div className="mt-3 flex justify-end">{accion}</div>}
  </Callout>
}
export function Tarjeta({ titulo, accion, children, className, id, pie }: { titulo?: ReactNode; accion?: ReactNode; children: ReactNode; className?: string; id?: string; pie?: ReactNode }) {
  return <section aria-labelledby={titulo && id ? `${id}-titulo` : undefined} className={cx('min-w-0', className)}>
    <Card className="rce-card">
      {titulo && <header className="rce-card-header"><h2 id={id ? `${id}-titulo` : undefined}>{titulo}</h2>{accion}</header>}
      <div className="p-4 sm:p-5">{children}</div>
      {pie && <footer className="rce-card-footer">{pie}</footer>}
    </Card>
  </section>
}
export function SiglaOjo({ ojo, className }: { ojo: Lateralidad; className?: string }) {
  return <Tag minimal className={cx(ojo === 'OD' ? 'text-od' : ojo === 'OI' ? 'text-oi' : 'text-fg-muted', className)}><abbr className="no-underline" title={ojo === 'OD' ? 'Ojo derecho' : ojo === 'OI' ? 'Ojo izquierdo' : 'Ambos ojos'}>{ojo}</abbr></Tag>
}
export function Insignia({ children, tono = 'neutro', icono: Icono, className }: { children: ReactNode; tono?: 'neutro' | 'faltante' | 'ok' | 'info' | 'error'; icono?: TipoIcono; className?: string }) {
  const intent: Intent = tono === 'faltante' ? 'warning' : tono === 'ok' ? 'success' : tono === 'info' ? 'primary' : tono === 'error' ? 'danger' : 'none'
  return <Tag minimal intent={intent} icon={Icono ? <Icono size={16} aria-hidden="true" /> : undefined} className={cx('rce-tag', className)}>{children}</Tag>
}
export function Autoria({ texto }: { texto: ReactNode }) {
  return <p className="text-[0.8125rem] text-fg-muted">{texto}</p>
}
