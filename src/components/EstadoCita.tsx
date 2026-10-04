import { CheckCircle, Clock, Eyeglasses, NotePencil, type Icon } from '@phosphor-icons/react'
import type { EstadoAtencion } from '../lib/tipos'
import { cx } from './ui'

// Cada estado lleva ícono y texto: nunca un punto de color solo (MASTER, convención 5).
export const ESTADOS: Record<EstadoAtencion, { nombre: string; icono: Icon; clase: string }> = {
  en_espera: { nombre: 'En espera', icono: Clock, clase: 'bg-muted text-fg' },
  con_pre_atencion: { nombre: 'Con pre-atención', icono: Eyeglasses, clase: 'bg-primary-soft text-primary' },
  en_atencion: { nombre: 'En atención', icono: NotePencil, clase: 'bg-warn-soft text-warn' },
  cerrado: { nombre: 'Cerrado', icono: CheckCircle, clase: 'bg-ok-soft text-ok' },
}

export const ORDEN_ESTADOS: EstadoAtencion[] = ['en_espera', 'con_pre_atencion', 'en_atencion', 'cerrado']

export function EstadoCita({ estado, className }: { estado: EstadoAtencion; className?: string }) {
  const { nombre, icono: Icono, clase } = ESTADOS[estado]
  return (
    <span className={cx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-[0.8125rem] font-semibold', clase, className)}>
      <Icono size={16} weight="bold" aria-hidden="true" />
      {nombre}
    </span>
  )
}
