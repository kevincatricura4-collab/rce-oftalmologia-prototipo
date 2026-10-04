import type { ReactNode } from 'react'
import { useEstado } from '../lib/store'
import { IconoDatosPrueba, IconoMenu, IconoModoClaro, IconoModoOscuro, LogoRce } from './iconos'

export function BarraSuperior({ children, onMenu }: { children?: ReactNode; onMenu?: () => void }) {
  const { tema, alternarTema } = useEstado()
  const oscuro = tema === 'oscuro'

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface px-4 sm:px-6 print:hidden">
      {onMenu && (
        <button
          type="button"
          onClick={onMenu}
          aria-label="Abrir menú"
          className="-ml-1 grid size-10 shrink-0 place-items-center rounded-md transition-colors duration-150 hover:bg-muted lg:hidden"
        >
          <IconoMenu size={20} aria-hidden="true" />
        </button>
      )}
      <LogoRce className="size-6 shrink-0 text-primary" />
      <p className="flex min-w-0 items-center gap-3 font-display text-base font-semibold">
        <span className="truncate">RCE Oftalmología</span>
        <span className="hidden border-l border-line pl-3 font-sans text-sm font-normal whitespace-nowrap text-fg-muted sm:inline">Hospital San Lucas</span>
      </p>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span className="inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-sm border border-warn-line bg-warn-soft px-2 text-[0.8125rem] font-semibold text-warn">
          <IconoDatosPrueba size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Datos de prueba</span>
          <span className="sm:hidden">Prueba</span>
        </span>
        {children}
        <button
          type="button"
          onClick={alternarTema}
          aria-pressed={oscuro}
          title="El examen con lámpara de hendidura se hace con la luz baja"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-line-strong px-3 text-sm font-medium transition-colors duration-150 hover:bg-muted"
        >
          {oscuro ? <IconoModoClaro size={16} aria-hidden="true" /> : <IconoModoOscuro size={16} aria-hidden="true" />}
          <span className="hidden xl:inline">{oscuro ? 'Modo claro' : 'Modo box oscuro'}</span>
          <span className="sr-only xl:hidden">{oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo box oscuro'}</span>
        </button>
      </div>
    </header>
  )
}
