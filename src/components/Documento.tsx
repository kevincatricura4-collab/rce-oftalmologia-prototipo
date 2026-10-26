import { Dialog, DialogBody, DialogFooter } from '@blueprintjs/core'
import { useEffect, useRef, type ReactNode } from 'react'
import { paciente as buscarPaciente } from '../lib/datos'
import { documento, edad, fechaHora } from '../lib/formato'
import { useEstado, usuarioPorId } from '../lib/store'
import { IconoImprimir } from './iconos'
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
    <article className={cx('mx-auto w-full max-w-[42rem] rounded-md border border-line bg-surface p-6 text-fg sm:p-8', 'hoja-imprimible', imprimible && 'documento-emitido')}>
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
  const contenedor = useRef<HTMLDivElement>(null)
  const enfocar = () => contenedor.current?.querySelector<HTMLButtonElement>('[data-focus-documento]')?.focus()
  useEffect(() => {
    if (!abierto) return
    // El navegador puede perder el foco al ocultar los controles para imprimir.
    const alVolver = () => requestAnimationFrame(enfocar)
    const medio = window.matchMedia('print')
    const cambiarMedio = (evento: MediaQueryListEvent) => { if (!evento.matches) alVolver() }
    window.addEventListener('afterprint', alVolver)
    medio.addEventListener('change', cambiarMedio)
    return () => { window.removeEventListener('afterprint', alVolver); medio.removeEventListener('change', cambiarMedio) }
  }, [abierto])
  return <Dialog isOpen={abierto} onClose={onCerrar} title={titulo} isCloseButtonShown={false} className="rce-document-dialog" transitionDuration={0}
    containerRef={contenedor} onOpened={enfocar}>
    <DialogBody>{children}</DialogBody>
    <DialogFooter actions={<>{acciones}<Boton data-focus-documento onClick={onCerrar}>Cerrar vista previa</Boton><Boton variante="primario" icono={IconoImprimir} onClick={() => window.print()}>Imprimir</Boton></>} />
  </Dialog>
}
