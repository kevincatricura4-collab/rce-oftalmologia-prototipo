import { Printer, X } from '@phosphor-icons/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { paciente as buscarPaciente } from '../lib/datos'
import { documento, edad, fechaHora } from '../lib/formato'
import { useEstado, usuarioPorId } from '../lib/store'
import { Boton, cx } from './ui'

/**
 * Hoja imprimible común a receta, orden, contrarreferencia y resumen: membrete del hospital,
 * datos del paciente, cuerpo, autor y fecha (MASTER, Componentes).
 */
export function HojaDocumento({
  titulo,
  pacienteId,
  autorId,
  fecha,
  children,
  imprimible = false,
}: {
  titulo: string
  pacienteId: string
  autorId: string
  fecha: string | null
  children: ReactNode
  imprimible?: boolean
}) {
  const { datos } = useEstado()
  const p = buscarPaciente(pacienteId)
  const autor = usuarioPorId(datos, autorId)

  return (
    <article className={cx('mx-auto w-full max-w-[42rem] rounded-md border border-line bg-surface p-6 text-fg sm:p-8', imprimible && 'hoja-imprimible')}>
      <header className="flex items-start justify-between gap-4 border-b-2 border-fg pb-3">
        <div>
          <p className="font-display text-lg font-bold">Hospital San Lucas</p>
          <p className="text-sm">Policlínico de Oftalmología · Región del Biobío</p>
        </div>
        <p className="rounded border border-warn-line px-2 py-1 text-[0.8125rem] font-semibold text-warn">Datos de prueba · sin validez</p>
      </header>

      <h2 className="mt-4 text-center text-lg font-bold uppercase tracking-wide">{titulo}</h2>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded border border-line p-3 text-sm sm:grid-cols-[auto_1fr_auto_1fr]">
        <dt className="font-semibold">Paciente</dt>
        <dd>{p.nombre}</dd>
        <dt className="font-semibold">Documento</dt>
        <dd>{documento(p)}</dd>
        <dt className="font-semibold">Edad</dt>
        <dd>{edad(p.fechaNacimiento)} años</dd>
        <dt className="font-semibold">Ficha</dt>
        <dd>{p.ficha}</dd>
      </dl>

      <div className="mt-5 text-[0.9375rem]">{children}</div>

      <footer className="mt-10 flex flex-wrap items-end justify-between gap-6 text-sm">
        <p>
          {fecha ? <>Emitido el {fechaHora(fecha)}</> : <span className="font-semibold text-warn">Borrador, aún no emitido</span>}
        </p>
        <div className="min-w-56 border-t border-fg pt-1 text-center">
          <p className="font-semibold">{autor?.nombre ?? '—'}</p>
          <p>{autor?.profesion}</p>
          <p>RUN {autor?.run}</p>
        </div>
      </footer>
    </article>
  )
}

/** Vista previa en un diálogo, con impresión: solo sale la hoja (ver @media print). */
export function DialogoDocumento({ abierto, onCerrar, titulo, children, acciones }: { abierto: boolean; onCerrar: () => void; titulo: string; children: ReactNode; acciones?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierto && !d.open) d.showModal()
    if (!abierto && d.open) d.close()
  }, [abierto])

  // Se monta en <body>, fuera de #root, para que al imprimir salga solo la hoja.
  return createPortal(
    <dialog
      ref={ref}
      onClose={onCerrar}
      aria-label={titulo}
      className="m-auto max-h-[92dvh] w-[min(48rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-line bg-canvas p-0 text-fg shadow-2xl backdrop:bg-scrim"
    >
      {abierto && (
        <div className="flex max-h-[92dvh] flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 print:hidden">
            <h2 className="text-base font-semibold">{titulo}</h2>
            <div className="flex gap-2">
              {acciones}
              <Boton variante="primario" icono={Printer} onClick={() => window.print()}>
                Imprimir
              </Boton>
              <button type="button" onClick={onCerrar} aria-label="Cerrar vista previa" className="grid size-10 place-items-center rounded-md hover:bg-muted">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto p-4 sm:p-6">{children}</div>
        </div>
      )}
    </dialog>,
    document.body,
  )
}
