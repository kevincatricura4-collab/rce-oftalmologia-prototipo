import type { EstadoAtencion } from '../lib/tipos'
import { IconoCompleto, IconoConPreAtencion, IconoEnAtencion, IconoSinIniciar, type Icono } from './iconos'
import { cx } from './ui'

// Indicador de estado al estilo Carbon: texto en color normal y color solo en el ícono. La forma
// avanza con el estado (anillo punteado → cuña → mitad → check relleno), así que se distingue sin
// color (MASTER, convención 5). "En atención" no va en ámbar: el ámbar es solo para datos faltantes.
export const ESTADOS: Record<EstadoAtencion, { nombre: string; icono: Icono; colorIcono: string }> = {
  en_espera: { nombre: 'En espera', icono: IconoSinIniciar, colorIcono: 'text-fg-muted' },
  con_pre_atencion: { nombre: 'Con pre-atención', icono: IconoConPreAtencion, colorIcono: 'text-primary' },
  en_atencion: { nombre: 'En atención', icono: IconoEnAtencion, colorIcono: 'text-primary' },
  cerrado: { nombre: 'Cerrado', icono: IconoCompleto, colorIcono: 'text-ok' },
}

export const ORDEN_ESTADOS: EstadoAtencion[] = ['en_espera', 'con_pre_atencion', 'en_atencion', 'cerrado']

export function EstadoCita({ estado, className }: { estado: EstadoAtencion; className?: string }) {
  const { nombre, icono: IconoEstado, colorIcono } = ESTADOS[estado]
  return (
    <span className={cx('inline-flex items-center gap-1.5 whitespace-nowrap text-[0.8125rem] font-medium text-fg', className)}>
      <IconoEstado size={16} className={cx('shrink-0', colorIcono)} aria-hidden="true" />
      {nombre}
    </span>
  )
}
