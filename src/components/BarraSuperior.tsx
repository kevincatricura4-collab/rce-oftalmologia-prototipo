import { Eye, List, Moon, Sun, TestTube } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useEstado } from '../lib/store'

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
          <List size={22} aria-hidden="true" />
        </button>
      )}
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-on-primary" aria-hidden="true">
        <Eye size={20} weight="bold" />
      </span>
      <p className="min-w-0 truncate font-display text-base font-semibold">
        RCE Oftalmología <span className="hidden font-normal text-fg-muted sm:inline">· Hospital San Lucas</span>
      </p>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-warn-line bg-warn-soft px-2 py-1 text-[0.8125rem] font-medium text-warn">
          <TestTube size={16} aria-hidden="true" />
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
          {oscuro ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          <span className="hidden xl:inline">{oscuro ? 'Modo claro' : 'Modo box oscuro'}</span>
          <span className="sr-only xl:hidden">{oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo box oscuro'}</span>
        </button>
      </div>
    </header>
  )
}
